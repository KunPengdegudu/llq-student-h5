define([
    'angular',
    'text!screens/product/views/order-confirm-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/order-confirm-ctrl'

], function (angular,
             orderConfirmTpl
) {
    'use strict';



    angular
        .module('screens.product.orderconfirm.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 确认订单
                .state('product-order-confirm', {
                    url: '/product/orderconfirm?feedback&promotionId&promotionType&productId&productSkuId&rate&period&redirect&count&deliveryType&addressId',
                    spmb:'product-order-confirm',
                    title: '零零期-商品-确认订单',
                    controller: 'ProductOrderConfirmCtrl',
                    templateUrl: 'screens/product/views/order-confirm-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/order-confirm-tpl.html', orderConfirmTpl);
        }]);
});