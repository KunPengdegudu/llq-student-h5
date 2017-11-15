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

    module.controller('gamePurchaseCtrl', gamePurchase);

    ////////
    gamePurchase.$inject = [
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
    function gamePurchase($rootScope, $scope, $stateParams, $location, $q, $window, $loadingOverlay, $timeout, $interval, httpRequest, settingCache, urlHelper, constant, utils) {
        var vm = $scope,
            pageNo = 1;

        var _categoryId = $stateParams.categoryId,
            _name = $stateParams.name;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: _name,
                isShow: true,
                rightBtnType: "icon",
                rightBtnAttrs: {
                    icon: "icon-search",
                    fn: function () {
                        $rootScope.showSearch('game', _categoryId, _name);
                    }
                },
                isShowRightBtn: true
            }, $location);
        }

        vm.btns = [];
        vm.btns2 = [];

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.canGotoShare = false;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;


        vm.gotoDetail = gotoDetail;

        function gotoDetail(item) {
            var url = utils.getUrlWithParams('/recharge/game/details', {
                'prodId': item.id
            });
            utils.gotoUrl(url);
        }

        function queryProdDesc() {
            httpRequest.getReq(urlHelper.getUrl('queryProdDesc'), {
                'categoryId': _categoryId,
                'dataSize': 8
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items.length > 0) {
                    vm.btns = d.items.slice(0, 4);
                    vm.btns2 = d.items.slice(4);
                }
            })
        }

        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageNo = 1;
        }

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                pageNo: pageNo,
                pageSize: 5,
                categoryId: _categoryId
            };
            httpRequest.getReq(urlHelper.getUrl('queryProd'), params, {
                ignoreLogin: true
            }).then(function (d) {
                pageNo++;
                var items = d ? d.items : [];
                if (d && d.items && d.items.length > 0) {
                    vm.isAbnormal = true;
                }
                vm.items = vm.items.concat(items);
                if (items && items.length === 0) {
                    vm.canLoad = false;
                }
                dtd.resolve();
            }, function () {
                return dtd.promise;
            })
        }


        function getMsg() {
            if (!vm.items || vm.items.length === 0) {
                return ' ';
            }
        }

        function init() {
            queryProdDesc();
        }

        init();

    }

})
;
