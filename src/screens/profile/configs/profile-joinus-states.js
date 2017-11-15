define([
    'angular',
    'text!screens/profile/views/joinus-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/joinus-ctrl'

], function (angular,
             profileJoinUsTpl) {
    'use strict';

    angular
        .module('screens.profile.joinus.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-加入我们
                .state('profile-joinus', {
                    url: '/profile/joinus',
                    spmb: 'profile-joinus',
                    title: '零零期-我的-加入我们',
                    controller: 'ProfileJoinUsCtrl',
                    templateUrl: 'screens/profile/views/joinus-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/joinus-tpl.html', profileJoinUsTpl);
        }]);
});