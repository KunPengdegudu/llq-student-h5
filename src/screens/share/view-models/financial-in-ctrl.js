/**
 * profile my order all controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/share/module',
    'screens/share/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ShareFinancialInCtrl', ShareFinancialIn);

    ////////
    ShareFinancialIn.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'shareUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ShareFinancialIn($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.canGotoShare = false;
        vm.gotoTaskShare = gotoTaskShare;
        function gotoTaskShare() {
            utils.gotoUrl('/share/task/share');
        }

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
                opType: 'in',   //all,in,out
                pageNo: pageIndex,
                pageSize: 10
            };
            httpRequest.getReq(urlHelper.getUrl('getFinancialDetail'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

                    if (d && d.items && d.items.length > 0) {
                        items.forEach(function (item, index) {
                            if (vm.items.length > 0) {
                                if (item.month == vm.items[vm.items.length - 1].month) {
                                    item.month = null;
                                }
                            }
                        });
                        vm.items = vm.items.concat(items);
                    }

                    if (d && d.items && d.items.length > 0) {
                        vm.isAbnormal = true;
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

        vm.gotoBlanknote = function (state) {
            if (state) {
                utils.gotoUrl("/blanknote/main");
            } else {
                utils.gotoUrl('/stage/category');
            }

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