/**
 * login login controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/weixin/module',
    'jq',
    'screens/weixin/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WeixinAgingCtrl', WeixinAging);

    ////////
    WeixinAging.$inject = [
        '$scope',
        '$location',
        '$stateParams',
        'httpRequest',
        'settingCache',
        '$timeout',
        'weixinUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function WeixinAging($scope, $location, $stateParams, httpRequest, settingCache, $timeout, urlHelper, constant, utils) {
        var vm = $scope;

        var code = $stateParams.code;
        var org_code = $stateParams.org_code;

        vm.submitDesc = {};

        vm.liftingDialog = {
            activityStatus: false,
            title: '零零期分期',
            content: null,
            memo: null,
            code: null,
            canApply: false,
            timeStatus: false,
            activityDefinitionList: [],
            showInput: false,
            init: function () {
                var content = jq("#liftingDialogContent");

                //获得活动
                httpRequest.getReq(urlHelper.getUrl('queryCreditActive'), {
                    code: code
                }, {
                    ignoreLogin: true
                }).then(function (d) {
                    if (d) {
                        vm.liftingDialog.title = d.name;
                        if (d.activityDefinitionList && d.activityDefinitionList.length > 0) {
                            vm.liftingDialog.showInput = true;
                            vm.liftingDialog.activityDefinitionList = d.activityDefinitionList;

                            content.html(utils.htmlDecode(d.descTxt));
                            for (var i = 0; i < vm.liftingDialog.activityDefinitionList.length; i++) {
                                if (vm.liftingDialog.activityDefinitionList[i].paramName == "org_code") {
                                    vm.liftingDialog.activityDefinitionList[i].defValue = org_code;
                                    vm.liftingDialog.activityDefinitionList[i].canWright = true;
                                }
                            }
                        }

                    }

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
            },
            check: function () {
                vm.ruleStatus = true;
                if (!vm.liftingDialog.showInput) {
                    if (!vm.params) {
                        alert("信息不能为空，请输入");
                        vm.ruleStatus = false;
                    }
                } else {
                    for (var i = 0; i < vm.liftingDialog.activityDefinitionList.length; i++) {
                        var reg = eval(vm.liftingDialog.activityDefinitionList[i].validateReg);

                        if (!(reg.test(vm.liftingDialog.activityDefinitionList[i].defValue))) {
                            alert(vm.liftingDialog.activityDefinitionList[i].errTib);
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

                if (vm.ruleStatus) {
                    httpRequest.getReq(urlHelper.getUrl('applyActivityDo'), null, {
                        type: 'POST',
                        ignoreLogin: true,
                        data: {
                            code: code,
                            desc: vm.params
                        },
                        isForm: true
                    }).then(function (d) {
                        alert("报名成功", gotoEnter);
                    }, function (d) {
                        alert(d.msg || "报名失败，请稍后重试");
                    });
                }
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
