/**
 * profile my wallet
 * @create 2016/02/22
 * @author D.xw
 */
define([
        'screens/profile/module',
        'screens/profile/utils/url-helper'
    ], function (module) {

        'use strict';

        module.controller('profileWalletsCtrl', profileWallets);

        ////////
        profileWallets.$inject = [
            '$rootScope',
            '$scope',
            '$location',
            '$stateParams',
            '$q',
            '$window',
            'CONSTANT',
            'settingCache',
            'httpRequest',
            'profileUrlHelper',
            'CONSTANT_UTILS'
        ];
        function profileWallets($rootScope, $scope, $location, $stateParams, $q, $window, constant, settingCache, httpRequest, urlHelper, utils) {
            var vm = $scope;
            var canBindInfo = settingCache.get('__req_info_user_have_name');

            if ($rootScope && $rootScope.navConfig) {
                $rootScope.resetNavConfig({
                    isShowLeftBtn: true,
                    leftBtnType: "back",
                    title: "我的钱包",
                    isShow: true
                }, $location);
            }

            vm.gotoBill = gotoBill;
            vm.gotoMyred = gotoMyred;
            vm.gotoResCard = gotoResCard;

            vm.wallet = {
                amount: 0,
                llqAmount: 0,
                partJobAmount: 0,
                freezeAmount: 0
            };

            function gotoBill() {
                utils.gotoUrl("/works/bill");
            }

            function gotoMyred() {
                utils.gotoUrl("/profile/myred");
            }

            function gotoResCard() {
                utils.gotoUrl("/profile/res/card");
            }

            function gotoAuthV1(idx) {
                if (idx == 2) {
                    utils.gotoUrl("/auth/main");
                } else {
                    utils.gotoUrl("profile/main");
                }
            }

            vm.gotoTransfer = gotoTransfer;

            function gotoTransfer() {

                httpRequest.getReq(urlHelper.getUrl('isPayPasswordSet'))
                    .then(function (d) {
                        if (d) {
                            utils.gotoUrl('/works/transfer'); // 去提现
                        } else {
                            utils.customDialog('提醒', '亲，您未设置支付密码，请先设置支付密码！', '去设置', function () {
                                vm.setPayPassword.openDialog();
                            });
                        }
                    }, function (d) {
                        utils.error(d.msg);
                    });
            }

            function reloadForAlipay() {
                vm.alipayAccountId = null;
                vm.alipayAccount = null;
                httpRequest.getReq(urlHelper.getUrl('getAlipayAccounts'))
                    .then(function (d) {
                        if (d.items && d.items.length > 0) {
                            var item = d.items[0];
                            vm.alipayAccountId = item.id;
                            vm.alipayAccount = item.accNo;
                        }
                    });
            }

            // alipay
            vm.alipay = {
                isVisible: false,
                newAlipayAccount: "",
                dialogBeforeHide: function () {
                    vm.alipay.newAlipayAccount = "";
                    return true;
                },
                dialogOpen: function () {
                    if (canBindInfo) {
                        vm.alipay.newAlipayAccount = "";
                        vm.alipay.isVisible = true;
                    } else {
                        utils.customDialog("亲，您未完成认证", "绑定支付宝前。请在APP中【我的认证】页面完成任意一个产品认证，以确认您的身份。", "我知道了,下载App", function (idx) {
                            if (idx == 2) {
                                utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                            } else {
                                vm.alipay.dialogClose();
                            }
                        });
                    }
                },
                dialogClose: function () {
                    reloadForAlipay();
                    vm.alipay.isVisible = false;
                },
                dialogSubmit: function () {
                    var check = checkAlipaySubmit();

                    if (check) {

                        var requestParam = {
                            'acc_no': vm.alipay.newAlipayAccount
                        };

                        httpRequest.getReq(urlHelper.getUrl('bindFundAccount'), requestParam)
                            .then(function (d) {
                                vm.data.alipayAccount = d.accNo;
                                utils.alert("修改绑定支付宝账号成功", vm.alipay.dialogClose);
                            }, function (d) {
                                utils.error("修改绑定支付宝账号失败：" + d.msg);
                            });
                    }
                }
            };

            function checkAlipaySubmit() {
                if (vm.alipay.newAlipayAccount == '') {
                    utils.error("新支付宝账号不能为空", vm.alipay.closeDialog);
                    return false;
                }
                return true;
            }

            function reload() {
                var requestParam = vm.requestParam;
                httpRequest.getReq(urlHelper.getUrl('res'), requestParam)
                    .then(function (d) {
                        vm.data = d;
                    });

                reloadForAlipay();

            }

            function init() {

                //账户余额接口
                httpRequest.getReq(urlHelper.getUrl('getEwallet'))
                    .then(function (d) {
                        vm.wallet.amount = d.totalAmount;
                        vm.wallet.llqAmount = d.llqAppPop.amount;
                        vm.wallet.partJobAmount = d.llqPartJob.amount;
                        vm.wallet.freezeAmount = d.freezeAmount;
                    });
                vm.requestParam = {};
                vm.$watch('requestParam', reload, true);
            }

            init();


        }

    }
)
