/**
 * Created by fionaqin on 2017/8/23.
 */
define([
    'angular',
    'text!screens/groupBuying/views/main-tpl.html',

    'ui-router',

    'screens/groupBuying/module',
    'screens/groupBuying/view-models/main-ctrl'

], function (angular,
             mainTpl) {
    'use strict';

    angular
        .module('screens.groupBuying.main.states', [
            'ui.router',
            'screens.groupBuying'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-帮助中心
                .state('groupBuying-main', {
                    url: '/groupBuying/main',
                    spmb: 'groupBuying-main',
                    title: '零零期-我的-拼团购',
                    controller: 'MainCtrl',
                    templateUrl: 'screens/groupBuying/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/groupBuying/views/main-tpl.html', mainTpl);
        }]);
});