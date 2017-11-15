define([
    'angular',
    'text!screens/active/views/yx-tpl.html',
    'ui-router',

    'screens/active/module',
    'screens/active/view-models/yx-ctrl'
], function (angular,
             activeYxTpl) {
    'use strict';

    angular
        .module('screens.active.yx.states', [
            'ui.router',
            'screens.active'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 活动
                .state('active-yx', {
                    url: '/active/yx',
                    title: '活动-20171111-严选会场',
                    controller: 'ActiveYxCtrl',
                    templateUrl: 'screens/active/views/yx-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/active/views/yx-tpl.html', activeYxTpl);
        }]);
});