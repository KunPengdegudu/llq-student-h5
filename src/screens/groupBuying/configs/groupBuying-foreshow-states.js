/**
 * Created by fionaqin on 2017/8/24.
 */
define([
    'angular',
    'text!screens/groupBuying/views/foreshow-tpl.html',

    'ui-router',

    'screens/groupBuying/module',
    'screens/groupBuying/view-models/foreshow-ctrl'

], function (angular,
             foreshowTpl) {
    'use strict';

    angular
        .module('screens.groupBuying.foreshow.states', [
            'ui.router',
            'screens.groupBuying'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-帮助中心
                .state('groupBuying-foreshow', {
                    url: '/groupBuying/foreshow',
                    spmb: 'groupBuying-foreshow',
                    title: '零零期-我的-拼团玩法',
                    controller: 'ForeshowCtrl',
                    templateUrl: 'screens/groupBuying/views/foreshow-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/groupBuying/views/foreshow-tpl.html', foreshowTpl);
        }]);
});