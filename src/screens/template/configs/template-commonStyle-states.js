define([
    'angular',
    'text!screens/template/views/commonStyle-tpl.html',

    'ui-router',

    'screens/template/module',
    'screens/template/view-models/commonStyle-ctrl'

], function (angular,
             commonStyleTpl) {
    'use strict';

    angular
        .module('screens.template.commonStyle.states', [
            'ui.router',
            'screens.template'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 消息-首页
                .state('template-commonStyle', {
                    url: '/template/commonStyle?widgetCode&name&nodeId',
                    spmb: 'template-commonStyle',
                    title: '今日必逛',
                    controller: 'commonStyleCtrl',
                    templateUrl: 'screens/template/views/commonStyle-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/template/views/commonStyle-tpl.html', commonStyleTpl);
        }]);
});