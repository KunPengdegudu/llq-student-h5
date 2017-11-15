define([
    'angular',
    'text!screens/profile/views/wallet-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/wallet-ctrl'

], function (angular,
             profileWalletsTpl) {
    'use strict';

    angular
        .module('screens.profile.wallet.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-我的钱包
                .state('profile-wallet', {
                    url: '/profile/wallet',
                    spmb: 'profile-wallet',
                    title: '零零期-我的-我的钱包',
                    controller: 'profileWalletsCtrl',
                    templateUrl: 'screens/profile/views/wallet-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/wallet-tpl.html', profileWalletsTpl);
        }]);
});