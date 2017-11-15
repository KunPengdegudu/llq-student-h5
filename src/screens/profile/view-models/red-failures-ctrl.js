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

    module.controller('ProfileRedFailuresCtrl', ProfileRedFailures);

    ////////
    ProfileRedFailures.$inject = [
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
    function ProfileRedFailures($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.canGotoShare=false;

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

        vm.canGotoShare=false;

        
        /**
         * Items data request & update
         * @returns {*}
         */
        vm.couponList = [];

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                pageNo: pageIndex,
                pageSize: 5
            };
            httpRequest.getReq(urlHelper.getUrl('getExpiredList'), params)
                .then(function (d) {
                console.log(d);
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

    }

});