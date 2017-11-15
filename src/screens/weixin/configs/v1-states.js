define([
    'angular',
    'text!screens/weixin/views/v1-tpl.html',

    'ui-router',

    'screens/weixin/module',
    'screens/weixin/view-models/v1-ctrl'

], function (angular, weixinV1Tpl) {
    'use strict';

    angular
        .module('screens.weixin.v1.states', [
            'ui.router',
            'screens.weixin'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 登录
                .state('weixin-v1', {
                    url: '/weixin/v1',
                    spmb: 'weixin-v1',
                    title: 'V1认证',
                    controller: 'WeixinV1Ctrl',
                    templateUrl: 'screens/weixin/views/v1-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/weixin/views/v1-tpl.html', weixinV1Tpl);
        }]);
});