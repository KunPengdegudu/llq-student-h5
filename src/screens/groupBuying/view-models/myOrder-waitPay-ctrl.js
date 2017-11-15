/**
 * Created by fionaqin on 2017/8/28.
 */

define([
    'screens/groupBuying/module',
    'screens/groupBuying/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('myOrderWaitPayCtrl', myOrderWaitPay);

    myOrderWaitPay.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        '$timeout',
        '$interval',
        'httpRequest',
        'groupBuyingUrlHelper',
        'CONSTANT_UTILS'
    ];
    function myOrderWaitPay($rootScope, $scope, $location, $q, $timeout, $interval, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;
        // vm.ishow = false;

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
        vm.couponList = [];
        // vm.newTime = 0;

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                limit: 10,
                offset: pageIndex,
                status: "wait_pay",
                type: "pintuan"
            };
            httpRequest.getReq(urlHelper.getUrl('getMyOrder'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

                    items.forEach(function (item, idx) {

                        if (item.deliveryFee === 0) {
                            item.deliveryFeeText = '免运费';
                        } else {
                            item.deliveryFeeText = '包含邮费' + item.deliveryFee + '元';
                        }

                        item.showCheckDelivery = false;
                        if (item.status == 'waiting_deliver_goods' || 'wait_delivery') {
                            item.showCheckDelivery = true;
                        } else {
                            item.showCheckDelivery = false;
                        }

                        //倒计时
                        dropDown(item);
                    });


                    if (d && d.items && d.items.length > 0) {
                        vm.couponList = d.items;
                        vm.isAbnormal = true;
                    }
                    vm.items = vm.items.concat(items);

                    for (var i = 0; i < vm.items.length; i++) {
                        vm.items[i].style = {
                            'background': '#ff5f80'
                        }
                    }
                    if (items && items.length === 0) {
                        vm.canLoad = false;
                    }
                    dtd.resolve();
                }, function () {
                    dtd.reject();
                });
            return dtd.promise;
        };

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (!vm.items || vm.items.length === 0) {
                return ' ';
            }
        }

        //去支付
        vm.payOrder = payOrder;
        function payOrder(item) {
            vm.payDialog.openDialog(item);
        }

        vm.payDialog = {
            item: null,
            amount: null,
            params: {
                orderNos: null,
                agingTotalAmount: null,
                deliveryFee: null,
                agingBackUrl: null
            },
            openDialog: function (item) {
                vm.payDialog.item = item;
                vm.payDialog.amount = item.actualPayAmount;
                vm.payDialog.params.orderNos = item.orderNo;
                vm.payDialog.params.agingTotalAmount = item.payAmount;
                vm.payDialog.params.deliveryFee = item.deliveryFee;
                vm.payDialog.params.agingBackUrl = "/profile/myorder/orderall";
                vm.payInfo.open();
            }
        };

        //倒计时
        function dropDown(item) {
            item.timeDiff = item.expireTime - item.currTime;
            $interval(function () {
                if (item.timeDiff > 0) {
                    item.timeDiff = item.timeDiff - 1000;
                    item.dropDown = timeFormat(item.timeDiff);
                } else {
                    item.dropDown = "00" + ":" + "00";
                }
            }, 1000);
        }

        //时间格式处理
        var data = {};

        function timeFormat(time) {
            if (time && time > 0) {
                var thisTime = parseInt(time);
                if (typeof (thisTime) == 'number') {
                    var s, m;
                    s = (parseInt(time / 1000)) % 60;
                    m = parseInt(time / 1000 / 60);
                    data.minute = (m > 9) ? m : ('0' + m);
                    data.second = (s > 9) ? s : ('0' + s);
                    return data.minute + ":" + data.second;
                }
            }
        }
    }

});