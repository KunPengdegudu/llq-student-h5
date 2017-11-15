/**
 * sale main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'jq',
    'screens/profile/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProfileLiftingCtrl', ProfileLifting);

    ////////
    ProfileLifting.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        'httpRequest',
        'settingCache',
        '$loadingOverlay',
        '$timeout',
        'profileUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ProfileLifting($rootScope, $scope, $location, $stateParams, $q, httpRequest, settingCache, $loadingOverlay, $timeout, urlHelper, constant, utils) {
        var vm = $scope;

        var code = $stateParams.code;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "圆梦贷款",
                isShow: true
            }, $location);
        }

        vm.submitDesc = {};

        vm.liftingDialog = {
            activityStatus: false,
            title: null,
            content: null,
            memo: null,
            code: null,
            canApply: false,
            timeStatus: false,
            activityDefinitionList: [],
            showInput: false,
            init: function () {
                var content = jq("#liftingDialogContent");
                content.html('');

                //获得活动时间限定按钮状态
                httpRequest.getReq(urlHelper.getUrl('incCreditActive'), {
                    code: code
                }).then(function (d) {
                    if (d) {

                        if (d.activityDefinitionList && d.activityDefinitionList.length > 0) {
                            vm.liftingDialog.showInput = true;
                            vm.liftingDialog.activityDefinitionList = d.activityDefinitionList;
                        } else {
                            vm.liftingDialog.showInput = false;
                        }

                        var time = (new Date()).getTime();
                        if (d.startTime < time && time < d.endTime && d.status == 'valid') {
                            vm.liftingDialog.timeStatus = true;
                        }

                        $rootScope.navConfig.title = d.name;
                        content.html(utils.htmlDecode(d.descTxt));

                        vm.liftingDialog.memo = d.memo;
                        vm.liftingDialog.code = d.code;
                    }

                    //获得报名状态限定按钮状态
                    httpRequest.getReq(urlHelper.getUrl('queryApplyActivity'), {
                        code: code
                    }).then(function (d) {

                        if (d) {
                            vm.liftingDialog.canApply = d.canApply;
                            if (d.applyTime) {
                                vm.liftingDialog.activityStatus = true;
                            }
                        }

                    });
                });
            },
            getParams: function () {
                vm.param = null;
                if (!vm.liftingDialog.showInput) {
                    vm.params = vm.liftingDialog.content
                } else {
                    vm.params = {};
                    for (var i = 0; i < vm.liftingDialog.activityDefinitionList.length; i++) {
                        vm.params[vm.liftingDialog.activityDefinitionList[i].paramName] = vm.liftingDialog.activityDefinitionList[i].defValue;
                    }

                    vm.params = "json" + JSON.stringify(vm.params);
                }
            }
            ,
            check: function () {
                vm.ruleStatus = true;
                if (!vm.liftingDialog.showInput) {
                    if (!vm.params) {
                        utils.error("信息不能为空，请输入");
                        vm.ruleStatus = false;
                    }
                } else {
                    for (var i = 0; i < vm.liftingDialog.activityDefinitionList.length; i++) {
                        var reg = eval(vm.liftingDialog.activityDefinitionList[i].validateReg);

                        if (!(reg.test(vm.liftingDialog.activityDefinitionList[i].defValue))) {
                            utils.error(vm.liftingDialog.activityDefinitionList[i].errTib);
                            vm.ruleStatus = false;
                            break;
                        }

                    }
                }
            }
            ,
            doApply: function () {
                vm.liftingDialog.getParams();
                vm.liftingDialog.check();

                //获得报名状态限定按钮状态
                httpRequest.getReq(urlHelper.getUrl('queryApplyActivity'), {
                    code: code
                }).then(function (d) {

                    if (d) {
                        vm.liftingDialog.canApply = d.canApply;
                        if (!d.applyTime) {
                            if (vm.ruleStatus) {
                                httpRequest.getReq(urlHelper.getUrl('applyActivity'), null, {
                                    type: 'POST',
                                    data: {
                                        code: code,
                                        desc: vm.params
                                    },
                                    isForm: true
                                }).then(function (d) {
                                    utils.alert("报名成功", gotoEnter);
                                }, function (d) {
                                    utils.alert(d.msg || "报名失败，请稍后重试");
                                });
                            }

                        }
                    }

                }, function () {
                    utils.alert("活动已经结束");
                });
            }
        };

        function gotoEnter() {
            utils.gotoUrl("/enter/main");
        }


        function init() {

            vm.liftingDialog.init();


        }


        init();

    }

});
