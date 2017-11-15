define([
    'angular',
    'text!screens/profile/views/setting-us-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/setting-us-ctrl'

], function (angular,
             profileSettingUsTpl) {
    'use strict';

    angular
        .module('screens.profile.setting.us.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-setting-us', {
                    url: '/profile/setting/us',
                    spmb: 'profile-setting-us',
                    title: '零零期-我的-设置-关于我们-关于零零期',
                    controller: 'ProfileSettingUsCtrl',
                    templateUrl: 'screens/profile/views/setting-us-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/setting-us-tpl.html', profileSettingUsTpl);
        }]);
});