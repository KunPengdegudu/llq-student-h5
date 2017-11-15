/**
 * Created by llq on 16-2-23.
 */
define([
    'angular',
    'text!screens/works/views/task-do-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/task-do-ctrl'

], function (angular,
             taskDoTpl) {

    'use strict';

    angular
        .module('screens.task.do.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('task-do', {
                    url: '/works/task/do?userTaskId',
                    spmb: 'task-do',
                    title: '零零期-我的任务-进行任务',
                    controller: 'TaskDoCtrl',
                    templateUrl: 'screens/works/views/task-do-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/task-do-tpl.html', taskDoTpl);
        }]);
});