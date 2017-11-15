/**
 * rechargeGame main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/rechargeGame/module',
    'jq',
    'qrcode',
    'screens/rechargeGame/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('gameSearchCtrl', gameSearch);

    ////////
    gameSearch.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$location',
        '$q',
        '$window',
        '$loadingOverlay',
        '$timeout',
        '$interval',
        'httpRequest',
        'settingCache',
        'rechargeGameUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function gameSearch($rootScope, $scope, $stateParams, $location, $q, $window, $loadingOverlay, $timeout, $interval, httpRequest, settingCache, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        var _categoryId = $stateParams.categoryId,
            _name = $stateParams.name,
            _productName = $stateParams.productName;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: _name + '充值',
                isShow: true
            }, $location);
        }

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
        vm.couponList = [];

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                offset: pageIndex,
                limit: 10,
                promotionType: 'aging',
                name: _productName,
                categoryType: 'virtual_game',
                categoryId: _categoryId
            };
            httpRequest.getReq(urlHelper.getUrl('listPagedProductInfoFromSearch'), params, {
                    type: 'POST',
                    ignoreLogin: true
                })
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

                    if (d && d.items && d.items.length > 0) {
                        vm.couponList = d.items;
                        vm.isAbnormal = true;
                    }
                    vm.items = vm.items.concat(items);
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

        vm.gotoDetail = gotoDetail;

        function gotoDetail(item) {
            var url = utils.getUrlWithParams('/recharge/game/details', {
                'prodId': item.productId
            });
            utils.gotoUrl(url);
        }

    }

})
;
