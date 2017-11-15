define([
    'angular',
    'text!screens/rechargeMobile/views/main-tpl.html',

    'ui-router',

    'screens/rechargeMobile/module',
    'screens/rechargeMobile/view-models/main-ctrl'

], function (angular,
             mainTpl) {
    'use strict';

    angular
        .module('screens.rechargeMobile.main.states', [
            'ui.router',
            'screens.rechargeMobile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 消息-首页
                .state('rechargeMobile-main', {
                    url: '/recharge/main/mobile',
                    spmb: 'rechargeMobile-main',
                    title: '零零期-虚拟充值-话费／流量',
                    controller: 'rechargeMobileCtrl',
                    templateUrl: 'screens/rechargeMobile/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/rechargeMobile/views/main-tpl.html', mainTpl);
        }]);
});