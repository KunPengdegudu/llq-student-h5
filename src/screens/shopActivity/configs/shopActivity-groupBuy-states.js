define([
    'angular',
    'text!screens/shopActivity/views/groupBuy-tpl.html',
    'text!screens/shopActivity/views/groupBuy-normal-tpl.html',
    'text!screens/shopActivity/views/groupBuy-abnormal-tpl.html',

    'ui-router',

    'screens/shopActivity/module',

    'screens/shopActivity/view-models/groupBuy-ctrl'

], function (angular,
             GroupBuyTpl,
             GroupBuyNormalTpl,
             GroupBuyAbnormalTpl) {
    'use strict';

    angular
        .module('screens.shopActivity.groupBuy.states', [
            'ui.router',
            'screens.shopActivity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 团购
                .state('shopActivity-groupBuy', {
                    url: '/shopActivity/groupBuy',
                    spmb: 'shopActivity-groupBuy',
                    title: '团购',
                    controller: 'ShopActivityGroupBuyCtrl',
                    templateUrl: 'screens/shopActivity/views/groupBuy-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/shopActivity/views/groupBuy-tpl.html', GroupBuyTpl);
            $templateCache.put('screens/shopActivity/views/groupBuy-normal-tpl.html', GroupBuyNormalTpl);
            $templateCache.put('screens/shopActivity/views/groupBuy-abnormal-tpl.html', GroupBuyAbnormalTpl);
        }]);
});