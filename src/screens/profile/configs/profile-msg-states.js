define([
    'angular',
    'text!screens/profile/views/msg-tpl.html',
    'text!screens/profile/views/msg-normal-tpl.html',
    'text!screens/profile/views/msg-abnormal-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/msg-ctrl'

], function (angular,
             profileMsgTpl,
             profileMsgNormalTpl,
             profileMsgAbnormalTpl) {
    'use strict';

    angular
        .module('screens.profile.msg.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心
                .state('profile-msg', {
                    url: '/profile/msg',
                    spmb: 'profile-msg',
                    title: '零零期-我的-消息中心',
                    controller: 'ProfileMsgCtrl',
                    templateUrl: 'screens/profile/views/msg-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/msg-tpl.html', profileMsgTpl);
            $templateCache.put('screens/profile/views/msg-normal-tpl.html', profileMsgNormalTpl);
            $templateCache.put('screens/profile/views/msg-abnormal-tpl.html', profileMsgAbnormalTpl);
        }]);
});