define([
    'angular',
    'text!screens/works/views/resume-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/resume-ctrl'

], function (
    angular,
    resumeTpl) {

    'use strict';

    angular
        .module('screens.works.resume.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('works-resume', {
                    url: '/works/resume',
                    spmb: 'works-resume',
                    title: '零零期-我的工作-简历',
                    controller: 'WorksResumeCtrl',
                    templateUrl: 'screens/works/views/resume-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/resume-tpl.html', resumeTpl);
        }]);
});