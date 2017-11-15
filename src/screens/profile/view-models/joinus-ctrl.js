/**
 * profile my controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileJoinUsCtrl', ProfileJoinUs);

    ////////
    ProfileJoinUs.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileJoinUs($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        vm.hasJoin = false;
        vm.btnMsg = "你已经加入我们！";

        vm.joinus = function () {
            httpRequest.getReq(urlHelper.getUrl('joinUs'), null, {
                type: 'POST'
            }).then(function (d) {
                vm.hasJoin = true;
                vm.btnMsg = "你已经加入我们！";
                utils.alert("成功加入我们");
            }, function (d) {
                vm.hasJoin = false;
                utils.alert(d.msg);
            });
        };

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "加入我们",
                isShow: true
            }, $location);
        }

        function init() {
            httpRequest.getReq(urlHelper.getUrl('getJoinUs'))
                .then(function (d) {
                    if (d == null) {
                        vm.hasJoin = false;
                    } else {
                        vm.hasJoin = true;
                        if (d.status == 'audit_pass') {
                            vm.btnMsg = "你已经加入我们！";
                        } else if (d.status == 'audit_fail') {
                            vm.btnMsg = "你已申请加入我们, 但审核失败！";
                        } else if (d.status == 'wait_audit') {
                            vm.btnMsg = "你已申请加入我们, 申请正在审核中";
                        }

                    }

                });
        }

        init();
    }
});