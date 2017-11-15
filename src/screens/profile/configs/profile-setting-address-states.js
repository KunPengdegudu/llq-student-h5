define([
    'angular',
    'text!screens/profile/views/setting-address-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/setting-address-ctrl'

], function (angular,
             profileSettingAddressTpl) {
    'use strict';

    angular
        .module('screens.profile.setting.address.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-setting-address', {
                    url: '/profile/setting/address',
                    spmb: 'profile-setting-address',
                    title: '零零期-我的-设置-收货地址管理',
                    controller: 'ProfileSettingAddressCtrl',
                    templateUrl: 'screens/profile/views/setting-address-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/setting-address-tpl.html', profileSettingAddressTpl);
        }]);
});