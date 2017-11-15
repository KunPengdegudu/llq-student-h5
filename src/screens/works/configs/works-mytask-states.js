define([
    'angular',
    'text!screens/works/views/mytask-tpl.html',
    'text!screens/works/views/task-carousel-tpl.html',
    'text!screens/works/views/task-normal-tpl.html',
    'text!screens/works/views/task-abnormal-tpl.html',


    'ui-router',

    'screens/works/module',
    'screens/works/view-models/mytask-ctrl'

], function (angular,
             myTaskTpl,
             taskCarouselTpl,
             taskNormalTpl,
             taskAbnormalTpl,
             taskInformationTpl) {

    'use strict';

    angular
        .module('screens.works.mytask.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('works-mytask', {
                    url: '/works/mytask',
                    spmb: 'works-mytask',
                    title: '零零期-我的工作-任务',
                    controller: 'WorksMyTaskCtrl',
                    templateUrl: 'screens/works/views/mytask-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/mytask-tpl.html', myTaskTpl);
            $templateCache.put('screens/works/views/task-carousel-tpl.html', taskCarouselTpl);
            $templateCache.put('screens/works/views/task-normal-tpl.html', taskNormalTpl);
            $templateCache.put('screens/works/views/task-abnormal-tpl.html', taskAbnormalTpl);
        }]);
});