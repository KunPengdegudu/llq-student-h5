/**
 * sale main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/sale/module',
    'jq',
    'screens/sale/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('SaleMainCtrl', SaleMain);

    ////////
    SaleMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'httpRequest',
        'saleUrlHelper',
        'CONSTANT_UTILS'
    ];
    function SaleMain($rootScope, $scope, $location, $stateParams, $q, $window, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1,
            carouseHeight = 0;


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/enter/main"
                },
                title: "天天特价",
                isShow: true
            }, $location);
        }

        vm.templateList = null;
        vm.bannerImgUrlList = null;
        vm.gotoProductDetail = gotoProductDetail;

        vm.promotionType = $stateParams.promotionType || "sale";
        vm.promotionId = $stateParams.promotionId;
        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('#/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            location.replace(url);
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
        function loadItems() {
            var dtd = $q.defer();
            var param = {
                offset: pageIndex,
                limit: 10,
                promotionId: vm.promotionId,
                promotionType: vm.promotionType
            }
            httpRequest.getReq(urlHelper.getUrl('listPagedProductInfoFromSearch'), param, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;
                var items = d.items;

                if (items && items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].mainProImgUrl) {
                            items[i].mainProImgUrl = utils.htmlDecode(items[i].mainProImgUrl);
                        }
                    }
                }

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

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }


        function init() {
            utils.checkAndUpdate();
        }

        init();
    }
});