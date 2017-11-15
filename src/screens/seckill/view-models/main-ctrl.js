/**
 * seckill main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/seckill/module',
    'screens/seckill/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('SeckillMainCtrl', SeckillMain);

    ////////
    SeckillMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        'httpRequest',
        'seckillUrlHelper',
        'CONSTANT_UTILS'
    ];
    function SeckillMain($rootScope, $scope, $location, $q, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "秒杀",
                isShow: true
            }, $location);
        }

        vm.promotionType = "seckill";
        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        vm.gotoProductDetail = gotoProductDetail;

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
            var params = {
                promotionType: vm.promotionType,
                offset: pageIndex,
                limit: 10
            };
            if (utils.isAppleStore()) {
                params.source = "appstore" + utils.getAppVersion();
            }
            httpRequest.getReq(urlHelper.getUrl('listPagedProductInfoFromSearch'), params, {
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