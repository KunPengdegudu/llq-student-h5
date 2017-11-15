/**
 * Created by fionaqin on 2017/8/28.
 */
define([
    'screens/groupBuying/module',
    'screens/groupBuying/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('myOrderAllCtrl', myOrderAll);

    ////////
    myOrderAll.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'groupBuyingUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function myOrderAll($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.showPtDetail = false;


        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

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

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                limit: 10,
                offset: pageIndex,
                status: "",
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

                        dropDown(item);  //倒计时
                    })

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

        vm.showRefundStatus = showRefundStatus;
        function showRefundStatus(item) {
            if (item.status && item.status != 'closed') {
                return true;
            }

            if (item.status && item.status == 'closed' && item.refundStatus && item.refundStatus == 'none') {
                return true;
            }
            return false;
        }

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

        //拼团详情
        vm.checkStatus = checkStatus;
        function checkStatus(status) {
            if (status == 'wait_pay' || status == 'closed') {
                return false;
            } else {
                return true;
            }
        }

        vm.gotoGrouponDetails = gotoGrouponDetails;
        function gotoGrouponDetails(item) {
            if (item.pinTuanInfo && item.pinTuanInfo.id) {
                var url = utils.getUrlWithParams('/groupBuying/details', {
                    tuanId: item.pinTuanInfo.id,
                    status: 'unchange'
                });
                utils.gotoUrl(url);
            }
        }


        //查看物流
        vm.showTrace = showTrace;
        vm.canTrace = canTrace;

        vm.traceDialog = {
            isVisible: false,
            hasTraceItems: false,
            traceInfo: {},
            openDialog: function () {
                vm.traceDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.traceDialog.isVisible = false;
            }
        };

        function showTraceFn(status) {
            if (status == "wait_delivery"
                || status == "confirm_delivery"
                || status == "finished"
                || status == "aging_ing") {
                return true;
            }
            return false;
        }

        function canTrace(item) {

            if (item.deliveryType == 'express' && (item.status == 'distribution_completed' && item.isMultiPackageDelivery && item.isPartDelivered)) {
                return true;
            }

            if (item.deliveryType == 'express' && showTraceFn(item.status)) {
                return true;
            }
            return false;
        }

        function showTrace(item) {

            vm.traceDialog.hasTraceItems = false;
            vm.traceDialog.traceInfo = {};

            httpRequest.getReq(urlHelper.getUrl('trace'), {
                orderId: item.id
            }).then(function (d) {
                if (d) {
                    vm.traceDialog.traceInfo = d;
                    if (d.trace && d.trace.traces && d.trace.traces.length > 0) {
                        vm.traceDialog.hasTraceItems = true;
                    }
                    vm.traceDialog.openDialog();
                } else {
                    utils.alert('暂无物流信息');
                }
            }, function () {
                vm.traceDialog.openDialog();
            });

        }

        //确认收货
        vm.confirmDeliveryOrder = confirmDeliveryOrder;
        function confirmDeliveryOrder(item) {
            utils.confirm("亲，是否确认收到货物么？", function (buttonIndex) {
                if (buttonIndex == 2) {
                    var params = {
                        order_id: item.id
                    };
                    httpRequest.getReq(urlHelper.getUrl('confirmOrderDelivery'), params)
                        .then(function (d) {
                            utils.alert("确认收货成功", flush);
                        }, function (d) {
                            utils.error("确认收货失败：" + d.msg);
                        });
                }
            });
        }

        function flush() {
            location.reload();
        }

        //倒计时
        function dropDown(item) {
            item.timeDiff = item.expireTime - item.currTime;
            setInterval(function () {
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