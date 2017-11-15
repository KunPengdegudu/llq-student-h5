define([
    'angular',
    'text!screens/profile/views/myorder-tpl.html',
    'text!screens/profile/views/myorder-content-tpl.html',
    'text!screens/profile/views/myorder-content-normal-tpl.html',
    'text!screens/profile/views/myorder-content-abnormal-tpl.html',

    'text!screens/profile/views/myorder-content-part-blanknote-tpl.html',
    'text!screens/profile/views/myorder-content-part-recharge-tpl.html',
    'text!screens/profile/views/myorder-content-part-other-tpl.html',
    'text!screens/profile/views/myorder-content-part-cart-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/myorder-ctrl',
    'screens/profile/view-models/myorder-all-ctrl',
    'screens/profile/view-models/myorder-sale-ctrl',
    'screens/profile/view-models/myorder-cash-ctrl'

], function (angular,
             profileMyOrderTpl,
             profileMyOrderContentTpl,
             profileMyOrderContentNormalTpl,
             profileMyOrderContentAbnormalTpl,
             profileMyOrderContentPartBlankNoteTpl,
             profileMyOrderContentPartRechargeTpl,
             profileMyOrderContentPartOtherTpl,
             profileMyOrderContentPartCartTpl
) {
    'use strict';



    angular
        .module('screens.profile.myorder.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-我的订单-Tab框架
                .state('profile-myorder', {
                    abstract: true,
                    url: '/profile/myorder',
                    spmb: 'profile-myorder',
                    title: '零零期-我的-我的订单',
                    controller: 'ProfileMyOrderCtrl',
                    templateUrl: 'screens/profile/views/myorder-tpl.html'
                })
                // 我的-我的订单-全部
                .state('profile-myorder-all', {
                    parent: 'profile-myorder',
                    url: '/orderall',
                    spmb: 'profile-myorder-all',
                    title: '零零期-我的-我的订单-全部',
                    controller: 'ProfileMyOrderAllCtrl',
                    templateUrl: 'screens/profile/views/myorder-content-tpl.html'
                })
                // 我的-我的订单-商品
                .state('profile-myorder-sale', {
                    parent: 'profile-myorder',
                    url: '/ordersale',
                    spmb: 'profile-myorder-sale',
                    title: '零零期-我的-我的订单-商品',
                    controller: 'ProfileMyOrderSaleCtrl',
                    templateUrl: 'screens/profile/views/myorder-content-tpl.html'
                })
                // 我的-我的订单-分期
                .state('profile-myorder-cash', {
                    parent: 'profile-myorder',
                    url: '/ordercash',
                    spmb: 'profile-myorder-cash',
                    title: '零零期-我的-我的订单-白条',
                    controller: 'ProfileMyOrderCashCtrl',
                    templateUrl: 'screens/profile/views/myorder-content-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/myorder-tpl.html', profileMyOrderTpl);
            $templateCache.put('screens/profile/views/myorder-content-tpl.html', profileMyOrderContentTpl);
            $templateCache.put('screens/profile/views/myorder-content-normal-tpl.html', profileMyOrderContentNormalTpl);
            $templateCache.put('screens/profile/views/myorder-content-abnormal-tpl.html', profileMyOrderContentAbnormalTpl);
            $templateCache.put('screens/profile/views/myorder-content-part-blanknote-tpl.html', profileMyOrderContentPartBlankNoteTpl);
            $templateCache.put('screens/profile/views/myorder-content-part-recharge-tpl.html', profileMyOrderContentPartRechargeTpl);
            $templateCache.put('screens/profile/views/myorder-content-part-other-tpl.html', profileMyOrderContentPartOtherTpl);
            $templateCache.put('screens/profile/views/myorder-content-part-cart-tpl.html', profileMyOrderContentPartCartTpl);
        }]);
});