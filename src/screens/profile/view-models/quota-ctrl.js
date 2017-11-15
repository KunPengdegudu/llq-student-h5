/**
 * seckill main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('QuotaCtrl', quota);

    ////////
    quota.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function quota($rootScope, $scope, $location, $q, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "额度提升",
                isShow: true
            }, $location);
        }

        // top menu configs
        vm.configs = {
            'signIn': [{'entryUrl': '/login'}],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [
                {
                    'entryUrl': '/profile/quota/waitingFetch',
                    'activeReg': '/profile/quota/waitingFetch($|/*)',
                    'text': '未领取'
                },
                {
                    'entryUrl': '/profile/quota/fetched',
                    'activeReg': '/profile/quota/fetched($|/*)',
                    'text': '已领取'
                }
                //{
                //    'entryUrl': '/profile/quota/expired',
                //    'activeReg': '/profile/quota/expired($|/*)',
                //    'text': '已过期'
                //}
            ]
        };


    }
});