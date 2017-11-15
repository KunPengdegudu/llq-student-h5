define([
    'angular',
    'text!screens/profile/views/setting-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/setting-ctrl'

], function (angular,
             profileSettingTpl) {
    'use strict';

    angular
        .module('screens.profile.setting.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-设置
                .state('profile-setting', {
                    url: '/profile/setting',
                    spmb: 'profile-setting',
                    title: '零零期-我的-设置',
                    controller: 'ProfileSettingCtrl',
                    templateUrl: 'screens/profile/views/setting-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/setting-tpl.html', profileSettingTpl);
        }]);
});