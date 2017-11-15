/**
 * Created by llq on 16-4-15.
 */
define([
    'angular',
    'text!screens/works/views/task-spreed-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/task-spreed-ctrl'

], function (angular,
             taskSpreedTpl) {

    'use strict';

    angular
        .module('screens.task.spreed.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('task-spreed', {
                    url: '/works/task/spreed?spreadParam',
                    spmb: 'task-spreed',
                    title: '零零期-我的任务-进行任务',
                    controller: 'TaskSpreedCtrl',
                    templateUrl: 'screens/works/views/task-spreed-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/task-spreed-tpl.html', taskSpreedTpl);
        }]);
});