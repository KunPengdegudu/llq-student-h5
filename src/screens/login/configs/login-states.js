define([
    'angular',
    'text!screens/login/views/login-tpl.html',
    'text!screens/login/views/login-login-tpl.html',
    'text!screens/login/views/login-enroll-tpl.html',

    'ui-router',

    'screens/login/module',
    'screens/login/view-models/login-ctrl'

], function (angular,
             loginLoginTpl,
             loginLoginLoginTpl,
             loginLoginEnrollTpl) {
    'use strict';

    angular
        .module('screens.login.login.states', [
            'ui.router',
            'screens.login'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 登录
                .state('login-login', {
                url: '/login?redirect&to&pageType',
                title: '登录',
                controller: 'LoginLoginCtrl',
                templateUrl: 'screens/login/views/login-tpl.html'
            });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/login/views/login-tpl.html', loginLoginTpl);
            $templateCache.put('screens/login/views/login-login-tpl.html', loginLoginLoginTpl);
            $templateCache.put('screens/login/views/login-enroll-tpl.html', loginLoginEnrollTpl);
        }]);
});