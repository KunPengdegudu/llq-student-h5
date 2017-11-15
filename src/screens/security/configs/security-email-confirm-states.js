define([
    'angular',
    'text!screens/security/views/email-confirm-tpl.html',

    'ui-router',

    'screens/security/module',
    'screens/security/view-models/email-confirm-ctrl'

], function(
    angular,
    confirmEmailTpl
) {
    'use strict';

    angular
        .module('screens.security.email.confirm.states', [
            'ui.router',
            'screens.security'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
            // 零零期-安全中心-验证邮箱
                .state('security-email-confirm', {
                    url: '/security/main/confirmEmail',
                    spmb:'security-email-confirm',
                    title: '零零期-安全中心-验证邮箱',
                    controller: 'SecurityConfirmEmailCtrl',
                    templateUrl: 'screens/security/views/email-confirm-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/security/views/email-confirm-tpl.html', confirmEmailTpl);
        }]);
});