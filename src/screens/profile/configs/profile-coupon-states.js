define([
        'angular',
        'text!screens/profile/views/coupon-tpl.html',
        'text!screens/profile/views/coupon-abnormal-tpl.html',
        'text!screens/profile/views/coupon-notUsed-tpl.html',
        'text!screens/profile/views/coupon-notUsed-normal-tpl.html',

        'text!screens/profile/views/coupon-used-tpl.html',
        'text!screens/profile/views/coupon-used-normal-tpl.html',

        'text!screens/profile/views/coupon-failures-tpl.html',
        'text!screens/profile/views/coupon-failures-normal-tpl.html',

        'ui-router',

        'screens/profile/module',
        'screens/profile/view-models/coupon-ctrl',
        'screens/profile/view-models/coupon-notUsed-ctrl',
        'screens/profile/view-models/coupon-used-ctrl',
        'screens/profile/view-models/coupon-failures-ctrl'

    ], function (angular,
                 profileCouponTpl,
                 profileCouponAbnormalTpl,
                 profileCouponNotUsedTpl,
                 profileCouponNotUsedNormalTpl,
                 profileCouponUsedTpl,
                 profileCouponUsedNormalTpl,
                 profileCouponFailuresTpl,
                 profileCouponFailuresNormalTpl) {
        'use strict';

        angular
            .module('screens.profile.coupon.states', [
                'ui.router',
                'screens.profile'
            ])
            .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                    // 我的-我的折扣券
                    .state('profile-coupon', {
                        abstract: true,
                        url: '/profile/coupon',
                        spmb: 'profile-coupon',
                        title: '零零期-我的-我的折扣券',
                        controller: 'ProfileCouponCtrl',
                        templateUrl: 'screens/profile/views/coupon-tpl.html'
                    })
                    // 我的-我的折扣券-未使用
                    .state('profile-coupon-notUsed', {
                        parent: 'profile-coupon',
                        url: '/notUsed',
                        spmb: 'profile-coupon-notUsed',
                        title: '零零期-我的-我的折扣券-未使用',
                        controller: 'ProfileCouponNotUsedCtrl',
                        templateUrl: 'screens/profile/views/coupon-notUsed-tpl.html'
                    })
                    // 我的-我的折扣券-已过期
                    .state('profile-coupon-used', {
                        parent: 'profile-coupon',
                        url: '/used',
                        spmb: 'profile-coupon-used',
                        title: '零零期-我的-我的折扣券-已使用',
                        controller: 'ProfileCouponUsedCtrl',
                        templateUrl: 'screens/profile/views/coupon-used-tpl.html'
                    })
                    // 我的-我的折扣券-已失效
                    .state('profile-coupon-failures', {
                        parent: 'profile-coupon',
                        url: '/failures',
                        spmb: 'profile-coupon-failures',
                        title: '零零期-我的-我的折扣券-已失效',
                        controller: 'ProfileCouponFailuresCtrl',
                        templateUrl: 'screens/profile/views/coupon-failures-tpl.html'
                    });
            }])
            .run(['$templateCache', function ($templateCache) {
                $templateCache.put('screens/profile/views/coupon-tpl.html', profileCouponTpl);
                $templateCache.put('screens/profile/views/coupon-abnormal-tpl.html', profileCouponAbnormalTpl);
                $templateCache.put('screens/profile/views/coupon-notUsed-tpl.html', profileCouponNotUsedTpl);
                $templateCache.put('screens/profile/views/coupon-notUsed-normal-tpl.html', profileCouponNotUsedNormalTpl);

                $templateCache.put('screens/profile/views/coupon-used-tpl.html', profileCouponUsedTpl);
                $templateCache.put('screens/profile/views/coupon-used-normal-tpl.html', profileCouponUsedNormalTpl);

                $templateCache.put('screens/profile/views/coupon-failures-tpl.html', profileCouponFailuresTpl);
                $templateCache.put('screens/profile/views/coupon-failures-normal-tpl.html', profileCouponFailuresNormalTpl);
            }]);
    }
)
;