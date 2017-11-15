define([
    'angular',
    'text!screens/auth/views/credit-tpl.html',
    'ui-router',

    'screens/auth/module',
    'screens/auth/view-models/credit-ctrl'
], function (angular,
             authCreditTpl) {
    'use strict';

    angular
        .module('screens.auth.credit.states', [
            'ui.router',
            'screens.auth'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 认证
                .state('auth-credit', {
                    url: '/auth/credit',
                    title: '信用评级',
                    controller: 'AuthCreditCtrl',
                    templateUrl: 'screens/auth/views/credit-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/auth/views/credit-tpl.html', authCreditTpl);
        }]);
});