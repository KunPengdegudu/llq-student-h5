define([
    'angular',
    'text!screens/activeCenter/views/coupon-tpl.html',
    'ui-router',

    'screens/activeCenter/module',
    'screens/activeCenter/view-models/coupon-ctrl'
], function (angular,
             activeCenterCouponTpl) {
    'use strict';

    angular
        .module('screens.activeCenter.coupon.states', [
            'ui.router',
            'screens.activeCenter'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 商品满减
                .state('activeCenter-coupon', {
                    url: '/activeCenter/coupon?name',
                    title: '活动中心-a818-领取优惠券',
                    controller: 'activeCenterCouponCtrl',
                    templateUrl: 'screens/activeCenter/views/coupon-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activeCenter/views/coupon-tpl.html', activeCenterCouponTpl);
        }]);
});