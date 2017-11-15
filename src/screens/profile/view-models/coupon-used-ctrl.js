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

    module.controller('ProfileCouponUsedCtrl', ProfileCouponUsed);

    ////////
    ProfileCouponUsed.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileCouponUsed($rootScope, $scope, $location, $q, httpRequest, urlHelper, utils) {
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
        function loadItems() {
            var dtd = $q.defer();
            var params = {
                pageNo: pageIndex,
                pageSize: 5
            };
            httpRequest.getReq(urlHelper.getUrl('shopCouponUsedList'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

                    if (d && d.items && d.items.length > 0) {
                        vm.couponList = d.items;
                        vm.isAbnormal = true;
                    }

                    if (items && items.length === 0) {
                        vm.canLoad = false;
                    }
                    vm.items = vm.items.concat(items);
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