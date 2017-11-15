define([
    'angular',
    'text!screens/profile/views/help-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/help-ctrl'

], function (angular,
             profileHelpTpl) {
    'use strict';

    angular
        .module('screens.profile.help.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-帮助中心
                .state('profile-help', {
                    url: '/profile/help',
                    spmb: 'profile-help',
                    title: '零零期-我的-帮助中心',
                    controller: 'ProfileHelpCtrl',
                    templateUrl: 'screens/profile/views/help-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/help-tpl.html', profileHelpTpl);
        }]);
});