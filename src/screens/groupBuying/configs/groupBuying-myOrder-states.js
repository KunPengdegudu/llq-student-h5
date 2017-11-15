/**
 * Created by fionaqin on 2017/8/28.
 */
define([
        'angular',
        'text!screens/groupBuying/views/myOrder-tpl.html',
        'text!screens/groupBuying/views/myOrder-abnormal-tpl.html',
        'text!screens/groupBuying/views/myOrder-all-tpl.html',
        'text!screens/groupBuying/views/myOrder-all-normal-tpl.html',

        'text!screens/groupBuying/views/myOrder-waitPay-tpl.html',
        'text!screens/groupBuying/views/myOrder-waitPay-normal-tpl.html',

        'text!screens/groupBuying/views/myOrder-deal-tpl.html',
        'text!screens/groupBuying/views/myOrder-deal-normal-tpl.html',

        'text!screens/groupBuying/views/myOrder-deliver-tpl.html',
        'text!screens/groupBuying/views/myOrder-deliver-normal-tpl.html',

        'text!screens/groupBuying/views/myOrder-receive-tpl.html',
        'text!screens/groupBuying/views/myOrder-receive-normal-tpl.html',

        'ui-router',

        'screens/groupBuying/module',
        'screens/groupBuying/view-models/myOrder-ctrl',
        'screens/groupBuying/view-models/myOrder-all-ctrl',
        'screens/groupBuying/view-models/myOrder-waitPay-ctrl',
        'screens/groupBuying/view-models/myOrder-deal-ctrl',
        'screens/groupBuying/view-models/myOrder-deliver-ctrl',
        'screens/groupBuying/view-models/myOrder-receive-ctrl'


    ], function (angular,
                 myOrderTpl,
                 myOrderAbnormalTpl,
                 myOrderAllTpl,
                 myOrderAllNormalTpl,
                 myOrderWaitPayTpl,
                 myOrderWaitPayNormalTpl,
                 myOrderDealTpl,
                 myOrderDealNormalTpl,
                 myOrderDeliverTpl,
                 myOrderDeliverNormalTpl,
                 myOrderReceiveTpl,
                 myOrderReceiveNormalTpl) {
        'use strict';

        angular
            .module('screens.groupBuying.myOrder.states', [
                'ui.router',
                'screens.groupBuying'
            ])
            .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                //零零期-我的-我的拼团
                    .state('groupBuying-myOrder', {
                        abstract: true,
                        url: '/groupBuying/myOrder',
                        spmb: 'groupBuying-myOrder',
                        title: '零零期-拼团-我的订单',
                        controller: 'myOrderCtrl',
                        templateUrl: 'screens/groupBuying/views/myOrder-tpl.html'
                    })
                    // 我的拼团-全部
                    .state('groupBuying-myOrder-all', {
                        parent: 'groupBuying-myOrder',
                        url: '/all',
                        spmb: 'groupBuying-myOrder-all',
                        title: '零零期-我的拼团-全部',
                        controller: 'myOrderAllCtrl',
                        templateUrl: 'screens/groupBuying/views/myOrder-all-tpl.html'
                    })
                    // 我的拼团-待付款
                    .state('groupBuying-myOrder-waitPay', {
                        parent: 'groupBuying-myOrder',
                        url: '/waitPay',
                        spmb: 'groupBuying-myOrder-waitPay',
                        title: '零零期-我的拼团-待付款',
                        controller: 'myOrderWaitPayCtrl',
                        templateUrl: 'screens/groupBuying/views/myOrder-waitPay-tpl.html'
                    })
                    // 我的拼团-拼团中
                    .state('groupBuying-myOrder-deal', {
                        parent: 'groupBuying-myOrder',
                        url: '/deal',
                        spmb: 'groupBuying-myOrder-deal',
                        title: '零零期-我的拼团-拼团中',
                        controller: 'myOrderDealCtrl',
                        templateUrl: 'screens/groupBuying/views/myOrder-deal-tpl.html'
                    })
                    // 我的拼团-待发货
                    .state('groupBuying-myOrder-deliver', {
                        parent: 'groupBuying-myOrder',
                        url: '/deliver',
                        spmb: 'groupBuying-myOrder-deliver',
                        title: '零零期-我的拼团-待发货',
                        controller: 'myOrderDeliverCtrl',
                        templateUrl: 'screens/groupBuying/views/myOrder-deliver-tpl.html'
                    })
                    // 我的拼团-待收货
                    .state('groupBuying-myOrder-receive', {
                        parent: 'groupBuying-myOrder',
                        url: '/receive',
                        spmb: 'groupBuying-myOrder-receive',
                        title: '零零期-我的拼团-待收货',
                        controller: 'myOrderReceiveCtrl',
                        templateUrl: 'screens/groupBuying/views/myOrder-receive-tpl.html'
                    });
            }])
            .run(['$templateCache', function ($templateCache) {
                $templateCache.put('screens/groupBuying/views/myOrder-tpl.html', myOrderTpl);
                $templateCache.put('screens/groupBuying/views/myOrder-abnormal-tpl.html', myOrderAbnormalTpl);
                $templateCache.put('screens/groupBuying/views/myOrder-all-tpl.html', myOrderAllTpl);
                $templateCache.put('screens/groupBuying/views/myOrder-all-normal-tpl.html', myOrderAllNormalTpl);

                $templateCache.put('screens/groupBuying/views/myOrder-waitPay-tpl.html', myOrderWaitPayTpl);
                $templateCache.put('screens/groupBuying/views/myOrder-waitPay-normal-tpl.html', myOrderWaitPayNormalTpl);

                $templateCache.put('screens/groupBuying/views/myOrder-deal-tpl.html', myOrderDealTpl);
                $templateCache.put('screens/groupBuying/views/myOrder-deal-normal-tpl.html', myOrderDealNormalTpl);

                $templateCache.put('screens/groupBuying/views/myOrder-deliver-tpl.html', myOrderDeliverTpl);
                $templateCache.put('screens/groupBuying/views/myOrder-deliver-normal-tpl.html', myOrderDeliverNormalTpl);

                $templateCache.put('screens/groupBuying/views/myOrder-receive-tpl.html', myOrderReceiveTpl);
                $templateCache.put('screens/groupBuying/views/myOrder-receive-normal-tpl.html', myOrderReceiveNormalTpl);
            }]);
    }
)
;