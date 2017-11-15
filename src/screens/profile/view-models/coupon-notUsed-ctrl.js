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

    module.controller('ProfileCouponNotUsedCtrl', ProfileCouponNotUsed);

    ////////
    ProfileCouponNotUsed.$inject = [
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
    function ProfileCouponNotUsed($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        vm.gotoShop = gotoShop;

        function gotoShop(shopName, shopId) {
            var url = utils.getUrlWithParams('/shop/main', {
                'shopId': shopId
            });
            utils.gotoUrl(url);
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
        vm.couponList = [];

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                pageNo: pageIndex,
                pageSize: 5
            };
            httpRequest.getReq(urlHelper.getUrl('shopCouponUsableList'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

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

    }

});