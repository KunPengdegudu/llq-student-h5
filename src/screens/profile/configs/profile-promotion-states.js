define([
    'angular',
    'text!screens/profile/views/quota-promotion-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/quota-promotion-ctrl'

], function (angular,
             quotaPromotionTpl) {
    'use strict';

    angular
        .module('screens.profile.promotion.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-我的钱包
                .state('profile-promotion', {
                    url: '/profile/promotion',
                    spmb: 'profile-promotion',
                    title: '零零期-我的-额度提升',
                    controller: 'quotaPromotionCtrl',
                    templateUrl: 'screens/profile/views/quota-promotion-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/quota-promotion-tpl.html', quotaPromotionTpl);
        }]);
});