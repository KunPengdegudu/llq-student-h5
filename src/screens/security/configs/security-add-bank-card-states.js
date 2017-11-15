define([
    'angular',
    'text!screens/security/views/addBankCard-tpl.html',

    'ui-router',

    'screens/security/module',
    'screens/security/view-models/addBankCard-ctrl'

], function(
    angular,
    AddBankCardTpl
) {
    'use strict';

    angular
        .module('screens.security.add.bank.card.states', [
            'ui.router',
            'screens.security'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
            // 零零期-安全中心-京东代扣
                .state('security-add-bank-card', {
                    url: '/security/main/addBankCard',
                    spmb:'security-add-bank-card',
                    title: '零零期-安全中心-京东代扣',
                    controller: 'SecurityAddBankCardCtrl',
                    templateUrl: 'screens/security/views/addBankCard-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/security/views/addBankCard-tpl.html', AddBankCardTpl);
        }]);
});