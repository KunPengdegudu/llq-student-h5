define([
    'screens/shop/module',
    'jq',
    'screens/shop/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('shopSearchCtrl', shopSearch);

    ////////
    shopSearch.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$window',
        '$stateParams',
        '$location',
        '$timeout',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'shopUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function shopSearch($scope, $rootScope, $state, $window, $stateParams, $location, $timeout, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1,
            _productName = $stateParams.productName;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                showTextTitle: false,
                leftBtnType: "back",
                isShow: true
            }, $location);
        }

        vm.isAbnormal = false;
        vm.canLoad = true;
        vm.gotoProductDetail = gotoProductDetail;
        vm.shopId = $stateParams.shopId;
        vm.items = [];

        vm.loadItems = loadItems;
        vm.reload = reload;
        vm.getMsg = getMsg;

        vm.itemRows = [];

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            utils.gotoUrl(url);
        }


        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;

        }


        function loadItems() {
            var dtd = $q.defer();
            var param = {
                shopId: vm.shopId,
                offset: pageIndex,
                limit: 10,
                name: _productName
            };
            httpRequest.getReq(urlHelper.getUrl('listProductInfoFromSearch'), param, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;

                var items = jq.extend({
                    rows: []
                });

                var itemRows = [];

                for (var i = 0; i < d.items.length;) {
                    var row = [];
                    row.push(d.items[i++]);

                    if (i >= d.items.length + 1) {
                        break;
                    } else {
                        row.push(d.items[i++]);
                    }
                    items.rows.push(row);
                }

                itemRows = itemRows.concat(items.rows);
                vm.itemRows = vm.itemRows.concat(itemRows);

                if (d.items && d.items.length <= 1) {
                    vm.canLoad = false;
                }

                vm.items = vm.items.concat(vm.itemRows);

                if (vm.items.length === 0) {
                    vm.isAbnormal = true;
                }
                dtd.resolve();
            }, function () {
                dtd.reject();
            });
            return dtd.promise;
        }

        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        function init() {

        }

        init();
    }

});
