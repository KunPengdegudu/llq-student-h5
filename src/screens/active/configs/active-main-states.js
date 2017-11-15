define([
    'angular',
    'text!screens/active/views/main-tpl.html',
    'ui-router',

    'screens/active/module',
    'screens/active/view-models/main-ctrl'
], function (angular,
             activeMainTpl) {
    'use strict';

    angular
        .module('screens.active.main.states', [
            'ui.router',
            'screens.active'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 活动
                .state('active-main', {
                    url: '/active/main',
                    title: '活动-20171111-主会场',
                    controller: 'ActiveMainCtrl',
                    templateUrl: 'screens/active/views/main-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/active/views/main-tpl.html', activeMainTpl);
        }]);
});