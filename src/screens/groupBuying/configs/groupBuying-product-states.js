/**
 * Created by fionaqin on 2017/8/30.
 */
define([
    'angular',
    'text!screens/groupBuying/views/product-details-tpl.html',

    'ui-router',

    'screens/groupBuying/module',
    'screens/groupBuying/view-models/product-details-ctrl'

], function (angular,
             ProductDetailsTpl) {
    'use strict';

    angular
        .module('screens.groupBuying.product.states', [
            'ui.router',
            'screens.groupBuying'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-帮助中心
                .state('groupBuying-product', {
                    url: '/groupBuying/product?ptProductId&productId',
                    spmb: 'groupBuying-product-details',
                    title: '零零期-拼团-商品详情',
                    controller: 'ProductDetailsCtrl',
                    templateUrl: 'screens/groupBuying/views/product-details-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/groupBuying/views/product-details-tpl.html', ProductDetailsTpl);
        }]);
});