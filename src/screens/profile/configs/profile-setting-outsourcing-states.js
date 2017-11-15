define([
    'angular',
    'text!screens/profile/views/setting-outsourcing-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/setting-outsourcing-ctrl'

], function (angular,
             profileSettingOutsourcingTpl) {
    'use strict';

    angular
        .module('screens.profile.setting.outsourcing.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-setting-outsourcing', {
                    url: '/profile/setting/outsourcing',
                    spmb: 'profile-setting-outsourcing',
                    title: '零零期-我的-设置-海外购实名认证',
                    controller: 'ProfileSettingOutsourcingCtrl',
                    templateUrl: 'screens/profile/views/setting-outsourcing-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/setting-outsourcing-tpl.html', profileSettingOutsourcingTpl);
        }]);
});