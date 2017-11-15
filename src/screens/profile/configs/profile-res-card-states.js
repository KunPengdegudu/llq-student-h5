define([
    'angular',
    'text!screens/profile/views/res-card-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/res-card-ctrl'

], function (angular,
             profileResCardTpl) {
    'use strict';

    angular
        .module('screens.profile.res.card.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定银行卡
                .state('profile-res-card', {
                    url: '/profile/res/card',
                    spmb: 'profile-res-card',
                    title: '零零期-我的-个人中心-绑定银行卡',
                    controller: 'ProfileResCardCtrl',
                    templateUrl: 'screens/profile/views/res-card-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/res-card-tpl.html', profileResCardTpl);
        }]);
});