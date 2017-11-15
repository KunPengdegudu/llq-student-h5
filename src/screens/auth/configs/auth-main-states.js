define([
    'angular',
    'text!screens/auth/views/main-tpl.html',
    'ui-router',

    'screens/auth/module',
    'screens/auth/view-models/main-ctrl'
], function (angular,
             authMainTpl) {
    'use strict';

    angular
        .module('screens.auth.main.states', [
            'ui.router',
            'screens.auth'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 认证
                .state('auth-main', {
                    url: '/auth/main',
                    title: '我的认证',
                    controller: 'AuthMainCtrl',
                    templateUrl: 'screens/auth/views/main-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/auth/views/main-tpl.html', authMainTpl);
        }]);
});