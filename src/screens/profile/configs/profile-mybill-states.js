define([
        'angular',
        'text!screens/profile/views/mybill-tpl.html',
        'text!screens/profile/views/mybill-current-tpl.html',
        'text!screens/profile/views/mybill-current-normal-tpl.html',
        'text!screens/profile/views/mybill-current-abnormal-tpl.html',
        'text!screens/profile/views/mybill-next-tpl.html',
        'text!screens/profile/views/mybill-next-normal-tpl.html',
        'text!screens/profile/views/mybill-next-abnormal-tpl.html',

        'ui-router',

        'screens/profile/module',
        'screens/profile/view-models/mybill-ctrl',
        'screens/profile/view-models/mybill-current-ctrl',
        'screens/profile/view-models/mybill-next-ctrl'

    ], function (angular,
                 profileMyBillTpl,
                 profileMyBillCurrentTpl,
                 profileMyBillCurrentNormalTpl,
                 profileMyBillCurrentAbnormalTpl,
                 profileMyBillNextTpl,
                 profileMyBillNextNormalTpl,
                 profileMyBillNextAbnormalTpl) {
        'use strict';

        angular
            .module('screens.profile.mybill.states', [
                'ui.router',
                'screens.profile'
            ])
            .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                    // 我的-我的账单
                    .state('profile-mybill', {
                        abstract: true,
                        url: '/profile/mybill',
                        spmb: 'profile-mybill',
                        title: '零零期-我的-我的账单',
                        controller: 'ProfileMyBillCtrl',
                        templateUrl: 'screens/profile/views/mybill-tpl.html'
                    })
                    // 我的-我的账单-本期账单
                    .state('profile-mybill-current', {
                        parent: 'profile-mybill',
                        url: '/billcurrent',
                        spmb: 'profile-mybill-current',
                        title: '零零期-我的-我的账单-本期账单',
                        controller: 'ProfileMyBillCurrentCtrl',
                        templateUrl: 'screens/profile/views/mybill-current-tpl.html'
                    })
                    // 我的-我的账单-往期账单
                    .state('profile-mybill-next', {
                        parent: 'profile-mybill',
                        url: '/billnext',
                        spmb: 'profile-mybill-next',
                        title: '零零期-我的-我的账单-往期账单',
                        controller: 'ProfileMyBillNextCtrl',
                        templateUrl: 'screens/profile/views/mybill-next-tpl.html'
                    });
            }])
            .run(['$templateCache', function ($templateCache) {
                $templateCache.put('screens/profile/views/mybill-tpl.html', profileMyBillTpl);
                $templateCache.put('screens/profile/views/mybill-current-tpl.html', profileMyBillCurrentTpl);
                $templateCache.put('screens/profile/views/mybill-current-normal-tpl.html', profileMyBillCurrentNormalTpl);
                $templateCache.put('screens/profile/views/mybill-current-abnormal-tpl.html', profileMyBillCurrentAbnormalTpl);
                $templateCache.put('screens/profile/views/mybill-next-tpl.html', profileMyBillNextTpl);
                $templateCache.put('screens/profile/views/mybill-next-normal-tpl.html', profileMyBillNextNormalTpl);
                $templateCache.put('screens/profile/views/mybill-next-abnormal-tpl.html', profileMyBillNextAbnormalTpl);
            }]);
    }
)
;