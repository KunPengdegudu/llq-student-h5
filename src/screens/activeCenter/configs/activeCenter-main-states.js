define([
    'angular',
    'text!screens/activeCenter/views/main-tpl.html',
    'ui-router',

    'screens/activeCenter/module',
    'screens/activeCenter/view-models/main-ctrl'
], function (angular,
             activeCenterMainTpl) {
    'use strict';

    angular
        .module('screens.activeCenter.main.states', [
            'ui.router',
            'screens.activeCenter'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 认证
                .state('activeCenter-main', {
                    url: '/activeCenter/main?name',
                    title: '活动中心-a818',
                    controller: 'activeCenterMainCtrl',
                    templateUrl: 'screens/activeCenter/views/main-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activeCenter/views/main-tpl.html', activeCenterMainTpl);
        }]);
});