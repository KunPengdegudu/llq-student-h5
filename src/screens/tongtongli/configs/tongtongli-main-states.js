define([
    'angular',
    'text!screens/tongtongli/views/main-tpl.html',

    'ui-router',

    'screens/tongtongli/module',
    'screens/tongtongli/view-models/main-ctrl'

], function(
    angular,
    mainTpl
) {
    'use strict';

    angular
        .module('screens.tongtongli.main.states', [
            'ui.router',
            'screens.tongtongli'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('tongtongli-main', {
                    url: '/tongtongli/main',
                    spmb: 'tongtongli-main',
                    title: '零零期',
                    controller: 'TongtongliMainCtrl',
                    templateUrl: 'screens/tongtongli/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/tongtongli/views/main-tpl.html', mainTpl);
        }]);
});