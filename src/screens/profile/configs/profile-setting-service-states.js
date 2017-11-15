define([
    'angular',
    'text!screens/profile/views/setting-service-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/setting-service-ctrl'

], function (angular,
             profileSettingServiceTpl) {
    'use strict';

    angular
        .module('screens.profile.setting.service.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-setting-service', {
                    url: '/profile/setting/service',
                    spmb: 'profile-setting-service',
                    title: '零零期-我的-设置-关于我们-服务条款',
                    controller: 'ProfileSettingServiceCtrl',
                    templateUrl: 'screens/profile/views/setting-service-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/setting-service-tpl.html', profileSettingServiceTpl);
        }]);
});