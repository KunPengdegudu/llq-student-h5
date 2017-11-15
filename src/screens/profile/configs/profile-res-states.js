define([
    'angular',
    'text!screens/profile/views/res-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/res-ctrl'

], function (angular,
             profileResTpl) {
    'use strict';

    angular
        .module('screens.profile.res.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心
                .state('profile-res', {
                    url: '/profile/res',
                    spmb:'profile-res',
                    title: '零零期-我的-个人中心',
                    controller: 'ProfileResCtrl',
                    templateUrl: 'screens/profile/views/res-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/res-tpl.html', profileResTpl);
        }]);
});