define([
    'angular',
    'text!screens/activity/views/aQuota-tpl.html',
    'ui-router',

    'screens/activity/module',
    'screens/activity/view-models/aQuota-ctrl'
], function (angular,
             activityAQuotaTpl) {
    'use strict';

    angular
        .module('screens.activity.aQuota.states', [
            'ui.router',
            'screens.activity'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 认证
                .state('activity-aQuota', {
                    url: '/activity/aQuota',
                    title: '活动-题额大放送',
                    controller: 'ActivityaQuotaCtrl',
                    templateUrl: 'screens/activity/views/aQuota-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activity/views/aQuota-tpl.html', activityAQuotaTpl);
        }]);
});