define([
    'angular',
    'text!screens/profile/views/feedback-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/feedback-ctrl'

], function (angular,
             profileFeedbackTpl) {
    'use strict';

    angular
        .module('screens.profile.feedback.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心
                .state('profile-feedback', {
                    url: '/profile/feedback',
                    spmb: 'profile-feedback',
                    title: '零零期-我的-意见反馈',
                    controller: 'ProfileFeedbackCtrl',
                    templateUrl: 'screens/profile/views/feedback-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/feedback-tpl.html', profileFeedbackTpl);
        }]);
});