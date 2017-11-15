define([
    'angular',
    'text!screens/activity/views/a171001-tpl.html',
    'ui-router',

    'screens/activity/module',
    'screens/activity/view-models/a171001-ctrl'
], function (angular,
             activityA171001Tpl) {
    'use strict';

    angular
        .module('screens.activity.a171001.states', [
            'ui.router',
            'screens.activity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 认证
                .state('activity-a171001', {
                    url: '/activity/a171001',
                    spmb: 'activity-a171001',
                    title: '活动-国庆',
                    controller: 'ActivityA171001Ctrl',
                    templateUrl: 'screens/activity/views/a171001-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activity/views/a171001-tpl.html', activityA171001Tpl);
        }]);
});