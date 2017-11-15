define([
    'angular',
    'text!screens/rechargeGame/views/search-tpl.html',

    'ui-router',

    'screens/rechargeGame/module',
    'screens/rechargeGame/view-models/search-ctrl'

], function (angular,
             searchTpl) {
    'use strict';

    angular
        .module('screens.rechargeGame.search.states', [
            'ui.router',
            'screens.rechargeGame'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 消息-首页
                .state('rechargeGame-search', {
                    url: '/recharge/search?categoryId&name&productName',
                    spmb: 'rechargeGame-search',
                    title: '零零期-虚拟充值-搜索结果',
                    controller: 'gameSearchCtrl',
                    templateUrl: 'screens/rechargeGame/views/search-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/rechargeGame/views/search-tpl.html', searchTpl);
        }]);
});