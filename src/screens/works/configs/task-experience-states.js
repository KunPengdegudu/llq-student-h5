define([
    'angular',
    'text!screens/works/views/task-experience-tpl.html',
    'text!screens/works/views/task-experience-normal-tpl.html',
    'text!screens/works/views/task-experience-abnormal-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/task-experience-ctrl'

], function (angular,
             taskExperienceTpl,
             taskExperienceNormalTpl,
             taskExperienceAbnormalTpl) {

    'use strict';

    angular
        .module('screens.task.experience.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('task-experience', {
                    url: '/works/task/experience',
                    spmb: 'task-experience',
                    title: '零零期-我的任务-任务记录',
                    controller: 'TaskExperienceCtrl',
                    templateUrl: 'screens/works/views/task-experience-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/task-experience-tpl.html', taskExperienceTpl);
            $templateCache.put('screens/works/views/task-experience-normal-tpl.html', taskExperienceNormalTpl);
            $templateCache.put('screens/works/views/task-experience-abnormal-tpl.html', taskExperienceAbnormalTpl);
        }]);
});
