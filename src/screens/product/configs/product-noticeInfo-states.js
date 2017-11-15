define([
    'angular',
    'text!screens/product/views/noticeInfo-tpl.html',

    'ui-router',

    'screens/product/module',
    'screens/product/view-models/noticeInfo-ctrl'

], function (angular,
             productNoticeInfoTpl) {
    'use strict';

    angular
        .module('screens.product.noticeInfo.states', [
            'ui.router',
            'screens.product'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 商品-商品公告
                .state('product-noticeInfo', {
                    url: '/product/noticeInfo?positionType',
                    spmb:'product-noticeInfo',
                    title: '零零期-商品-商品公告',
                    controller: 'ProductNoticeInfoCtrl',
                    templateUrl: 'screens/product/views/noticeInfo-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/product/views/noticeInfo-tpl.html', productNoticeInfoTpl);
        }]);
});