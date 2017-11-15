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

    module.controller('ProfileResCtrl', ProfileRes);

    ////////
    ProfileRes.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS',
        '$interval'
    ];
    function ProfileRes($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper, utils,$interval) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "个人中心",
                isShow: true
            }, $location);
        }

        vm.requestParam = {};
        vm.isAbnormal = false;

        vm.reload = reload;

        function resetPassword() {
            vm.password.data.oraPassword = '';
            vm.password.data.newPassword = '';
            vm.password.data.confirmPassword = '';
        }

        // password
        vm.password = {
            isVisible: false,
            dialogBeforeHide: function () {
                resetPassword();
                return true;
            },
            dialogOpen: function () {
                resetPassword();
                vm.password.isVisible = true;
            },
            dialogClose: function () {
                vm.password.isVisible = false;
            },
            dialogSubmit: function () {
                var check = checkPasswordSubmit();

                if (check) {

                    var requestParam = {
                        'oldPassword': vm.password.data.oraPassword,
                        'password': vm.password.data.newPassword
                    };

                    httpRequest.getReq(urlHelper.getUrl('changeUserPassword'), null, {
                        type: 'POST',
                        data: requestParam
                    }).then(function (d) {
                        vm.password.isVisible = false;
                        utils.alert("修改密码成功");
                    }, function (d) {
                        utils.error("修改密码失败：" + d.msg);
                    });
                }
            },
            data: {
                oraPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        };




        vm.checkCanSendAuthCode = checkCanSendAuthCode;


        function checkCanSendAuthCode() {
            if (vm.forgetPayPassword.type == 'bank_card') {
                if (utils.isEmpty(vm.forgetPayPassword.identityNo)) {
                    utils.error('请填写身份证');
                    return false;
                }
                if (!utils.checkID(vm.forgetPayPassword.identityNo)) {
                    utils.error('身份证格式不正确');
                    return false;
                }
                if (utils.isEmpty(vm.forgetPayPassword.usedAccNo)) {
                    utils.error('请填写银行卡号');
                    return false;
                }
                if (!utils.checkCardNo(vm.forgetPayPassword.usedAccNo)) {
                    utils.error("银行卡号输入有误!");
                    return false;
                }
            } else if(vm.forgetPayPassword.type == 'alipay') {
                if (utils.isEmpty(vm.forgetPayPassword.aliNo)) {
                    utils.error('支付宝账号不能为空');
                }
            }
            return true;
        }


        vm.gotoAuth = gotoAuth;

        vm.gotoUrl = gotoUrl;

        function gotoUrl(redirect) {
            utils.gotoUrl(redirect);
        }

        function gotoAuth() {
            utils.gotoUrl("/auth/main?to=" + utils.createRedirect($location));
        }


        function checkPasswordSubmit() {
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

        }


        function reload() {
            var requestParam = vm.requestParam;
            httpRequest.getReq(urlHelper.getUrl('res'), requestParam)
                .then(function (d) {
                    vm.data = d;
                });

        }

        function init() {
            vm.requestParam = {};
            vm.$watch('requestParam', reload, true);
        }

        init();


    }

});