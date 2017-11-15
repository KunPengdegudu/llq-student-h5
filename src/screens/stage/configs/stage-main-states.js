define([
    'angular',
    'text!screens/stage/views/main-tpl.html',
    'text!screens/stage/views/main-normal-tpl.html',
    'text!screens/stage/views/main-abnormal-tpl.html',
    'text!screens/stage/views/category-tpl.html',

    'ui-router',

    'screens/stage/module',
    'screens/stage/view-models/main-ctrl',
    'screens/stage/view-models/category-ctrl'

], function (angular,
             mainTpl,
             mainNormalTpl,
             mainAbnormalTpl,
             categoryTpl) {
    'use strict';

    angular
        .module('screens.stage.main.states', [
            'ui.router',
            'screens.stage'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 消息-首页
                .state('stage-main', {
                    url: '/stage/main?resetState&categoryId&brandId&productName',
                    spmb: 'stage-main',
                    title: '零零期',
                    controller: 'StageMainCtrl',
                    templateUrl: 'screens/stage/views/main-tpl.html'
                })
                .state('stage-category', {
                    url: '/stage/category?categoryId',
                    spmb: 'stage-category',
                    title: '零零期',
                    controller: 'StageCategoryCtrl',
                    templateUrl: 'screens/stage/views/category-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/stage/views/main-tpl.html', mainTpl);
            $templateCache.put('screens/stage/views/main-normal-tpl.html', mainNormalTpl);
            $templateCache.put('screens/stage/views/main-abnormal-tpl.html', mainAbnormalTpl);
            $templateCache.put('screens/stage/views/category-tpl.html', categoryTpl);
        }]);
});