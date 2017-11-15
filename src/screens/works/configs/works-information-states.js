/**
 * Created by llq on 16-1-14.
 */
define([
    'angular',
    'text!screens/works/views/information-tpl.html',
    'text!screens/works/views/information-work-tpl.html',
    'text!screens/works/views/information-company-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/information-ctrl'
], function (angular,
             worksInformationTpl,
             worksInformationWorkTpl,
             worksInformationCompanyTpl
         ) {
    'use strict';

    angular
        .module('screens.works.information.states', [
            'ui.router',
            'screens.works'

        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('works-information', {
                    url: '/works/information?redirect&id&corpId',
                    spmb: 'works-information',
                    title: '工作列表',
                    controller: 'WorksInformationCtrl',
                    templateUrl: 'screens/works/views/information-tpl.html'
                });


        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/information-tpl.html', worksInformationTpl);
            $templateCache.put('screens/works/views/information-work-tpl.html',worksInformationWorkTpl);
            $templateCache.put('screens/works/views/information-company-tpl.html',worksInformationCompanyTpl)
        }])

})