define([
    'angular',
    'text!screens/security/views/bank-withhold-tpl.html',

    'ui-router',

    'screens/security/module',
    'screens/security/view-models/bank-withhold-ctrl'

], function (angular,
             BankWithholdTpl) {
    'use strict';

    angular
        .module('screens.security.bank.withhold.states', [
            'ui.router',
            'screens.security'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 零零期-安全中心-京东代扣
                .state('security-bank-withhold', {
                    url: '/security/main/bankWithhold?goBack',
                    spmb: 'security-bank-withhold',
                    title: '零零期-安全中心-京东代扣',
                    controller: 'SecurityBankWithholdCtrl',
                    templateUrl: 'screens/security/views/bank-withhold-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/security/views/bank-withhold-tpl.html', BankWithholdTpl);
        }]);
});