/**
 * Created by fionaqin on 2017/7/3.
 */
define([
    'angular',
    'text!screens/share/views/financial-main-tpl.html',
    'text!screens/share/views/financial-all-tpl.html',

    'text!screens/share/views/financial-out-tpl.html',

    'text!screens/share/views/financial-in-tpl.html',

    'text!screens/share/views/financial-normal-tpl.html',
    'text!screens/share/views/financial-abnormal-tpl.html',

    'ui-router',

    'screens/share/module',
    'screens/share/view-models/financial-main-ctrl',
    'screens/share/view-models/financial-all-ctrl',
    'screens/share/view-models/financial-out-ctrl',
    'screens/share/view-models/financial-in-ctrl'

], function (angular,
             ShareFinancialMainTpl,
             ShareFinancialAllTpl,
             ShareFinancialOutTpl,
             ShareFinancialInTpl,
             ShareFinancialNormalTpl,
             ShareFinancialAbnormalTpl) {

    'use strict';

    angular
        .module('screens.share.financial.states', [
            'ui.router',
            'screens.share'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('share-financial', {
                    url: '/share/financial',
                    spmb: 'share-financial',
                    title: '零零期-任务账户-资金明细',
                    controller: 'ShareFinancialMainCtrl',
                    templateUrl: 'screens/share/views/financial-main-tpl.html'
                })
                .state('share-financial-all', {
                    parent: 'share-financial',
                    url: '/all',
                    spmb: 'share-financial-all',
                    title: '零零期-任务账户-资金明细-全部',
                    controller: 'ShareFinancialAllCtrl',
                    templateUrl: 'screens/share/views/financial-all-tpl.html'
                })
                .state('share-financial-out', {
                    parent: 'share-financial',
                    url: '/out',
                    spmb: 'share-financial-out',
                    title: '零零期-任务账户-资金明细-支出',
                    controller: 'ShareFinancialOutCtrl',
                    templateUrl: 'screens/share/views/financial-out-tpl.html'
                })
                .state('share-financial-in', {
                    parent: 'share-financial',
                    url: '/in',
                    spmb: 'share-financial-in',
                    title: '零零期-任务账户-资金明细-收入',
                    controller: 'ShareFinancialInCtrl',
                    templateUrl: 'screens/share/views/financial-in-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/share/views/financial-main-tpl.html', ShareFinancialMainTpl);

            $templateCache.put('screens/share/views/financial-all-tpl.html', ShareFinancialAllTpl);

            $templateCache.put('screens/share/views/financial-out-tpl.html', ShareFinancialOutTpl);

            $templateCache.put('screens/share/views/financial-in-tpl.html', ShareFinancialInTpl);

            $templateCache.put('screens/share/views/financial-normal-tpl.html', ShareFinancialNormalTpl);

            $templateCache.put('screens/share/views/financial-abnormal-tpl.html', ShareFinancialAbnormalTpl);
        }]);
});