define([
    'angular',
    'text!screens/enter/views/main-tpl.html',
    'text!screens/enter/views/carouse-tpl.html',
    'text!screens/enter/views/notice-tpl.html',
    'text!screens/enter/views/block3-tpl.html',
    'text!screens/enter/views/block3-aging-tpl.html',
    'text!screens/enter/views/block3-main-tpl.html',
    'text!screens/enter/views/block3-floor-tpl.html',
    'text!screens/enter/views/block2-guess-tpl.html',
    'text!screens/enter/views/banner-tpl.html',
    'text!screens/enter/views/nav-tpl.html',
    'text!screens/enter/views/today-tpl.html',

    'ui-router',

    'screens/enter/module',
    'screens/enter/view-models/main-ctrl'

], function(
    angular,
    mainTpl,
    carouseTpl,
    noticeTpl,
    block3Tpl,
    block3AgingTpl,
    block3MainTpl,
    block3FloorTpl,
    block2GuessTpl,
    bannerTpl,
    navTpl,
    todayTpl
) {
    'use strict';

    angular
        .module('screens.enter.main.states', [
            'ui.router',
            'screens.enter'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('enter-main', {
                    url: '/enter/main',
                    spmb: 'enter-main',
                    title: '零零期',
                    controller: 'EnterMainCtrl',
                    templateUrl: 'screens/enter/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/enter/views/main-tpl.html', mainTpl);
            $templateCache.put('screens/enter/views/carouse-tpl.html', carouseTpl);
            $templateCache.put('screens/enter/views/notice-tpl.html', noticeTpl);
            $templateCache.put('screens/enter/views/block3-tpl.html', block3Tpl);
            $templateCache.put('screens/enter/views/block3-aging-tpl.html', block3AgingTpl);
            $templateCache.put('screens/enter/views/block3-main-tpl.html', block3MainTpl);
            $templateCache.put('screens/enter/views/block3-floor-tpl.html', block3FloorTpl);
            $templateCache.put('screens/enter/views/block2-guess-tpl.html', block2GuessTpl);
            $templateCache.put('screens/enter/views/banner-tpl.html', bannerTpl);
            $templateCache.put('screens/enter/views/nav-tpl.html', navTpl);
            $templateCache.put('screens/enter/views/today-tpl.html', todayTpl);
        }]);
});