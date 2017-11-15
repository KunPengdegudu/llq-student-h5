/**
 * security main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/security/module',
    'screens/security/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('SecurityBankWithholdCtrl', SecurityBankWithhold);

    ////////
    SecurityBankWithhold.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$interval',
        'httpRequest',
        'securityUrlHelper',
        'CONSTANT_UTILS'
    ];

    function SecurityBankWithhold($rootScope, $scope, $location, $stateParams, $q, $interval, httpRequest, urlHelper, utils) {
        var vm = $scope;

        var _goBack = $stateParams.goBack;
        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "icon",
                leftBtnAttrs: {
                    icon: 'icon-back',
                    fn: function () {
                        showLeftBtn();
                    }
                },
                title: "自动代扣",
                isShow: true
            }, $location);
        }


        vm.openList = [];
        vm.doApply = doApply

        function doApply(url) {
            utils.gotoUrl(url);
        }

        vm.addBankCardDialog = {
            addBankCard: function (url) {
                vm.doApply(url)
            }
        };
        vm.withHold = false;
        vm.showButton = function () {
            if (vm.withHold) {
                utils.confirm('确定要关闭代扣服务吗?',function (buttonIndex) {
                    if (buttonIndex == 2) {
                        vm.withHold = !vm.withHold;
                        httpRequest.getReq(urlHelper.getUrl('setAutoRepay'), {isAutoRepay: vm.withHold}).then(function (d) {
                            console.log(d)
                        }, function (d) {
                            utils.error(d.msg);
                        });
                    } else {
                        vm.withHold = vm.withHold;
                        httpRequest.getReq(urlHelper.getUrl('setAutoRepay'), {isAutoRepay: vm.withHold}).then(function (d) {
                            console.log(d)
                        }, function (d) {
                            utils.error(d.msg);
                        });
                    }
                })
            } else {
                vm.withHold = !vm.withHold;
                httpRequest.getReq(urlHelper.getUrl('setAutoRepay'), {isAutoRepay: vm.withHold}).then(function (d) {
                    console.log(d)
                }, function (d) {
                    utils.error(d.msg);
                });
            }

        }
        vm.listWithholdingInfoByUserId = function () {
            httpRequest.getReq(urlHelper.getUrl('listWithholdingInfoByUserId'), null, {
                    type: 'POST'
            }).then(function (d) {
                vm.closeList = d.closeList;
                vm.openList = d.openList;
            }, function (d) {
                utils.error(d.msg);
            });
        }
        vm.FailureRebindCard = function (item) {
            httpRequest.getReq(urlHelper.getUrl('FailureRebindCard'), null, {
                type: 'POST',
                data: {
                    unBindFundId: item.userFundAccountId
                }
            }).then(function (d) {
                vm.authCode.openDialog(d.bankCardNo)
            }, function (d) {
                utils.error("重新验证失败：" + d.msg);
            });
        }
        vm.startDaikou = function (item) {
            if (item.status === 'open') {
                vm.isWithholding = false
            } else {
                vm.isWithholding = true
            }
            var param = {
                isWithholding: vm.isWithholding,
                withholdingId: item.withholdingId
            };
            httpRequest.getReq(urlHelper.getUrl('setWithholding'), param).then(function (d) {
                vm.listWithholdingInfoByUserId()
            }, function (d) {
                utils.error(d);
            });
        }


        function showLeftBtn() {
            if (vm.withHold && vm.openList.length < 1) {
                utils.customDialog('温馨提示', '您还未选择代扣银行卡，若您确认退出，将为您关闭自动代扣服务', '确认退出,让我想想', function (btnIdx) {
                    if (btnIdx == 1) {
                        //返回
                        var params = {
                            isAutoRepay: false
                        }
                        httpRequest.getReq(urlHelper.getUrl('setAutoRepay'), params).then(function (d) {
                            utils.gotoUrl(_goBack);
                        }, function (d) {
                            utils.error(d.msg);
                        });
                    }
                })
            } else {
                console.log(2)
                utils.gotoUrl(_goBack);

            }
        }

        function init() {
            httpRequest.getReq(urlHelper.getUrl('isAutoRepay'), null, {
                    type: 'POST'
                }
            ).then(function (d) {
                vm.withHold = d
                vm.listWithholdingInfoByUserId();
            }, function (d) {
                utils.error(d.msg);
            });
        }

        init();

    }
});