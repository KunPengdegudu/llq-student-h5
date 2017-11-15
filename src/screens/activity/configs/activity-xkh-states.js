define([
    'angular',
    'text!screens/activity/views/xkh-tpl.html',
    'ui-router',

    'screens/activity/module',
    'screens/activity/view-models/xkh-ctrl'
], function (angular,
             activityXkhTpl) {
    'use strict';

    angular
        .module('screens.activity.xkh.states', [
            'ui.router',
            'screens.activity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 活动
                .state('activity-xkh', {
                    url: '/activity/xkh',
                    title: '活动-校开花',
                    controller: 'ActivityXkhCtrl',
                    templateUrl: 'screens/activity/views/xkh-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activity/views/xkh-tpl.html', activityXkhTpl);
        }]);
});