/**
 * profile my bill controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/share/module'
], function (module) {

    'use strict';

    module.controller('ShareFinancialMainCtrl', ShareFinancialMain);

    ////////
    ShareFinancialMain.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'shareUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ShareFinancialMain($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "资金明细",
                isShow: true
            }, $location);
        }


        // top menu configs
        vm.configs = {
            'signIn': [{'entryUrl': '/login'}],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [
                {
                    'entryUrl': '/share/financial/all',
                    'activeReg': '/share/financial/all($|/*)',
                    'text': '全部'
                },
                {
                    'entryUrl': '/share/financial/out',
                    'activeReg': '/share/financial/out($|/*)',
                    'text': '支出'
                },
                {
                    'entryUrl': '/share/financial/in',
                    'activeReg': '/share/financial/in($|/*)',
                    'text': '收入'
                }]
        };

    }

});