define([
    'angular',
    'text!screens/login/views/login-check-tpl.html',

    'ui-router',

    'screens/login/module',
    'screens/login/view-models/login-check-ctrl'

], function (angular,
             loginCheckTpl) {
    'use strict';

    angular
        .module('screens.login.check.states', [
            'ui.router',
            'screens.login'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 登录
                .state('login-check', {
                    url: '/login/check?phone&pwd',
                    title: '登录-短信认证',
                    controller: 'LoginCheckCtrl',
                    templateUrl: 'screens/login/views/login-check-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/login/views/login-check-tpl.html', loginCheckTpl);
        }]);
});