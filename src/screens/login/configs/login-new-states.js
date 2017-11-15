define([
    'angular',
    'text!screens/login/views/login-tpl.html',
    'text!screens/login/views/login-new-tpl.html',
    'text!screens/login/views/login-login-tpl.html',
    'text!screens/login/views/login-enroll-tpl.html',

    'ui-router',

    'screens/login/module',
    'screens/login/view-models/login-new-ctrl'

], function (angular,
             loginLoginTpl,
             loginLoginNewTpl,
             loginLoginLoginTpl,
             loginLoginEnrollTpl) {
    'use strict';

    angular
        .module('screens.login.new.states', [
            'ui.router',
            'screens.login'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 登录
                .state('login-new', {
                    url: '/login/new?redirect&to&pageType&channel&spreadCode',
                    title: '登录',
                    controller: 'LoginNewCtrl',
                    templateUrl: 'screens/login/views/login-new-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/login/views/login-tpl.html', loginLoginTpl);
            $templateCache.put('screens/login/views/login-new-tpl.html', loginLoginNewTpl);
            $templateCache.put('screens/login/views/login-login-tpl.html', loginLoginLoginTpl);
            $templateCache.put('screens/login/views/login-enroll-tpl.html', loginLoginEnrollTpl);
        }]);
});