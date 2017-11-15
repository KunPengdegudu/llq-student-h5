define([
    'angular',
    'text!screens/rechargeGame/views/purchase-tpl.html',

    'ui-router',

    'screens/rechargeGame/module',
    'screens/rechargeGame/view-models/purchase-ctrl'

], function (angular,
             purchaseTpl) {
    'use strict';

    angular
        .module('screens.rechargeGame.purchase.states', [
            'ui.router',
            'screens.rechargeGame'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 消息-首页
                .state('rechargeGame-purchase', {
                    url: '/recharge/purchase?categoryId&name',
                    spmb: 'rechargeGame-purchase',
                    title: '零零期-手游充值',
                    controller: 'gamePurchaseCtrl',
                    templateUrl: 'screens/rechargeGame/views/purchase-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/rechargeGame/views/purchase-tpl.html', purchaseTpl);
        }]);
});