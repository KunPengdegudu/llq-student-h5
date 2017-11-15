/**
 * security main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/security/module',
    'screens/security/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('SecurityLoginPasswordCtrl', SecurityLoginPassword);

    ////////
    SecurityLoginPassword.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        '$interval',
        'httpRequest',
        'securityUrlHelper',
        'CONSTANT_UTILS'
    ];
    function SecurityLoginPassword($rootScope, $scope, $location, $q, $interval, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/security/main"
                },
                title: "修改登陆密码",
                isShow: true
            }, $location);
        }
        vm.password = {
            isVisible: false,
            data: {
                oraPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            resetPassword: function () {
                vm.password.data.oraPassword = '';
                vm.password.data.newPassword = '';
                vm.password.data.confirmPassword = '';
            },
            dialogBeforeHide: function () {
                vm.password.resetPassword();
                return true;
            },
            dialogOpen: function () {

                vm.password.resetPassword();
                vm.password.isVisible = true;
            },
            dialogClose: function () {
                vm.password.isVisible = false;
            },
            check: function () {
                if (vm.password.data.oraPassword == '') {
                    utils.error("旧密码不能为空");
                    return false;
                }
                if (vm.password.data.newPassword == '') {
                    utils.error("新密码不能为空");
                    return false;
                }
                if (vm.password.data.confirmPassword == '') {
                    utils.error("确认密码不能为空");
                    return false;
                }
                if (vm.password.data.newPassword !== vm.password.data.confirmPassword) {
                    utils.error("两次密码输入不相同");
                    return false;
                }
                if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(vm.password.data.newPassword)) {
                    utils.error("新密码格式错误");
                    return false;
                }
                return true;
            },
            dialogSubmit: function (addressType) {
                console.log(addressType);
                var check = vm.password.check();

                if (check) {

                    var requestParam = {
                        'oldPassword': vm.password.data.oraPassword,
                        'password': vm.password.data.newPassword,
                         type: addressType
                    };

                    httpRequest.getReq(urlHelper.getUrl('changePassword'), null, {
                        type: 'POSt',
                        data: requestParam
                    }).then(function (d) {
                        vm.password.isVisible = false;
                        utils.alert("修改密码成功");
                    }, function (d) {
                        utils.error("修改密码失败：" + d.msg);
                    });
                }
            }
        };


    }
});
