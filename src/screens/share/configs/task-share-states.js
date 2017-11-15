/**
 * Created by qinsufan on 17-1-10.
 */
define([
    'angular',
    'text!screens/share/views/task-share-tpl.html',

    'ui-router',

    'screens/share/module',
    'screens/share/view-models/task-share-ctrl'

], function (angular,
             taskShareTpl) {

    'use strict';

    angular
        .module('screens.share.taskShare.states', [
            'ui.router',
            'screens.share'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('task-share', {
                    url: '/works/task/share',
                    spmb: 'task-share',
                    title: '零零期-我的任务-进行任务',
                    controller: 'taskShareCtrl',
                    templateUrl: 'screens/share/views/task-share-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/share/views/task-share-tpl.html', taskShareTpl);
        }]);
});


