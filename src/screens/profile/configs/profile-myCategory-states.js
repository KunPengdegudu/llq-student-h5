define([
    'angular',
    'text!screens/profile/views/myCategory-tpl.html',
    'text!screens/profile/views/myCategory-status-normal-tpl.html',
    'text!screens/profile/views/myCategory-status-abnormal-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/myCategory-ctrl'

], function (angular,
             profileMyCategoryTpl,
             profileMyCategoryStatusNormalTpl,
             profileMyCategoryStatusAbnormalTpl) {
    'use strict';

    angular
        .module('screens.profile.myCategory.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-我的订单
                .state('profile-myCategory', {
                    url: '/profile/myCategory?type',
                    spmb: 'profile-myCategory',
                    title: '零零期-我的-我的订单',
                    controller: 'ProfileMyCategoryCtrl',
                    templateUrl: 'screens/profile/views/myCategory-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/myCategory-tpl.html', profileMyCategoryTpl);
            $templateCache.put('screens/profile/views/myCategory-status-normal-tpl.html', profileMyCategoryStatusNormalTpl);
            $templateCache.put('screens/profile/views/myCategory-status-abnormal-tpl.html', profileMyCategoryStatusAbnormalTpl);
        }]);
});