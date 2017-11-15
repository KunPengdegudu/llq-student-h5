define([
    'angular',
    'text!screens/works/views/transfer-tpl.html',

    'ui-router',

    'screens/works/module',
    'screens/works/view-models/transfer-ctrl'

], function (
    angular,
    transferTpl) {

    'use strict';

    angular
        .module('screens.works.transfer.states', [
            'ui.router',
            'screens.works'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('works-transfer', {
                    url: '/works/transfer?t',
                    spmb: 'works-transfer',
                    title: '零零期-我的工作-余额提现',
                    controller: 'WorksTransferCtrl',
                    templateUrl: 'screens/works/views/transfer-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/works/views/transfer-tpl.html', transferTpl);
        }]);
});