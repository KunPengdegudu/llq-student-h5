define([
    'angular',
    'text!screens/activeCenter/views/jd-tpl.html',
    'ui-router',

    'screens/activeCenter/module',
    'screens/activeCenter/view-models/jd-ctrl'
], function (angular,
             activeCenterJdTpl) {
    'use strict';

    angular
        .module('screens.activeCenter.jd.states', [
            'ui.router',
            'screens.activeCenter'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 商品满减
                .state('activeCenter-jd', {
                    url: '/activeCenter/jd?name',
                    title: '活动中心-a818-京东',
                    controller: 'activeCenterJdCtrl',
                    templateUrl: 'screens/activeCenter/views/jd-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activeCenter/views/jd-tpl.html', activeCenterJdTpl);
        }]);
});