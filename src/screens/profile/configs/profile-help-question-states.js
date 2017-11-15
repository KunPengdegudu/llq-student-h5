define([
    'angular',
    'text!screens/profile/views/help-question-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/help-question-ctrl'

], function (angular,
             profileHelpQuestionTpl) {
    'use strict';

    angular
        .module('screens.profile.help.question.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-帮助中心-常见问题
                .state('profile-help-question', {
                    url: '/profile/help/question',
                    spmb: 'profile-help-question',
                    title: '零零期-我的-帮助中心-常见问题',
                    controller: 'ProfileHelpQuestionCtrl',
                    templateUrl: 'screens/profile/views/help-question-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/help-question-tpl.html', profileHelpQuestionTpl);
        }]);
});