define([
    'angular',
    'text!screens/shop/views/main-tpl.html',
    'text!screens/shop/views/main-abnormal-tpl.html',
    'text!screens/shop/views/main-normal-tpl.html',

    'ui-router',

    'screens/shop/module',
    'screens/shop/view-models/main-ctrl'

], function (angular,
             shopMainTpl,
             shopMainAbnormalTpl,
             shopMainNormalTpl) {
    'use strict';


    angular
        .module('screens.shop.main.states', [
            'ui.router',
            'screens.shop'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 确认订单
                .state('shop-main', {
                    url: '/shop/main?shopId',
                    spmb: 'shop-main',
                    title: '零零期-商铺',
                    controller: 'shopMainCtrl',
                    templateUrl: 'screens/shop/views/main-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/shop/views/main-tpl.html', shopMainTpl);
            $templateCache.put('screens/shop/views/main-abnormal-tpl.html', shopMainAbnormalTpl);
            $templateCache.put('screens/shop/views/main-normal-tpl.html', shopMainNormalTpl);
        }]);
});