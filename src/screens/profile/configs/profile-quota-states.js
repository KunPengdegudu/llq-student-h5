define([
    'angular',
    'text!screens/profile/views/quota-tpl.html',
    'text!screens/profile/views/quota-content-tpl.html',
    'text!screens/profile/views/quota-content-normal-tpl.html',
    'text!screens/profile/views/quota-content-abnormal-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/quota-ctrl',
    'screens/profile/view-models/quota-waitingFetch-ctrl',
    'screens/profile/view-models/quota-fetched-ctrl',
    'screens/profile/view-models/quota-expired-ctrl'

], function (angular,
             quotaTpl,
             quotaContentTpl,
             quotaContentNormalTpl,
             quotaContentAbnormalTpl
) {
    'use strict';

    angular
        .module('screens.profile.quota.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 消息-首页
                .state('profile-quota', {
                    url: '/profile/quota',
                    spmb: 'profile-quota',
                    title: '零零期-我的-额度提升',
                    controller: 'QuotaCtrl',
                    templateUrl: 'screens/profile/views/quota-tpl.html'
                })
                // 我的-额度提升-未领取
                .state('profile-quota-waitingFetch', {
                    parent: 'profile-quota',
                    url: '/waitingFetch',
                    spmb: 'profile-quota-waitingFetch',
                    title: '零零期-我的-额度提升-未领取',
                    controller: 'QuotaWaitingFetchCtrl',
                    templateUrl: 'screens/profile/views/quota-content-tpl.html'
                })
                // 我的-额度提升-已领取
                .state('profile-quota-fetched', {
                    parent: 'profile-quota',
                    url: '/fetched',
                    spmb: 'profile-quota-fetched',
                    title: '零零期-我的-额度提升-已领取',
                    controller: 'QuotaFetchedCtrl',
                    templateUrl: 'screens/profile/views/quota-content-tpl.html'
                })
                //我的-额度提升-已过期
                .state('profile-quota-expired', {
                    parent: 'profile-quota',
                    url: '/expired',
                    spmb: 'profile-quota-expired',
                    title: '零零期-我的-额度提升-已过期',
                    controller: 'QuotaExpiredCtrl',
                    templateUrl: 'screens/profile/views/quota-content-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/quota-tpl.html', quotaTpl);
            $templateCache.put('screens/profile/views/quota-content-tpl.html', quotaContentTpl);
            $templateCache.put('screens/profile/views/quota-content-normal-tpl.html', quotaContentNormalTpl);
            $templateCache.put('screens/profile/views/quota-content-abnormal-tpl.html', quotaContentAbnormalTpl);
        }]);
});