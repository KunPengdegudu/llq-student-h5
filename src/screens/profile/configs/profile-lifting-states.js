define([
    'angular',
    'text!screens/profile/views/lifting-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/lifting-ctrl'

], function (angular,
             profileLiftingTpl) {
    'use strict';

    angular
        .module('screens.profile.lifting.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-我的-提额
                .state('profile-lifting', {
                    url: '/profile/lifting?code',
                    spmb: 'profile-lifting',
                    title: '零零期-我的-提额',
                    controller: 'ProfileLiftingCtrl',
                    templateUrl: 'screens/profile/views/lifting-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/lifting-tpl.html', profileLiftingTpl);
        }]);
});