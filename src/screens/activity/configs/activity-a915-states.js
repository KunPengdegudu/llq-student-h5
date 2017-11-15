define([
    'angular',
    'text!screens/activity/views/a915-tpl.html',
    'ui-router',

    'screens/activity/module',
    'screens/activity/view-models/a915-ctrl'
], function (angular,
             activityA915Tpl) {
    'use strict';

    angular
        .module('screens.activity.a915.states', [
            'ui.router',
            'screens.activity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 认证
                .state('activity-a915', {
                    url: '/activity/a915',
                    title: '活动-915寻找信用代言人',
                    controller: 'ActivityA915Ctrl',
                    templateUrl: 'screens/activity/views/a915-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activity/views/a915-tpl.html', activityA915Tpl);
        }]);
});