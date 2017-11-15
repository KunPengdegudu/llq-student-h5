/**
 * profile my order all controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileMyBillCurrentCtrl', ProfileMyBillCurrent);

    ////////
    ProfileMyBillCurrent.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    function ProfileMyBillCurrent($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        vm.repay = repay;
        vm.more = more;

        vm.payDialog = {
            item: null,
            schedule: null,
            params: {},
            openDialog: function (item, schedule) {

                if (!item) {
                    return;
                }

                vm.payDialog.item = item;
                vm.payDialog.schedule = schedule;

                vm.payDialog.params = {
                    repay_no: schedule.scheduleNo,
                    amountInterest: schedule.amountInterest,
                    item: item.item

                };

                vm.payInfo.open();
            }
        };

        vm.selectItem = null;

        vm.toggleAutoRepay = function (item) {

            vm.selectItem = item;

            var checked = vm.checkAutoRepay(item);

            if (checked) {
                // 取消
                repayCancelSign();
            } else {
                // 绑定
                vm.bankCardList.openDialog();
            }
        };
        vm.canSignAutoRepay = function (item) {

            if (!item) {
                return false;
            }

            var autoRepaySignStatus = item.autoRepaySignStatus;
            if (utils.isEmpty(autoRepaySignStatus) || autoRepaySignStatus === 'un_sign' || autoRepaySignStatus === 'sign_failed') {
                return true;
            }
            return false;
        };

        vm.checkAutoRepay = function (item) {
            return item && (item.autoRepaySignStatus === 'signed');
        };

        vm.selectedCardFn = function (item) {
            var selectItem = vm.selectItem;
            if (selectItem) {
                selectItem.userFundAccountId = item.userFundAccountId;
                repaySign();
            }
        };

        function repaySign() {
            var item = vm.selectItem;
            httpRequest.getReq(urlHelper.getUrl('repaySign'), {
                bill_no: item.billNo,
                userFundAccountId: item.userFundAccountId
            }).then(function (d) {
                item.autoRepaySignStatus = d.autoRepaySignStatus;
                item.autoRepayAccNo = d.autoRepayAccNo;
                utils.alert("亲，您的绑定代扣申请已经提交！");
            }, function (d) {
                if (d.msg) {
                    utils.error(d.msg);
                } else {
                    utils.error("绑定代扣功能失败，请重试！");
                }

            });
        }

        function repayCancelSign() {
            var item = vm.selectItem;
            utils.confirm("亲，是否要取消该账单的代扣功能？", function () {
                httpRequest.getReq(urlHelper.getUrl('repayCancelSign'), {
                    bill_no: item.billNo
                }).then(function (d) {
                    item.autoRepaySignStatus = "";
                    item.autoRepayAccNo = null;
                    utils.alert("亲，您的绑定代扣申请已经取消！");
                }, function (d) {
                    utils.error(d.msg || "取消代扣功能失败，请重试！");
                });
            });
        }


        /**
         * Screen reload
         */
        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();

            httpRequest.getReq(urlHelper.getUrl('getCurrentBills'))
                .then(function (d) {
                    pageIndex++;

                    var items = new Array();

                    if (d.items && d.items.length > 0) {
                        for (var i = 0; i < d.items.length; i++) {
                            var item = d.items[i],
                                cur = item.repaymentScheduleList[item.currPeroid]
                            var bill = {
                                title: item.title,
                                period: item.period,
                                billNo: item.billNo,
                                autoRepaySignStatus: item.autoRepaySignStatus,
                                item: item,
                                schedule: new Array()
                            };

                            for (var j = 0; j <= item.currPeroid; j++) {
                                var schedule = item.repaymentScheduleList[j];
                                if (schedule.status == 'wait_pay' || schedule.status == 'overdue' || schedule.status == 'failed' || j == item.currPeroid) {
                                    schedule.dueTime = parseInt((schedule.dueTime - (new Date()).getTime()) / 86400000);
                                    bill.schedule.push(schedule);
                                }
                            }

                            items.push(bill);
                        }
                    }

                    vm.canLoad = false;
                    vm.items = vm.items.concat(items);
                    if (vm.items.length === 0) {
                        vm.isAbnormal = true;
                    }
                    dtd.resolve();
                    console.log(items)
                    // for (var k = 0; k < items.length; k++) {
                    //     if (items[k].schedule.status!='wait_pay' && items[k].schedule.status!='overdue' && items[k].schedule.status!='failed') {
                    //         vm.status = 'none';
                    //         console.log(1)
                    //     } else {
                    //         vm.status = 'block';
                    //         console.log(2)
                    //     }
                    // }
                    console.log(items)
                }, function () {
                    dtd.reject();
                });
            return dtd.promise;
        }

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        function flush() {
            location.reload();
        }

        function repay(item, schedule) {

            if (schedule.status != 'wait_pay' && schedule.status != 'overdue' && schedule.status != 'failed') {
                return;
            }
            vm.payDialog.openDialog(item, schedule);
        }

        function more(item) {
            utils.gotoUrl("/profile/billdetail?billNo=" + item.billNo);
        }
    }

});