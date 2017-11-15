define([
    'angular',
    'text!screens/profile/views/main-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/main-ctrl'

], function(
    angular,
    mainTpl
) {
    'use strict';

    angular
        .module('screens.profile.main.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('profile-main', {
                    url: '/profile/main',
                    spmb: 'profile-main',
                    title: '零零期',
                    controller: 'ProfileMainCtrl',
                    templateUrl: 'screens/profile/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/profile/views/main-tpl.html', mainTpl);
        }]);
});