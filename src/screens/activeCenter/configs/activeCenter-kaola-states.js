define([
    'angular',
    'text!screens/activeCenter/views/kaola-tpl.html',
    'ui-router',

    'screens/activeCenter/module',
    'screens/activeCenter/view-models/kaola-ctrl'
], function (angular,
             activeCenterKaolaTpl) {
    'use strict';

    angular
        .module('screens.activeCenter.kaola.states', [
            'ui.router',
            'screens.activeCenter'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 商品满减
                .state('activeCenter-kaola', {
                    url: '/activeCenter/kaola',
                    title: '活动中心-a818-严选',
                    controller: 'activeCenterKaolaCtrl',
                    templateUrl: 'screens/activeCenter/views/kaola-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activeCenter/views/kaola-tpl.html', activeCenterKaolaTpl);
        }]);
});