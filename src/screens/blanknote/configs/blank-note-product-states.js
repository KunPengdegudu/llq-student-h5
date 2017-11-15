define([
    'angular',
    'text!screens/blanknote/views/product-tpl.html',

    'ui-router',

    'screens/blanknote/module',
    'screens/blanknote/view-models/product-ctrl'

], function (angular,
             productTpl) {
    'use strict';

    angular
        .module('screens.blanknote.product.states', [
            'ui.router',
            'screens.blanknote'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 消息-首页
                .state('blanknote-product', {
                    url: '/blanknote/product?feedback?userSource&name&productType',
                    spmb: 'blanknote-product',
                    title: '零零期-白条',
                    controller: 'BlankNoteProductCtrl',
                    templateUrl: 'screens/blanknote/views/product-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/blanknote/views/product-tpl.html', productTpl);
        }]);
});