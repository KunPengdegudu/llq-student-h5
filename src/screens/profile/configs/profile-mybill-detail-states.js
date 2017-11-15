define([
    'angular',
    'text!screens/profile/views/mybill-detail-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/mybill-detail-ctrl'

], function (angular,
             profileMyBillDetailTpl) {
    'use strict';

    angular
        .module('screens.profile.mybill.detail.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-我的资产
                .state('profile-mybill-detail', {
                    url: '/profile/billdetail?billNo',
                    spmb: 'profile-mybill-detail',
                    title: '零零期-我的-我的账单-账单详情',
                    controller: 'ProfileMyBillDetailCtrl',
                    templateUrl: 'screens/profile/views/mybill-detail-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/mybill-detail-tpl.html', profileMyBillDetailTpl);
        }]);
});