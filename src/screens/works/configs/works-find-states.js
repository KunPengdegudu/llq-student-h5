/**
 * Created by qinsufan on 17-1-12.
 */
define([
    'angular',
    'text!screens/works/views/works-find-tpl.html',
    'text!screens/works/views/works-topic-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/works-find-ctrl',
    'screens/works/view-models/works-topic-ctrl'

], function (angular,
             WorksFindTpl,
             WorksTopicTpl) {

    'use strict';

    angular
        .module('screens.works.find.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('works-find', {
                    url: '/works/find',
                    spmb: 'works-find',
                    title: '零零期-发现',
                    controller: 'WorksFindCtrl',
                    templateUrl: 'screens/works/views/works-find-tpl.html'
                })
                .state('works-topic', {
                    url: '/works/topic',
                    spmb: 'works-topic',
                    title: '零零期-发现-精选话题',
                    controller: 'WorksTopicCtrl',
                    templateUrl: 'screens/works/views/works-topic-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/works-find-tpl.html', WorksFindTpl);
            $templateCache.put('screens/works/views/works-topic-tpl.html', WorksTopicTpl);
        }]);
});