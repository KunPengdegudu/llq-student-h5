define([
    'angular',
    'text!screens/template/views/floorStyle-tpl.html',

    'ui-router',

    'screens/template/module',
    'screens/template/view-models/floorStyle-ctrl'

], function (angular,
             floorStyleTpl) {
    'use strict';

    angular
        .module('screens.template.floorStyle.states', [
            'ui.router',
            'screens.template'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 消息-首页
                .state('template-floorStyle', {
                    url: '/template/floorStyle?widgetCode&name',
                    spmb: 'template-floorStyle',
                    title: '今日必逛',
                    controller: 'templateFloorStyleCtrl',
                    templateUrl: 'screens/template/views/floorStyle-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/template/views/floorStyle-tpl.html', floorStyleTpl);
        }]);
});