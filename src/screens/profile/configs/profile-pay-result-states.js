define([
    'angular',
    'text!screens/profile/views/pay-result-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/pay-result-ctrl'

], function (angular,
             profilePayResultTpl) {
    'use strict';

    angular
        .module('screens.profile.payResult.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-支付-支付结果
                .state('profile-pay-result', {
                    url: '/profile/pay/result?feedback&payType',
                    spmb: 'profile-pay-result',
                    title: '零零期-支付-支付结果',
                    controller: 'ProfilePayResultCtrl',
                    templateUrl: 'screens/profile/views/pay-result-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/pay-result-tpl.html', profilePayResultTpl);
        }]);
});
