define([
        'angular',
        'text!screens/works/views/experience-main-tpl.html',
        'text!screens/works/views/experience-intern-tpl.html',
        'text!screens/works/views/experience-part-time-tpl.html',
        'text!screens/works/views/experience-normal-tpl.html',
        'text!screens/works/views/experience-abnormal-tpl.html',
        'ui-router',

        'screens/works/module',
        'screens/works/view-models/experience-ctrl'
    ], function (angular,
                 worksExperienceMainTpl,
                 worksExperienceInternTpl,
                 worksExperiencePartTimeTpl,
                 worksExperienceNormalTpl,
                 worksExperienceAbnormalTpl) {
        'use strict';

        angular
            .module('screens.works.experience.states', [
                'ui.router',
                'screens.works'

            ])
            .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                    .state('works-experience', {
                        url: '/works/experience?redirect&status&pageType',
                        spmb: 'works-experience',
                        title: '工作列表',
                        controller: 'WorksExperienceCtrl',
                        templateUrl: 'screens/works/views/experience-main-tpl.html'
                    });


            }])
            .run(['$templateCache', function ($templateCache) {
                $templateCache.put('screens/works/views/experience-main-tpl.html', worksExperienceMainTpl);
                $templateCache.put('screens/works/views/experience-part-time-tpl.html', worksExperiencePartTimeTpl);
                $templateCache.put('screens/works/views/experience-intern-tpl.html', worksExperienceInternTpl);
                $templateCache.put('screens/works/views/experience-abnormal-tpl.html', worksExperienceAbnormalTpl);
                $templateCache.put('screens/works/views/experience-normal-tpl.html', worksExperienceNormalTpl);

            }])

    }
)
;