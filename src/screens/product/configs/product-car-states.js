define([
    'angular',
    'text!screens/product/views/car-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/car-ctrl'

], function (angular,
             productCarTpl) {
    'use strict';

    angular
        .module('screens.product.car.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 商品-商品详情
                .state('product-car', {
                    url: '/product/car',
                    spmb:'product-car',
                    title: '零零期-商品-购物车',
                    controller: 'ProductCarCtrl',
                    templateUrl: 'screens/product/views/car-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/car-tpl.html', productCarTpl);
        }]);
});