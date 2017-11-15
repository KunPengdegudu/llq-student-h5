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

    module.controller('ProfileMyBillNextCtrl', ProfileMyBillNext);
    ////////
    ////////
    ProfileMyBillNext.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$q',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ProfileMyBillNext($scope, $rootScope, $location, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.more=more;
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
                pageSize: 20
            };

            httpRequest.getReq(urlHelper.getUrl('getFinishedBills'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d.items;
                    if (items && items.length === 0) {
                        vm.canLoad = false;
                    }
                    vm.items = vm.items.concat(items);
                    if (vm.items.length === 0) {
                        vm.isAbnormal = true;
                    }
                    dtd.resolve();
                }, function () {
                    dtd.reject();
                });
            return dtd.promise;
        }

        function more(item) {
            utils.gotoUrl("/profile/billdetail?billNo=" + item.billNo);
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
    }

});