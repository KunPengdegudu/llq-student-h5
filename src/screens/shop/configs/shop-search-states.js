define([
    'angular',
    'text!screens/shop/views/search-tpl.html',
    'text!screens/shop/views/search-abnormal-tpl.html',
    'text!screens/shop/views/search-normal-tpl.html',

    'ui-router',

    'screens/shop/module',
    'screens/shop/view-models/search-ctrl'

], function (angular,
             shopSearchTpl,
             shopSearchAbnormalTpl,
             shopSearchNormalTpl) {
    'use strict';


    angular
        .module('screens.shop.search.states', [
            'ui.router',
            'screens.shop'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 确认订单
                .state('shop-search', {
                    url: '/shop/search?shopId&productName&name',
                    spmb: 'shop-search',
                    title: '零零期-商铺-搜索结果',
                    controller: 'shopSearchCtrl',
                    templateUrl: 'screens/shop/views/search-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/shop/views/search-tpl.html', shopSearchTpl);
            $templateCache.put('screens/shop/views/search-abnormal-tpl.html', shopSearchAbnormalTpl);
            $templateCache.put('screens/shop/views/search-normal-tpl.html', shopSearchNormalTpl);
        }]);
});