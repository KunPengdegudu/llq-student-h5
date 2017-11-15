/**
 * Created by fionaqin on 2017/8/28.
 */
define([
    'screens/groupBuying/module',
    'screens/groupBuying/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('myOrderDeliverCtrl', myOrderDeliver);

    myOrderDeliver.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        'httpRequest',
        'groupBuyingUrlHelper',
        'CONSTANT_UTILS'
    ];
    function myOrderDeliver($rootScope, $scope, $location, $q, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

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
                status: "waiting_deliver_goods",
                type: "pintuan"
            };
            httpRequest.getReq(urlHelper.getUrl('getMyOrder'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

                    items.forEach(function (item, idx) {
                        // item.grouponStatus = '未成团';
                        // if (item.pinTuanInfo) {
                        //     var numberDiff = item.pinTuanInfo.joinNum - item.pinTuanInfo.currJoinNum;
                        //     if (numberDiff == 0) {
                        //         item.grouponStatus = '已成团';
                        //     } else {
                        //         if (item.status == "pay_success") {
                        //             item.grouponStatus = '还差' + numberDiff + '人';
                        //         } else {
                        //             item.grouponStatus = '未成团';
                        //         }
                        //     }
                        // } else {
                        //     item.grouponStatus = null;
                        // }

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
        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (!vm.items || vm.items.length === 0) {
                return ' ';
            }
        }

        //拼团详情
        vm.checkStatus = checkStatus;
        function checkStatus(status) {
            if (status == 'wait_pay' || status == 'closed'){
                return false;
            }else{
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

    }
});