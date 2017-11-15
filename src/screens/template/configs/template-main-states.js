define([
    'angular',
    'text!screens/template/views/main-tpl.html',

    'ui-router',

    'screens/template/module',
    'screens/template/view-models/main-ctrl'

], function (angular,
             mainTpl) {
    'use strict';

    angular
        .module('screens.template.main.states', [
            'ui.router',
            'screens.template'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 消息-首页
                .state('template-main', {
                    url: '/template/main?widgetCode&name&nodeId',
                    spmb: 'template-main',
                    title: '今日必逛',
                    controller: 'templateMainCtrl',
                    templateUrl: 'screens/template/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/template/views/main-tpl.html', mainTpl);
        }]);
});