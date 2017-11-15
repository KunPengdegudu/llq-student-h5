define([
    'angular',
    'text!screens/template/views/productList-tpl.html',

    'ui-router',

    'screens/template/module',
    'screens/template/view-models/productList-ctrl'

], function (angular,
             productListTpl) {
    'use strict';

    angular
        .module('screens.template.productList.states', [
            'ui.router',
            'screens.template'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 消息-首页
                .state('template-productList', {
                    url: '/template/productList?widgetCode&name&nodeId',
                    spmb: 'template-productList',
                    title: '选品方案-商品列表',
                    controller: 'productListCtrl',
                    templateUrl: 'screens/template/views/productList-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/template/views/productList-tpl.html', productListTpl);
        }]);
});