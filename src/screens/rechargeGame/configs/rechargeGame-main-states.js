define([
    'angular',
    'text!screens/rechargeGame/views/main-tpl.html',
    'text!screens/rechargeGame/views/carouse-tpl.html',
    'text!screens/rechargeGame/views/nav-tpl.html',
    'text!screens/rechargeGame/views/block-tpl.html',
    'text!screens/rechargeGame/views/category-tpl.html',

    'ui-router',

    'screens/rechargeGame/module',
    'screens/rechargeGame/view-models/main-ctrl'

], function (angular,
             mainTpl,
             carouseTpl,
             navTpl,
             blockTpl,
             categoryTpl) {
    'use strict';

    angular
        .module('screens.rechargeGame.main.states', [
            'ui.router',
            'screens.rechargeGame'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 消息-首页
                .state('rechargeGame-main', {
                    url: '/recharge/main/game',
                    spmb: 'rechargeGame-main',
                    title: '零零期-虚拟充值',
                    controller: 'rechargeGameCtrl',
                    templateUrl: 'screens/rechargeGame/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/rechargeGame/views/main-tpl.html', mainTpl);
            $templateCache.put('screens/rechargeGame/views/carouse-tpl.html', carouseTpl);
            $templateCache.put('screens/rechargeGame/views/nav-tpl.html', navTpl);
            $templateCache.put('screens/rechargeGame/views/block-tpl.html', blockTpl);
            $templateCache.put('screens/rechargeGame/views/category-tpl.html', categoryTpl);
        }]);
});