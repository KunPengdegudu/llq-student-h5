define([
    'angular',
    'text!screens/profile/views/setting-about-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/setting-about-ctrl'

], function (angular,
             profileSettingAboutTpl) {
    'use strict';

    angular
        .module('screens.profile.setting.about.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-setting-about', {
                    url: '/profile/setting/about',
                    spmb: 'profile-setting-about',
                    title: '零零期-我的-设置-关于我们',
                    controller: 'ProfileSettingAboutCtrl',
                    templateUrl: 'screens/profile/views/setting-about-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/setting-about-tpl.html', profileSettingAboutTpl);
        }]);
});