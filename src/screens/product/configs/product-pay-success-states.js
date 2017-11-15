define([
    'angular',
    'text!screens/product/views/pay-success-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/pay-success-ctrl'

], function (angular,
             paySuccessTpl
) {
    'use strict';



    angular
        .module('screens.product.paysuccess.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 确认订单
                .state('product-pay-success', {
                    url: '/product/paysuccess?billNo&text&money&orderId&scheduleNo&payType&payResult',
                    spmb:'product-pay-success',
                    title: '零零期-商品-确认订单',
                    controller: 'ProductPaySuccessCtrl',
                    templateUrl: 'screens/product/views/pay-success-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/pay-success-tpl.html', paySuccessTpl);
        }]);
});