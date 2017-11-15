define([
    'angular',
    'text!screens/rechargeGame/views/widget-tpl.html',

    'ui-router',

    'screens/rechargeGame/module',
    'screens/rechargeGame/view-models/widget-ctrl'

], function (angular,
             widgetTpl) {
    'use strict';

    angular
        .module('screens.rechargeGame.widget.states', [
            'ui.router',
            'screens.rechargeGame'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 消息-首页
                .state('rechargeGame-widget', {
                    url: '/recharge/widget?widgetId&name',
                    spmb: 'rechargeGame-widget',
                    title: '零零期-虚拟充值-模版',
                    controller: 'gameWidgetCtrl',
                    templateUrl: 'screens/rechargeGame/views/widget-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/rechargeGame/views/widget-tpl.html', widgetTpl);
        }]);
});