/**
 * seckill main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileRedUsedCtrl', ProfileRedUsed);

    ////////
    ProfileRedUsed.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileRedUsed($rootScope, $scope, $location, $q, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;
    
        vm.canGotoShare=false;


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
            var params = {
                pageNo: pageIndex,
                pageSize: 5
            };
            httpRequest.getReq(urlHelper.getUrl('getUsedList'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

                    if (d && d.items && d.items.length > 0) {
                        vm.couponList = d.items;
                        vm.isAbnormal = true;
                    }
                    vm.items = vm.items.concat(items);
                    for (var i = 0; i < vm.items.length; i++) {
                        if (vm.items[i].couponType == 'service_fee_discount') {
                            if(vm.items[i].amount>0){
                                vm.items[i].showNumber = true;
                            }else{
                                vm.items[i].showNumber = false;
                                if (vm.items[i].discount == 0) {
                                    vm.items[i].desc = "全免";
                                } else {
                                    vm.items[i].desc = vm.items[i].discount + "折";
                                }
                            }
                            vm.items[i].typeText = "还款券";
                        }
                        if (vm.items[i].couponType == 'red_envelope') {
                            vm.items[i].showNumber = true;
                            vm.items[i].typeText = "红包";
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


    }

});