define([
    'angular',
    'text!screens/product/views/assess-success-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/assess-success-ctrl'

], function (angular,
             assessSuccessTpl
) {
    'use strict';



    angular
        .module('screens.product.assesssuccess.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 确认订单
                .state('product-assess-success', {
                    url: '/product/assesssuccess?productId&promotionId&promotionType&referPage&selectedSkuAttrItemIds',
                    spmb:'product-assess-success',
                    title: '零零期-商品-确认订单',
                    controller: 'ProductAssessSuccessCtrl',
                    templateUrl: 'screens/product/views/assess-success-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/assess-success-tpl.html', assessSuccessTpl);
        }]);
});