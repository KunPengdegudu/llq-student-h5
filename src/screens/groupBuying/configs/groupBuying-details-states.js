/**
 * Created by fionaqin on 2017/8/29.
 */
define([
    'angular',
    'text!screens/groupBuying/views/details-tpl.html',

    'ui-router',

    'screens/groupBuying/module',
    'screens/groupBuying/view-models/details-ctrl'

], function (angular,
             groupBuyingDetailsTpl) {
    'use strict';

    angular
        .module('screens.groupBuying.details.states', [
            'ui.router',
            'screens.groupBuying'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-帮助中心
                .state('groupBuying-details', {
                    url: '/groupBuying/details?tuanId&status',
                    spmb: 'groupBuying-details',
                    title: '零零期-拼团详情',
                    controller: 'GroupBuyingDetailsCtrl',
                    templateUrl: 'screens/groupBuying/views/details-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/groupBuying/views/details-tpl.html', groupBuyingDetailsTpl);
        }]);
});