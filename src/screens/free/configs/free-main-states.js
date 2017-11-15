define([
    'angular',
    'text!screens/free/views/main-tpl.html',
    'text!screens/free/views/main-normal-tpl.html',
    'text!screens/free/views/main-abnormal-tpl.html',

    'ui-router',

    'screens/free/module',
    'screens/free/view-models/main-ctrl'

], function(
    angular,
    mainTpl,
    mainNormalTpl,
    mainAbnormalTpl
) {
    'use strict';

    angular
        .module('screens.free.main.states', [
            'ui.router',
            'screens.free'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('free-main', {
                    url: '/free/main?resetState&categoryId&brandId&productName&promotionId',
                    spmb:'free-main',
                    title: '零零期',
                    controller: 'FreeMainCtrl',
                    templateUrl: 'screens/free/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/free/views/main-tpl.html', mainTpl);
            $templateCache.put('screens/free/views/main-normal-tpl.html', mainNormalTpl);
            $templateCache.put('screens/free/views/main-abnormal-tpl.html', mainAbnormalTpl);
        }]);
});