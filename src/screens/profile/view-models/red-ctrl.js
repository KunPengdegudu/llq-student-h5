/**
 * profile my bill controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module'
], function (module) {

    'use strict';

    module.controller('ProfileRedCtrl', ProfileRed);

    ////////
    ProfileRed.$inject = [
        '$rootScope',
        '$scope',
        '$location'
    ];
    function ProfileRed($rootScope, $scope, $location) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "我的红包",
                isShow: true
            }, $location);
        }

        // top menu configs
        vm.configs = {
            'signIn': [{'entryUrl': '/login'}],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [
                {
                    'entryUrl': '/profile/red/notUsed',
                    'activeReg': '/profile/red/notUsed($|/*)',
                    'text': '可使用'
                },
                {
                    'entryUrl': '/profile/red/used',
                    'activeReg': '/profile/red/used($|/*)',
                    'text': '已使用'
                },
                {
                    'entryUrl': '/profile/red/failures',
                    'activeReg': '/profile/red/failures($|/*)',
                    'text': '已失效'
                }]
        };

    }

});