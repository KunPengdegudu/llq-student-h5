define([
    'angular',
    'text!screens/rechargeGame/views/detail-tpl.html',

    'ui-router',

    'screens/rechargeGame/module',
    'screens/rechargeGame/view-models/detail-ctrl'

], function (angular,
             detailTpl) {
    'use strict';

    angular
        .module('screens.rechargeGame.detail.states', [
            'ui.router',
            'screens.rechargeGame'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 消息-首页
                .state('rechargeGame-detail', {
                    url: '/recharge/game/details?prodId',
                    spmb: 'rechargeGame-game-detail',
                    title: '零零期-虚拟充值',
                    controller: 'gameDetailCtrl',
                    templateUrl: 'screens/rechargeGame/views/detail-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/rechargeGame/views/detail-tpl.html', detailTpl);
        }]);
});