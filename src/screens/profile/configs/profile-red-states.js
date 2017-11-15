define([
        'angular',
        'text!screens/profile/views/red-tpl.html',
        'text!screens/profile/views/red-abnormal-tpl.html',
        'text!screens/profile/views/red-notUsed-tpl.html',
        'text!screens/profile/views/red-notUsed-normal-tpl.html',

        'text!screens/profile/views/red-used-tpl.html',
        'text!screens/profile/views/red-used-normal-tpl.html',

        'text!screens/profile/views/red-failures-tpl.html',
        'text!screens/profile/views/red-failures-normal-tpl.html',

        'ui-router',

        'screens/profile/module',
        'screens/profile/view-models/red-ctrl',
        'screens/profile/view-models/red-notUsed-ctrl',
        'screens/profile/view-models/red-used-ctrl',
        'screens/profile/view-models/red-failures-ctrl'

    ], function (angular,
                 profileRedTpl,
                 profileRedAbnormalTpl,
                 profileRedNotUsedTpl,
                 profileRedNotUsedNormalTpl,

                 profileRedUsedTpl,
                 profileRedUsedNormalTpl,

                 profileRedFailuresTpl,
                 profileRedFailuresNormalTpl) {
        'use strict';

        angular
            .module('screens.profile.red.states', [
                'ui.router',
                'screens.profile'
            ])
            .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                    // 我的-我的红包
                    .state('profile-red', {
                        abstract: true,
                        url: '/profile/red',
                        spmb: 'profile-red',
                        title: '零零期-我的-我的红包',
                        controller: 'ProfileRedCtrl',
                        templateUrl: 'screens/profile/views/red-tpl.html'
                    })
                    // 我的-我的红包-未使用
                    .state('profile-red-notUsed', {
                        parent: 'profile-red',
                        url: '/notUsed',
                        spmb: 'profile-red-notUsed',
                        title: '零零期-我的-我的红包-未使用',
                        controller: 'ProfileRedNotUsedCtrl',
                        templateUrl: 'screens/profile/views/red-notUsed-tpl.html'
                    })
                    // 我的-我的红包-已使用
                    .state('profile-red-used', {
                        parent: 'profile-red',
                        url: '/used',
                        spmb: 'profile-red-used',
                        title: '零零期-我的-我的红包-已过期',
                        controller: 'ProfileRedUsedCtrl',
                        templateUrl: 'screens/profile/views/red-used-tpl.html'
                    })
                    // 我的-我的红包-已失效
                    .state('profile-red-failures', {
                        parent: 'profile-red',
                        url: '/failures',
                        spmb: 'profile-red-failures',
                        title: '零零期-我的-我的红包-已失效',
                        controller: 'ProfileRedFailuresCtrl',
                        templateUrl: 'screens/profile/views/red-failures-tpl.html'
                    });
            }])
            .run(['$templateCache', function ($templateCache) {
                $templateCache.put('screens/profile/views/red-tpl.html', profileRedTpl);
                $templateCache.put('screens/profile/views/red-abnormal-tpl.html', profileRedAbnormalTpl);
                $templateCache.put('screens/profile/views/red-notUsed-tpl.html', profileRedNotUsedTpl);
                $templateCache.put('screens/profile/views/red-notUsed-normal-tpl.html', profileRedNotUsedNormalTpl);

                $templateCache.put('screens/profile/views/red-used-tpl.html', profileRedUsedTpl);
                $templateCache.put('screens/profile/views/red-used-normal-tpl.html', profileRedUsedNormalTpl);

                $templateCache.put('screens/profile/views/red-failures-tpl.html', profileRedFailuresTpl);
                $templateCache.put('screens/profile/views/red-failures-normal-tpl.html', profileRedFailuresNormalTpl);
            }]);
    }
)
;