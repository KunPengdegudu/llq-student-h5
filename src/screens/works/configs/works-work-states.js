/**
 * Created by llq on 16-1-14.
 */
define([
    'angular',
    'text!screens/works/views/work-tpl.html',
    'text!screens/works/views/work-intern-tpl.html',
    'text!screens/works/views/work-part-time-tpl.html',
    'text!screens/works/views/work-normal-tpl.html',
    'text!screens/works/views/work-abnormal-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/work-ctrl'
], function (angular,
             worksWorkTpl,
             worksWorkInternTpl,
             worksWorkPartTimeTpl,
             worksWorkNormalTpl,
             worksWorkAbnormalTpl) {
    'use strict';

    angular
        .module('screens.works.work.states', [
            'ui.router',
            'screens.works'

        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('works-work', {
                    url: '/works/work?redirect&pageType&cityCode',
                    spmb: 'works-work',
                    title: '工作列表',
                    controller: 'WorksWorkCtrl',
                    templateUrl: 'screens/works/views/work-tpl.html'
                });


        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/work-tpl.html', worksWorkTpl);
            $templateCache.put('screens/works/views/work-part-time-tpl.html', worksWorkPartTimeTpl);
            $templateCache.put('screens/works/views/work-intern-tpl.html', worksWorkInternTpl);
            $templateCache.put('screens/works/views/work-abnormal-tpl.html', worksWorkAbnormalTpl);
            $templateCache.put('screens/works/views/work-normal-tpl.html', worksWorkNormalTpl);
        }])

})