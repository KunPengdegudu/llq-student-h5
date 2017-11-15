define([
    'angular',
    'text!screens/profile/views/order-assess-all-tpl.html',
    'text!screens/profile/views/order-assess-all-normal-tpl.html',
    'text!screens/profile/views/order-assess-all-abnormal-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/order-assess-all-ctrl'

], function (angular,
             profileAllAssessTpl,profileAllAssessNormalTpl,profileAllAssessAbnormalTpl) {
    'use strict';

    angular
        .module('screens.profile.all-assess.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-个人中心
                .state('profile-all-assess', {
                    url: '/profile/allAssess',
                    title: '我的评价',
                    controller: 'ProfileAllAssessCtrl',
                    templateUrl: 'screens/profile/views/order-assess-all-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/order-assess-all-tpl.html', profileAllAssessTpl);
            $templateCache.put('screens/profile/views/order-assess-all-normal-tpl.html', profileAllAssessNormalTpl);
            $templateCache.put('screens/profile/views/order-assess-all-abnormal-tpl.html', profileAllAssessAbnormalTpl);
        }]);
});