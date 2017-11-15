/**
 * profile my bill controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module'
], function (module) {

    'use strict';

    module.controller('ProfileCouponCtrl', ProfileCoupon);

    ////////
    ProfileCoupon.$inject = [
        '$rootScope',
        '$scope',
        '$location'
    ];
    function ProfileCoupon($rootScope, $scope, $location) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "我的优惠券",
                isShow: true
            }, $location);
        }

        // top menu configs
        vm.configs = {
            'signIn': [{'entryUrl': '/login'}],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [
                {
                    'entryUrl': '/profile/coupon/notUsed',
                    'activeReg': '/profile/coupon/notUsed($|/*)',
                    'text': '可使用'
                },
                {
                    'entryUrl': '/profile/coupon/used',
                    'activeReg': '/profile/coupon/used($|/*)',
                    'text': '已使用'
                },
                {
                    'entryUrl': '/profile/coupon/failures',
                    'activeReg': '/profile/coupon/failures($|/*)',
                    'text': '已失效'
                }]
        };

    }

});