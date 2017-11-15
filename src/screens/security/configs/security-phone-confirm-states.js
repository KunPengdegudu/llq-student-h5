define([
    'angular',
    'text!screens/security/views/phone-confirm-tpl.html',

    'ui-router',

    'screens/security/module',
    'screens/security/view-models/phone-confirm-ctrl'

], function(
    angular,
    confirmPhoneTpl
) {
    'use strict';

    angular
        .module('screens.security.phone.confirm.states', [
            'ui.router',
            'screens.security'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
            // 零零期-安全中心-验证手机
                .state('security-phone-confirm', {
                    url: '/security/main/confirmPhone',
                    spmb:'security-phone-confirm',
                    title: '零零期-安全中心-验证手机',
                    controller: 'SecurityConfirmPhoneCtrl',
                    templateUrl: 'screens/security/views/phone-confirm-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/security/views/phone-confirm-tpl.html', confirmPhoneTpl);
        }]);
});