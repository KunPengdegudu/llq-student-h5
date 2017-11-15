/**
 * Created by fionaqin on 2017/9/8.
 */
define([
    'angular',
    'text!screens/groupBuying/views/order-confirm-tpl.html',

    'ui-router',

    'screens/groupBuying/module',
    'screens/groupBuying/view-models/order-confirm-ctrl'

], function (angular,
             orderConfirmTpl) {
    'use strict';

    angular
        .module('screens.groupBuying.orderConfirm.states', [
            'ui.router',
            'screens.groupBuying'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-帮助中心
                .state('groupBuying-orderConfirm', {
                    url: '/groupBuying/orderConfirm?addressId&productId&proSkuId&ptProductSkuId&pinTuanId',
                    spmb: 'groupBuying-order-confirm',
                    title: '零零期-拼团-确认订单',
                    controller: 'OrderConfirmCtrl',
                    templateUrl: 'screens/groupBuying/views/order-confirm-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/groupBuying/views/order-confirm-tpl.html', orderConfirmTpl);
        }]);
});