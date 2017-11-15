define([
    'angular',
    'text!screens/weixin/views/enroll-tpl.html',

    'ui-router',

    'screens/weixin/module',
    'screens/weixin/view-models/enroll-ctrl'

], function (angular,
             weixinEnrollTpl) {
    'use strict';

    angular
        .module('screens.weixin.enroll.states', [
            'ui.router',
            'screens.weixin'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 登录
                .state('weixin-enroll', {
                    url: '/weixin/enroll?spreadParam&spreadType&comeFrom',
                    spmb: 'weixin-enroll',
                    title: '注册',
                    controller: 'WeixinEnrollCtrl',
                    templateUrl: 'screens/weixin/views/enroll-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/weixin/views/enroll-tpl.html', weixinEnrollTpl);
        }]);
});