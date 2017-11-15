define([
    'angular',
    'text!screens/weixin/views/aging-tpl.html',

    'ui-router',

    'screens/weixin/module',
    'screens/weixin/view-models/aging-ctrl'

], function (angular,
             weixinAgingTpl) {
    'use strict';

    angular
        .module('screens.weixin.aging.states', [
            'ui.router',
            'screens.weixin'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 申请
                .state('weixin-aging', {
                    url: '/weixin/aging?code&org_code',
                    spmb: 'weixin-aging',
                    title: '申请',
                    controller: 'WeixinAgingCtrl',
                    templateUrl: 'screens/weixin/views/aging-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/weixin/views/aging-tpl.html', weixinAgingTpl);
        }]);
});
