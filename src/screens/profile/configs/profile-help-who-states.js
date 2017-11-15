define([
    'angular',
    'text!screens/profile/views/help-who-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/help-who-ctrl'

], function (angular,
             profileHelpWhoTpl) {
    'use strict';

    angular
        .module('screens.profile.help.who.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-help-who', {
                    url: '/profile/help/who',
                    spmb: 'profile-help-who',
                    title: '零零期-我的-帮助中心-什么人能够分期',
                    controller: 'ProfileHelpWhoCtrl',
                    templateUrl: 'screens/profile/views/help-who-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/help-who-tpl.html', profileHelpWhoTpl);
        }]);
});