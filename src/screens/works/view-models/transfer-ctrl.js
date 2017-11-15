/**
 * screens - works
 * @create 2015/12/30
 * @author D.xw
 */
define([
    'screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WorksTransferCtrl', WorksTransfer);

    ////////
    WorksTransfer.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'CONSTANT',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT_UTILS'
    ];
    function WorksTransfer($rootScope, $scope, $location, $stateParams, $q, $window, constant, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope;
        var canBindInfo = settingCache.get('__req_info_user_have_name');
        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '提现',
                isShow: true
            }, $location);
        }

        vm.idx = 1;

        vm.userHistoryWithdrawAmount = 0;
        vm.bankCardAccountId = null;
        vm.bankName = null;
        vm.bankCardAccount = null;
        vm.supportAccountFundTypeList = null;
        vm.llqUserTy = null;
        vm.isEmpty = utils.isEmpty;

        vm.confirmBefore = confirmBefore;
        vm.gotoFinancialDetail = gotoFinancialDetail;


        vm.transfer = {
            accountType: "person_pingan"
        };

        vm.selectFundType = function (fundType) {
            vm.wallet.payPassword = null;
            vm.wallet.drawAmount = null;
            if (vm.transfer.accountType != fundType) {
                vm.transfer.accountType = fundType;
            }
        };

        vm.isSelectFundType = function (fundType) {
            return fundType == vm.transfer.accountType;
        };


        vm.supportAccountFundTypeList = ["person_pingan", "person_alipay"];

        //账户类型
        vm.AccountFundTypeList = [{
            name: '兼职账户',
            count: 0,
            number: 1,
            userAccountType: 'llq_part_job'
        }, {
            name: '任务账户',
            count: 0,
            number: 2,
            userAccountType: 'llq_app_pop'
        }];

        vm.wallet = {
            drawAmount: null,
            payPassword: null,
            accountId: null,
            moneyAmount: 0,
            accountName: "账户余额（元）"
        };
        vm.canShow = true;
        vm.thisAccount = vm.AccountFundTypeList[1].name;
        vm.llqUserTy = vm.AccountFundTypeList[1].userAccountType;
        vm.selectAccountType = selectAccountType;
        vm.isSelectAccountType = isSelectAccountType;

        vm.popCanTakeNow = true;
        function selectAccountType(item) {
            vm.thisAccount = item.name;
            vm.idx = item.number;
            vm.wallet.moneyAmount = item.count;
            vm.llqUserTy = item.userAccountType;
            vm.userAccountTypeDialog.closeDialog();
            vm.checkTask();
        }

        function isSelectAccountType(name) {
            return vm.thisAccount == name;
        }

        function getAppPopWithdrawMinAmount() {
            httpRequest.getReq(urlHelper.getUrl('getAppPopWithdrawMinAmount'))
                .then(function (d) {
                    if (d) {
                        vm.taskCanTakeNow = d;
                    }
                })
        }

        // alipay
        vm.alipay = {
            isVisible: false,
            newAlipayAccount: "",
            dialogBeforeHide: function () {
                vm.alipay.newAlipayAccount = "";
                return true;
            },
            openDialog: function () {
                if (canBindInfo) {
                    vm.alipay.newAlipayAccount = "";
                    vm.alipay.isVisible = true;
                } else {
                    utils.customDialog("亲，您未完成认证", "绑定支付宝前。请在APP中【我的认证】页面完成任意一个产品认证，以确认您的身份。", "我知道了,下载App", function (idx) {
                        if (idx == 2) {
                            utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                        } else {
                            vm.alipay.closeDialog();
                        }
                    });
                }
            },
            closeDialog: function () {
                vm.alipay.isVisible = false;
            },
            dialogSubmit: function () {
                var check = function () {
                    if (utils.isEmpty(vm.alipay.newAlipayAccount)) {
                        utils.error("新支付宝账号不能为空", vm.alipay.closeDialog);
                        return false;
                    }
                    return true;
                };

                if (check()) {
                    var requestParam = {
                        'acc_no': vm.alipay.newAlipayAccount
                    };
                    httpRequest.getReq(urlHelper.getUrl('bindFundAccount'), requestParam)
                        .then(function (d) {
                            reloadForAplipay();
                            utils.alert("修改绑定支付宝账号成功", vm.alipay.closeDialog);
                        }, function (d) {
                            utils.error("修改绑定支付宝账号失败：" + d.msg);
                        });
                }
            }
        };

        function reloadForAplipay() {
            httpRequest.getReq(urlHelper.getUrl('getAlipayAccounts'))
                .then(function (d) {
                    if (d.items && d.items.length > 0) {
                        var item = d.items[0];
                        vm.alipayAccountId = item.id;
                        vm.alipayAccount = item.accNo;
                    }
                });
        }

        // cardFn
        vm.cardFn = {
            reloadCardsFn: function (item) {
                if (item) {
                    if (!vm.bankCardAccountId) {
                        vm.bankCardName = item.bankName;
                        vm.bankCardAccountId = item.userFundAccountId;
                        vm.bankCardAccount = item.cardNo;
                    }
                } else {
                    vm.bankCardAccountId = null;
                    vm.bankCardAccount = null;
                    vm.bankCardName = null;
                }
            },
            selectedFn: function (item) {
                if (item) {
                    vm.bankCardAccountId = item.userFundAccountId;
                    vm.bankCardAccount = item.cardNo;
                    vm.bankCardName = item.bankName;
                }
            }
        };

        vm.bankOpenDialog = function () {
            utils.gotoUrl('/profile/res/card')
        }
        function checkMoneyAmount() {
            if (vm.wallet.drawAmount <= 0) {
                utils.error("亲，提现金额不能低于0元哦!");
                vm.wallet.drawAmount = null;
                vm.wallet.payPassword = null;
                return false;
            }
            if (vm.wallet.drawAmount > vm.wallet.moneyAmount) {
                utils.error("提现金额大于钱包余额，请您输入提现金额!");
                vm.wallet.drawAmount = null;
                vm.wallet.payPassword = null;
                return false;
            }
            if (vm.wallet.drawAmount < vm.taskCanTakeNow) {
                utils.error("提现金额小于最低可提现金额，请您输入提现金额!");
                vm.wallet.drawAmount = null;
                vm.wallet.payPassword = null;
                return false;
            }
            return true;
        }

        function checkAppBlanknote() {
            if (utils.isEmpty(vm.bankCardAccountId)) {
                utils.error("银行卡号不能为空，请选择您的银行卡!");
                return false;
            }
            if (utils.isEmpty(vm.wallet.drawAmount)) {
                utils.error("提现金额不能为空，请您输入提现金额！");
                return false;
            }
            if (utils.isEmpty(vm.wallet.payPassword)) {
                utils.error("支付密码不能为空，请您输入支付密码！");
                return false;
            }
            return true;
        }

        function checkAppalipy() {
            if (!vm.llqUserTy) {
                utils.error('请选择账户类型');
                return false;
            }
            if (utils.isEmpty(vm.alipayAccount)) {
                utils.error("支付宝账号不能为空，请绑定支付宝账号!");
                return false;
            }
            if (utils.isEmpty(vm.wallet.drawAmount)) {
                utils.error("提现金额不能为空，请您输入提现金额！");
                return false;
            }
            if (utils.isEmpty(vm.wallet.payPassword)) {
                utils.error("支付密码不能为空，请您输入支付密码！");
                return false;
            }
            return true;
        }

        function gotoWallet() {
            utils.gotoUrl('/profile/wallet');
        }

        function confirmBefore() {
            if (vm.transfer.accountType == 'person_pingan') {
                if (checkAppBlanknote() && checkMoneyAmount()) {
                    vm.wallet.accountId = vm.bankCardAccountId;
                    confirm();
                }
            } else if (vm.transfer.accountType == 'person_alipay') {
                if (checkAppalipy() && checkMoneyAmount()) {
                    vm.wallet.accountId = vm.alipayAccountId;
                    confirm();
                }
            }
        }

        function confirm() {
            //最后提交接口
            httpRequest.getReq(urlHelper.getUrl("withdraw"), null, {
                type: 'POST',
                data: {
                    withdrawAmount: vm.wallet.drawAmount,
                    withdrawPwd: vm.wallet.payPassword,
                    withdrawFundAccountId: vm.wallet.accountId,
                    userAccountType: vm.llqUserTy
                }
            }).then(function (d) {
                utils.alert("您的提现申请已提交，后台正在为您处理！", gotoWallet);
            }, function (d) {
                utils.error(d.msg);
                vm.wallet.payPassword = null;
            });
        }

        // userAccountTypeDialog
        vm.userAccountTypeDialog = {
            isVisible: false,
            openDialog: function () {
                vm.userAccountTypeDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.userAccountTypeDialog.isVisible = false;
            }
        };

        function getUserHistoryAmount(userAccountType) {
            httpRequest.getReq(urlHelper.getUrl('getUserHistoryAmount'), {
                userAccountType: userAccountType
            }, {
                ignoreLogin: false
            }).then(function (d) {
                vm.userHistoryWithdrawAmount = d;
            }, function () {

            })
        }

        function gotoFinancialDetail() {
            utils.gotoUrl("/share/financial/all");  //跳转到资金明细
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

        vm.checkTask = function () {
            if (vm.llqUserTy == 'llq_app_pop') {
                if (vm.wallet.drawAmount >= vm.taskCanTakeNow) {
                    vm.popCanTakeNow = false;
                } else {
                    vm.popCanTakeNow = true;
                }
            } else {
                vm.popCanTakeNow = false;
            }
        };

        function init() {

            getAppPopWithdrawMinAmount();
            reloadForAplipay();
            selectAccountType(vm.AccountFundTypeList[1]);

            httpRequest.getReq(urlHelper.getUrl("res"))
                .then(function (d) {
                    vm.blankBalanceCreditAmount = d.blankBalanceCreditAmount;
                    vm.blankTotalCreditAmount = d.blankTotalCreditAmount;
                });


            httpRequest.getReq(urlHelper.getUrl('getEwallet'))
                .then(function (d) {
                    vm.AccountFundTypeList[0].userAccountType = d.llqPartJob.userAccountType;
                    vm.AccountFundTypeList[0].count = d.llqPartJob.amount;
                    vm.AccountFundTypeList[1].userAccountType = d.llqAppPop.userAccountType;
                    vm.AccountFundTypeList[1].count = d.llqAppPop.amount;
                    vm.wallet.moneyAmount = d.llqAppPop.amount;
                });

            getUserHistoryAmount(vm.llqUserTy);


            var unWatch = vm.$watch('wallet.drawAmount', vm.checkTask, true);

            vm.$on('$destroy', function () {
                unWatch();
            });

        }

        init();
    }

});