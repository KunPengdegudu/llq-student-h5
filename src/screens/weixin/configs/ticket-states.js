define([
    'angular',
    'text!screens/weixin/views/ticket-tpl.html',
    'text!screens/weixin/views/ticket-photo-tpl.html',

    'ui-router',

    'screens/weixin/module',
    'screens/weixin/view-models/ticket-ctrl'

], function (angular,
             weixinTicketTpl,
             weixinTicketPhotoTpl) {
    'use strict';

    angular
        .module('screens.weixin.ticket.states', [
            'ui.router',
            'screens.weixin'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 申请
                .state('weixin-ticket', {
                    url: '/weixin/ticket',
                    spmb: 'weixin-ticket',
                    title: '申请',
                    controller: 'WeixinTicketCtrl',
                    templateUrl: 'screens/weixin/views/ticket-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/weixin/views/ticket-tpl.html', weixinTicketTpl);
            $templateCache.put('screens/weixin/views/ticket-photo-tpl.html', weixinTicketPhotoTpl);
        }]);
});
