/**
 * profile my bill controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileMyBillDetailCtrl', ProfileMyBillDetail);

    ////////
    ProfileMyBillDetail.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$loadingOverlay',
        '$stateParams',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ProfileMyBillDetail($rootScope, $scope, $location, $loadingOverlay, $stateParams, httpRequest, urlHelper, constant, utils) {
        var vm = $scope;
        vm.repay = repay;


        vm.data = null;
        vm.moneyAmount = 0;
        vm.currentPeriod = 1;

        vm.resData = [0, 1];

        vm.resOptions = {
            percentageInnerCutout: 90
        };

        vm.detail = {
            colours: ["#cccccc", "#FF7617"]
        };

        var billNo = $stateParams.billNo;
        vm.billNo= $stateParams.billNo;

        
        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/mybill/billcurrent"
                },
                title: "账单详情",
                isShow: true
            }, $location);
        }

        vm.clipboard = {
            canCopy: navigator.appupdate && navigator.appupdate.setClipboard,
            hasCopy: false,
            setClipboard: function (text) {
                console.log(text)
                if (navigator.appupdate && navigator.appupdate.setClipboard) {
                    navigator.appupdate.setClipboard(text, function (data) {
                        vm.clipboard.hasCopy = true;
                        utils.alert("已复制到剪切板");
                    });
                }
            }
        };
        
        vm.payDialog = {
            item: null,
            schedule: null,
            params: {},
            openDialog: function (item, schedule) {
                vm.payDialog.item = item;
                vm.payDialog.schedule = schedule;

                vm.payDialog.params = {
                    repay_no: schedule.scheduleNo,
                    amountInterest: schedule.amountInterest,
                    item:vm.data
                };

                vm.payInfo.open();
            },
            successFn: flush
        };



        //vm.toggleAutoRepay = function () {
        //
        //    var checked = vm.checkAutoRepay();
        //
        //    if (checked) {
        //        // 取消
        //        repayCancelSign();
        //    } else {
        //        // 绑定
        //        vm.bankCardList.openDialog();
        //    }
        //};

        //
        //vm.canSignAutoRepay = function () {
        //
        //    if (!vm.data) {
        //        return false;
        //    }
        //
        //    var autoRepaySignStatus = vm.data.autoRepaySignStatus;
        //    if (utils.isEmpty(autoRepaySignStatus) || autoRepaySignStatus === 'un_sign' || autoRepaySignStatus === 'sign_failed') {
        //        return true;
        //    }
        //    return false;
        //};
        //
        //vm.checkAutoRepay = function () {
        //    return vm.data && (vm.data.autoRepaySignStatus === 'signed');
        //};

        //选择银行卡
        //vm.selectedCardFn = function (item) {
        //    if (vm.data) {
        //        vm.data.userFundAccountId = item.userFundAccountId;
        //        repaySign();
        //    }
        //};

        //代扣
        //function repaySign() {
        //    var item = vm.data;
        //    httpRequest.getReq(urlHelper.getUrl('repaySign'), {
        //        bill_no: item.billNo,
        //        userFundAccountId: item.userFundAccountId
        //    }).then(function (d) {
        //        item.autoRepaySignStatus = d.autoRepaySignStatus;
        //        item.autoRepayAccNo = d.autoRepayAccNo;
        //        utils.alert("亲，您的绑定代扣申请已经提交！");
        //    }, function (d) {
        //        utils.error(d.msg || "绑定代扣功能失败，请重试！");
        //    });
        //}

        //取消代扣
        //function repayCancelSign() {
        //    var item = vm.selectItem;
        //    utils.confirm("亲，是否要取消该账单的代扣功能？", function () {
        //        httpRequest.getReq(urlHelper.getUrl('repayCancelSign'), {
        //            bill_no: item.billNo
        //        }).then(function (d) {
        //            item.autoRepaySignStatus = "";
        //            item.autoRepayAccNo = null;
        //            utils.alert("亲，您的绑定代扣申请已经取消！");
        //        }, function (d) {
        //            utils.error(d.msg || "取消代扣功能失败，请重试！");
        //        });
        //    });
        //}



        function flush() {
            location.reload();
        }

        function init() {
            httpRequest.getReq(urlHelper.getUrl('getBillDetail'), {
                'billNo': billNo
            }).then(function (d) {
                vm.data = d;
                var j = 0;
                for (var i = 0; i < d.repaymentScheduleList.length; i++) {
                    vm.moneyAmount = vm.moneyAmount + Number(d.repaymentScheduleList[i].amountOutstanding);
                    if (d.repaymentScheduleList[i].status == 'success') {
                        j = j + 1;
                        if (d.repaymentScheduleList.length != 1) {
                            if (i != d.repaymentScheduleList.length - 1) {
                                vm.currentPeriod = d.repaymentScheduleList[i + 1].currentPeriod;
                            } else {
                                vm.currentPeriod = d.repaymentScheduleList[d.repaymentScheduleList.length].currentPeriod
                            }
                        } else {
                            vm.currentPeriod = d.period;
                        }
                    }
                }
                if (j == 0) {
                    vm.resData[0] = 0;
                    vm.resData[1] = 1;
                } else {
                    vm.resData[0] = j;
                    vm.resData[1] = d.repaymentScheduleList.length - j;
                }
                //vm.aa = new Date(parseInt(d.createTime) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
                vm.creaTime = new Date(d.createTime)
                vm.createTimer = vm.creaTime.toLocaleDateString().replace(/\//g, "-") + " " + vm.creaTime.toTimeString().substr(0, 8)
            }, function (d) {
                utils.error("获得还款计划出错, 请重试");
            });
        }

        function repay(item, schedule) {
            vm.payDialog.openDialog(item, schedule);
        }

        init();

    }

})
;