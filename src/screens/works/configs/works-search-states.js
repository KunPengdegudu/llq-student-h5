define([
    'angular',
    'text!screens/works/views/search-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/search-ctrl'

], function (
    angular,
    searchTpl) {

    'use strict';

    angular
        .module('screens.works.search.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('works-search', {
                    url: '/works/search',
                    spmb: 'works-search',
                    title: '零零期-我的工作-搜索',
                    controller: 'WorksSearchCtrl',
                    templateUrl: 'screens/works/views/search-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/search-tpl.html', searchTpl);
        }]);
});