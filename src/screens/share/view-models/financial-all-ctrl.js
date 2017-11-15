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

    module.controller('ShareFinancialAllCtrl', ShareFinancialAll);

    ////////
    ShareFinancialAll.$inject = [
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
    function ShareFinancialAll($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.canGotoShare = false;

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

        vm.canGotoShare = false;


        /**
         * Items data request & update
         * @returns {*}
         */
        vm.couponList = [];

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                pageNo: pageIndex,
                pageSize: 10,
                opType: 'all'
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

                    for (var i = 0; i < vm.items.length; i++) {
                        vm.financialRecords = vm.items[i].records;
                        for (var j = 0; j < vm.financialRecords.length; j++) {
                            if (vm.financialRecords[j].transferOp == 'O') {
                                if (vm.financialRecords[j].toAccFundType == 'person_alipay') {
                                    vm.financialRecords[j].toAccFundTypeDesc = '支付宝';
                                } else {
                                    vm.financialRecords[j].toAccFundTypeDesc = '银行卡';
                                }
                            }
                        }
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