/**
 * template main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/template/module',
    'jq',
    'screens/template/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('productListCtrl', productList);

    ////////
    productList.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$location',
        '$stateParams',
        '$q',
        'httpRequest',
        'templateUrlHelper',
        'CONSTANT_UTILS'
    ];
    function productList($rootScope, $scope, $state, $location, $stateParams, $q, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        var widgetCode = $stateParams.widgetCode;

        var nodeId = $stateParams.nodeId;

        var name = $stateParams.name;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: name,
                isShow: true
            }, $location);
        }

        vm.orderFactorId = '';
        vm.bannerImgUrlList = null;
        vm.flushPage = flushPage;
        vm.gotoProductDetail = gotoProductDetail;

        function flushPage() {
            reload();
            vm.$emit('reload');
        }

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });

            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage(url);
            } else {
                //$window.location.href = windowLocation + templateUrl;
                utils.gotoUrl(url);
            }
        }


        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        function loadItems() {
            var dtd = $q.defer();
            var param = {
                offset: pageIndex,
                limit: 10,
                nodeId: nodeId,
                widgetCode: widgetCode
            };
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), param, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;
                var items = d ? d.items : [];

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

        function getMsg() {
            if (!vm.items || vm.items.length === 0) {
                return ' ';
            }
        }

        function init() {

        }

        init();
    }

});