define([
    'angular',
    'text!screens/activity/views/a719-tpl.html',
    'ui-router',

    'screens/activity/module',
    'screens/activity/view-models/a719-ctrl'
], function (angular,
             activityA915Tpl) {
    'use strict';

    angular
        .module('screens.activity.a719.states', [
            'ui.router',
            'screens.activity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 认证
                .state('activity-a719', {
                    url: '/activity/a719',
                    title: '活动-暑期冰价节',
                    controller: 'ActivityA719Ctrl',
                    templateUrl: 'screens/activity/views/a719-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activity/views/a719-tpl.html', activityA915Tpl);
        }]);
});