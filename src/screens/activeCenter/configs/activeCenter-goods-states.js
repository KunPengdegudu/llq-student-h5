define([
    'angular',
    'text!screens/activeCenter/views/goods-tpl.html',
    'ui-router',

    'screens/activeCenter/module',
    'screens/activeCenter/view-models/goods-ctrl'
], function (angular,
             activeCenterGoodsTpl) {
    'use strict';

    angular
        .module('screens.activeCenter.goods.states', [
            'ui.router',
            'screens.activeCenter'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 商品满减
                .state('activeCenter-goods', {
                    url: '/activeCenter/goods',
                    title: '活动中心-a818-满减送',
                    controller: 'activeCenterGoodsCtrl',
                    templateUrl: 'screens/activeCenter/views/goods-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/activeCenter/views/goods-tpl.html', activeCenterGoodsTpl);
        }]);
});