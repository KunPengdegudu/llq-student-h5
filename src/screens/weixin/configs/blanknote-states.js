define([
    'angular',
    'text!screens/weixin/views/blanknote-tpl.html',

    'ui-router',

    'screens/weixin/module',
    'screens/weixin/view-models/blanknote-ctrl'

], function (angular,
             weixinBlanknoteTpl) {
    'use strict';

    angular
        .module('screens.weixin.blanknote.states', [
            'ui.router',
            'screens.weixin'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 申请
                .state('weixin-blanknote', {
                    url: '/weixin/blanknote?spreadCode&comeFrom',
                    spmb: 'weixin-blanknote',
                    title: '白条申请',
                    controller: 'WeixinBlanknoteCtrl',
                    templateUrl: 'screens/weixin/views/blanknote-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/weixin/views/blanknote-tpl.html', weixinBlanknoteTpl);
        }]);
});
