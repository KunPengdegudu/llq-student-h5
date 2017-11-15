define([
    'angular',
    'text!screens/product/views/car-confirm-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/car-confirm-ctrl'

], function (angular,
             carConfirmTpl
) {
    'use strict';



    angular
        .module('screens.product.carconfirm.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 确认订单
                .state('product-car-confirm', {
                    url: '/product/carconfirm?shopItemsStr',
                    spmb:'product-car-confirm',
                    title: '零零期-商品-确认订单',
                    controller: 'ProductCarConfirmCtrl',
                    templateUrl: 'screens/product/views/car-confirm-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/car-confirm-tpl.html', carConfirmTpl);
        }]);
});