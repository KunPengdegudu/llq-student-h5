define([
    'angular',
    'text!screens/product/views/order-detail-tpl.html',
    'text!screens/product/views/order-detail-part-blank-note-tpl.html',
    'text!screens/product/views/order-detail-part-recharge-tpl.html',
    'text!screens/product/views/order-detail-part-other-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/order-detail-ctrl'

], function (angular,
             orderDetailTpl,
             orderDetailPartBlankNoteTpl,
             orderDetailPartRechangeTpl,
             orderDetailPartOtherTpl
) {
    'use strict';



    angular
        .module('screens.product.orderdetail.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 确认订单
                .state('product-order-detail', {
                    url: '/product/orderdetail?order_id&goBack',
                    spmb:'product-order-detail',
                    title: '零零期-商品-订单详情',
                    controller: 'ProductOrderDetailCtrl',
                    templateUrl: 'screens/product/views/order-detail-tpl.html'
                });

        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/order-detail-tpl.html', orderDetailTpl);
            $templateCache.put('screens/product/views/order-detail-part-blank-note-tpl.html', orderDetailPartBlankNoteTpl);
            $templateCache.put('screens/product/views/order-detail-part-recharge-tpl.html', orderDetailPartRechangeTpl);
            $templateCache.put('screens/product/views/order-detail-part-other-tpl.html', orderDetailPartOtherTpl);
        }]);
});