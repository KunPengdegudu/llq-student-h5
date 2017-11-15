define([
    'angular',
    'text!screens/profile/views/help-limit-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/help-limit-ctrl'

], function (angular,
             profileHelpLimitTpl) {
    'use strict';

    angular
        .module('screens.profile.help.limit.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-help-limit', {
                    url: '/profile/help/limit',
                    spmb: 'profile-help-limit',
                    title: '零零期-我的-帮助中心-分期额度说明',
                    controller: 'ProfileHelpLimitCtrl',
                    templateUrl: 'screens/profile/views/help-limit-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/help-limit-tpl.html', profileHelpLimitTpl);
        }]);
});