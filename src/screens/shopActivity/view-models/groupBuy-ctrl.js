/**
 * shopActivity groupBuy controller
 * @create 2016/08/28
 * @author D.xw
 */
define([
    'screens/shopActivity/module',
    'jq',
    'qrcode',
    'screens/shopActivity/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ShopActivityGroupBuyCtrl', ShopActivityGroupBuy);

    ////////
    ShopActivityGroupBuy.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$q',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'shopActivityUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ShopActivityGroupBuy($rootScope, $scope, $stateParams, $q, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "团购活动",
                isShow: true
            }, $location);
        }

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.gotoProductDetail = gotoProductDetail;
        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;


        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();
            var params = {
                pageNo: pageIndex,
                pageSize: 10
            };

            httpRequest.getReq(urlHelper.getUrl('getProducts'), params, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;
                var items = d;

                if (items && items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].productPic) {
                            items[i].productPic = utils.htmlDecode(items[i].productPic);
                        }
                    }
                }

                if (items && items.length === 0) {
                    vm.canLoad = false;
                }
                vm.items = vm.items.concat(items);
                if (vm.items.length === 0) {
                    vm.isAbnormalg = true;
                }
                dtd.resolve();
            }, function () {
                dtd.reject();
            });
            return dtd.promise;
        }

        function countdownText() {

            var nowSec = Date.parse(new Date());
            for (var i = 0; i < vm.items.length; i++) {
                var myTimes, h, m, s;

                if (nowSec < vm.items[i].beginTime) {
                    myTimes = parseInt((vm.items[i].beginTime - nowSec) / 1000);
                    myTimes = myTimes - 1;

                } else if (nowSec > vm.items[i].beginTime && nowSec < vm.items[i].endTime) {
                    myTimes = parseInt((vm.items[i].endTime - nowSec) / 1000);
                    myTimes = myTimes - 1;
                }
                s = parseInt(myTimes % 60);
                m = parseInt((myTimes - s) / 60 % 60);
                h = parseInt((myTimes - s - m * 60) / (60 * 60) % 24);

                if (s < 10 && s > 0) {
                    s = 0 + "" + s;
                }
                if (m < 10) {
                    m = 0 + "" + m;
                }
                if (h < 10) {
                    h = 0 + "" + h;
                }

                vm.items[i].s = s;
                vm.items[i].m = m;
                vm.items[i].h = h;


            }

        }

        setInterval(function () {
            vm.$apply(countdownText);
        }, 1000);
        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
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

        function gotoProductDetail(productId, promotionType, skuAttrValues) {
            var selectedSkuAttrItemIds;
            if (skuAttrValues) {
                selectedSkuAttrItemIds = skuAttrValues;
            } else {
                selectedSkuAttrItemIds = '';
            }
            var url = utils.getUrlWithParams('#/product/detail', {
                productId: productId,
                promotionType: promotionType,
                selectedSkuAttrItemIds: selectedSkuAttrItemIds
            });

            location.replace(url);
        }


        function init() {

        }

        init();


    }

});