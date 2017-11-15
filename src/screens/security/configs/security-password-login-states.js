define([
    'angular',
    'text!screens/security/views/password-login-tpl.html',

    'ui-router',

    'screens/security/module',
    'screens/security/view-models/password-login-ctrl'

], function(
    angular,
    changeLoginPasswordTpl
) {
    'use strict';

    angular
        .module('screens.security.password.login.states', [
            'ui.router',
            'screens.security'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
            // 零零期-安全中心-修改登录密码
                .state('security-password-login', {
                    url: '/security/main/loginPassword',
                    spmb:'security-password-login',
                    title: '零零期-安全中心-修改登陆密码',
                    controller: 'SecurityLoginPasswordCtrl',
                    templateUrl: 'screens/security/views/password-login-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/security/views/password-login-tpl.html', changeLoginPasswordTpl);
        }]);
});