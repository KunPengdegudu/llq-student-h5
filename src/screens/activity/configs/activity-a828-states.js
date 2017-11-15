define([
    'angular',
    'text!screens/activity/views/a828-tpl.html',
    'ui-router',

    'screens/activity/module',
    'screens/activity/view-models/a828-ctrl'
], function (angular,
             activityA828Tpl) {
    'use strict';

    angular
        .module('screens.activity.a828.states', [
            'ui.router',
            'screens.activity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 认证
                .state('activity-a828', {
                    url: '/activity/a828',
                    title: '活动-七夕节',
                    controller: 'ActivityA828Ctrl',
                    templateUrl: 'screens/activity/views/a828-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activity/views/a828-tpl.html', activityA828Tpl);
        }]);
});