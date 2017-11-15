define([
    'angular',
    'text!screens/profile/views/myasset-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/myasset-ctrl'

], function (angular,
             profileMyAssetTpl) {
    'use strict';

    angular
        .module('screens.profile.myasset.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-我的资产
                .state('profile-myasset', {
                    url: '/profile/myasset',
                    spmb: 'profile-myasset',
                    title: '零零期-我的-我的资产',
                    controller: 'ProfileMyAssetCtrl',
                    templateUrl: 'screens/profile/views/myasset-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/myasset-tpl.html', profileMyAssetTpl);
        }]);
});