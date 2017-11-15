define([
    'angular',
    'text!screens/profile/views/help-material-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/help-material-ctrl'

], function (angular,
             profileHelpMaterialTpl) {
    'use strict';

    angular
        .module('screens.profile.help.material.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-help-material', {
                    url: '/profile/help/material',
                    spmb: 'profile-help-material',
                    title: '零零期-我的-帮助中心-分期资料说明',
                    controller: 'ProfileHelpMaterialCtrl',
                    templateUrl: 'screens/profile/views/help-material-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/help-material-tpl.html', profileHelpMaterialTpl);
        }]);
});