define([
    'angular',
    'text!screens/works/views/task-information-tpl.html',


    'ui-router',

    'screens/works/module',
    'screens/works/view-models/task-information-ctrl'

], function (
    angular,
    taskInformationTpl) {

    'use strict';

    angular
        .module('screens.task.information.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('task-information', {
                    url: '/works/task/information?taskId&userTaskId',
                    spmb: 'task-information',
                    title: '零零期-我的任务-任务详情',
                    controller: 'TaskInformationCtrl',
                    templateUrl: 'screens/works/views/task-information-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/task-information-tpl.html', taskInformationTpl);
        }]);
});