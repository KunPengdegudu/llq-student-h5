define([
    'angular',
    'text!screens/product/views/detail-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/detail-ctrl'

], function (angular,
             productDetailTpl) {
    'use strict';

    angular
        .module('screens.product.detail.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 商品-商品详情
                .state('product-detail', {
                    url: '/product/detail?productId&promotionId&promotionType&referPage&selectedSkuAttrItemIds',
                    spmb:'product-detail',
                    title: '零零期-商品-商品详情',
                    controller: 'ProductDetailCtrl',
                    templateUrl: 'screens/product/views/detail-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/detail-tpl.html', productDetailTpl);
        }]);
});