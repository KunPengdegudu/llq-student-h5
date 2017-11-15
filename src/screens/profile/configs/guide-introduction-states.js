/*
 * @author : penglei
 * e-mail : lei.penglei@alibaba-inc.com
 * create date : 2015/01/06
 * decription : commodity states
 */
define([
    'angular',
    'text!screens/profile/views/guide-introduction-tpl.html',
    'ui-router',
    'screens/profile/view-models/guide-introduction-ctrl'
], function (angular, introductionTpl) {

    'use strict';

    angular
        .module('screens.profile.introduction.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('profile-introduction', {
                    url: '/profile/introduction',
                    spmb: 'profile-introduction',
                    title: '新手引导',
                    templateUrl: 'screens/profile/views/guide-introduction-tpl.html',
                    controller: 'GuideIntro'
                });
        }])

        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/guide-introduction-tpl.html', introductionTpl);
        }]);

});
