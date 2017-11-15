/**
 * profile my order controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define(['screens/profile/module'], function (module) {

    'use strict';

    module.controller('ProfileMyOrderCtrl', ProfileMyOrder);

    ////////
    ProfileMyOrder.$inject = [
        '$rootScope',
        '$scope',
        '$location'
    ];
    function ProfileMyOrder($rootScope, $scope, $location) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "我的订单",
                isShow: true
            }, $location);
        }

        // top menu configs
        vm.configs = {
            'signIn': [{'entryUrl': '/login'}],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [
                {
                    'entryUrl': '/profile/myorder/orderall',
                    'activeReg': '/profile/myorder/orderall($|/*)',
                    'text': '全部'
                },
                {
                    'entryUrl': '/profile/myorder/ordersale',
                    'activeReg': '/profile/myorder/ordersale($|/*)',
                    'text': '购买'
                },
                {
                    'entryUrl': '/profile/myorder/ordercash',
                    'activeReg': '/profile/myorder/ordercash($|/*)',
                    'text': '白条'
                }
            ]
        };

    }

});