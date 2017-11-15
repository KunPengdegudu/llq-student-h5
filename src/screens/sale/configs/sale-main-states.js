define([
    'angular',
    'text!screens/sale/views/main-tpl.html',
    'text!screens/sale/views/main-normal-tpl.html',
    'text!screens/sale/views/main-abnormal-tpl.html',

    'ui-router',

    'screens/sale/module',
    'screens/sale/view-models/main-ctrl'

], function(
    angular,
    mainTpl,
    mainNormalTpl,
    mainAbmormalTpl
) {
    'use strict';

    angular
        .module('screens.sale.main.states', [
            'ui.router',
            'screens.sale'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('sale-main', {
                    url: '/sale/main?promotionType&promotionId',
                    spmb: 'sale-main',
                    title: '零零期',
                    controller: 'SaleMainCtrl',
                    templateUrl: 'screens/sale/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/sale/views/main-tpl.html', mainTpl);
            $templateCache.put('screens/sale/views/main-normal-tpl.html', mainNormalTpl);
            $templateCache.put('screens/sale/views/main-abnormal-tpl.html', mainAbmormalTpl);
        }]);
});