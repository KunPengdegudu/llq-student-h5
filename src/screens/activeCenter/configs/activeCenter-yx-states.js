define([
    'angular',
    'text!screens/activeCenter/views/yx-tpl.html',
    'ui-router',

    'screens/activeCenter/module',
    'screens/activeCenter/view-models/yx-ctrl'
], function (angular,
             activeCenterYxTpl) {
    'use strict';

    angular
        .module('screens.activeCenter.yx.states', [
            'ui.router',
            'screens.activeCenter'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 商品满减
                .state('activeCenter-yx', {
                    url: '/activeCenter/yx',
                    title: '活动中心-a818-严选',
                    controller: 'activeCenterYxCtrl',
                    templateUrl: 'screens/activeCenter/views/yx-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activeCenter/views/yx-tpl.html', activeCenterYxTpl);
        }]);
});