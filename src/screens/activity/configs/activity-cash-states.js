define([
    'angular',
    'text!screens/activity/views/cash-tpl.html',
    'ui-router',

    'screens/activity/module',
    'screens/activity/view-models/cash-ctrl'
], function (angular,
             activityCashTpl) {
    'use strict';

    angular
        .module('screens.activity.cash.states', [
            'ui.router',
            'screens.activity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 活动
                .state('activity-cash', {
                    url: '/activity/cash',
                    title: '活动-砍头息',
                    controller: 'ActivityCashCtrl',
                    templateUrl: 'screens/activity/views/cash-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activity/views/cash-tpl.html', activityCashTpl);
        }]);
});