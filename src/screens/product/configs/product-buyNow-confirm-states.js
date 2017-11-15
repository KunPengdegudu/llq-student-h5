define([
    'angular',
    'text!screens/product/views/buyNow-confirm-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/buyNow-confirm-ctrl'

], function (angular,
             buyNowConfirmTpl) {
    'use strict';


    angular
        .module('screens.product.buyNowConfirm.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 确认订单
                .state('product-buyNow-confirm', {
                    url: '/product/buyNowConfirm?addressId&productId&proSkuId',
                    spmb: 'product-buyNow-confirm',
                    title: '零零期-立即购买-确认订单',
                    controller: 'ProductBuyNowConfirmCtrl',
                    templateUrl: 'screens/product/views/buyNow-confirm-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/buyNow-confirm-tpl.html', buyNowConfirmTpl);
        }]);
});