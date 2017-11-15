define([
    'angular',
    'text!screens/profile/views/order-assess-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/order-assess-ctrl'

], function (angular,
             profileOrderAssessTpl) {
    'use strict';

    angular
        .module('screens.profile.orderAssess.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-支付-支付结果
                .state('profile-order-assess', {
                    url: '/profile/orderAssess?orderId&isAdd',
                    title: '零零期-订单-评价',
                    controller: 'ProfileOrderAssessCtrl',
                    templateUrl: 'screens/profile/views/order-assess-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/order-assess-tpl.html', profileOrderAssessTpl);
        }]);
});
