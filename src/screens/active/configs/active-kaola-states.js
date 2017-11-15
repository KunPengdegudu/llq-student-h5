define([
    'angular',
    'text!screens/active/views/kaola-tpl.html',
    'ui-router',

    'screens/active/module',
    'screens/active/view-models/kaola-ctrl'
], function (angular,
             activeKaolaTpl) {
    'use strict';

    angular
        .module('screens.active.kaola.states', [
            'ui.router',
            'screens.active'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 活动
                .state('active-kaola', {
                    url: '/active/kaola',
                    title: '活动-20171111-考拉会场',
                    controller: 'ActiveKaolaCtrl',
                    templateUrl: 'screens/active/views/kaola-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/active/views/kaola-tpl.html', activeKaolaTpl);
        }]);
});