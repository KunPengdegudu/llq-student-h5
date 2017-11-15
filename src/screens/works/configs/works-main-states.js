define([
    'angular',
    'text!screens/works/views/main-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/main-ctrl'

], function (angular,
             mainTpl) {

    'use strict';

    angular
        .module('screens.works.main.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('works-main', {
                    url: '/works/main',
                    spmb: 'works-main',
                    title: '零零期-我的工作',
                    controller: 'WorksMainCtrl',
                    templateUrl: 'screens/works/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/main-tpl.html', mainTpl);
        }]);
});