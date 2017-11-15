define([
    'angular',
    'text!screens/works/views/bill-tpl.html',
    'text!screens/works/views/bill-abnormal-tpl.html',
    'text!screens/works/views/bill-normal-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/bill-ctrl'

], function (
    angular,
    billTpl,
    billAbnormalTpl,
    billNormalTpl) {

    'use strict';

    angular
        .module('screens.works.bill.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('works-bill', {
                    url: '/works/bill',
                    spmb: 'task-bill',
                    title: '零零期-我的工作-资产明细',
                    controller: 'WorksBillCtrl',
                    templateUrl: 'screens/works/views/bill-tpl.html'
                })
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/bill-tpl.html', billTpl);
            $templateCache.put('screens/works/views/bill-abnormal-tpl.html', billAbnormalTpl);
            $templateCache.put('screens/works/views/bill-normal-tpl.html', billNormalTpl);
        }]);
});