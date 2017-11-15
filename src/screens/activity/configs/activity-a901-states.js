define([
    'angular',
    'text!screens/activity/views/a901-tpl.html',
    'ui-router',

    'screens/activity/module',
    'screens/activity/view-models/a901-ctrl'
], function (angular,
             activityA915Tpl) {
    'use strict';

    angular
        .module('screens.activity.a901.states', [
            'ui.router',
            'screens.activity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 认证
                .state('activity-a901', {
                    url: '/activity/a901?canShow&name&type',
                    title: '活动-开学活动',
                    controller: 'ActivityA901Ctrl',
                    templateUrl: 'screens/activity/views/a901-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activity/views/a901-tpl.html', activityA915Tpl);
        }]);
});