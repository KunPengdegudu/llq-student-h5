define([
    'angular',
    'text!screens/seckill/views/main-tpl.html',
    'text!screens/seckill/views/main-normal-tpl.html',
    'text!screens/seckill/views/main-abnormal-tpl.html',

    'ui-router',

    'screens/seckill/module',
    'screens/seckill/view-models/main-ctrl'

], function(
    angular,
    mainTpl,
    mainNormalTpl,
    mainAbmormalTpl
) {
    'use strict';

    angular
        .module('screens.seckill.main.states', [
            'ui.router',
            'screens.seckill'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('seckill-main', {
                    url: '/seckill/main',
                    spmb: 'seckill-main',
                    title: '零零期',
                    controller: 'SeckillMainCtrl',
                    templateUrl: 'screens/seckill/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/seckill/views/main-tpl.html', mainTpl);
            $templateCache.put('screens/seckill/views/main-normal-tpl.html', mainNormalTpl);
            $templateCache.put('screens/seckill/views/main-abnormal-tpl.html', mainAbmormalTpl);
        }]);
});