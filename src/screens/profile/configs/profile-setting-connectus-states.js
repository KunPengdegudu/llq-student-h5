define([
    'angular',
    'text!screens/profile/views/setting-connectus-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/setting-connectus-ctrl'

], function (angular,
             profileSettingConnectUsTpl) {
    'use strict';

    angular
        .module('screens.profile.setting.connectus.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-setting-connectus', {
                    url: '/profile/setting/connectus',
                    spmb: 'profile-setting-connectus',
                    title: '零零期-我的-设置-关于我们-联系我们',
                    controller: 'ProfileSettingConnectUsCtrl',
                    templateUrl: 'screens/profile/views/setting-connectus-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/setting-connectus-tpl.html', profileSettingConnectUsTpl);
        }]);
});