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

    module.controller('SecurityConfirmEmailCtrl', SecurityConfirmEmail);

    ////////
    SecurityConfirmEmail.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        '$interval',
        'httpRequest',
        'securityUrlHelper',
        'CONSTANT_UTILS'
    ];
    function SecurityConfirmEmail($rootScope, $scope, $location, $q, $interval, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/security/main"
                },
                title: "验证邮箱",
                isShow: true,
                isShowRightBtn: true,
                rightBtnType: "text",
                rightBtnAttrs: {
                    text: '修改',
                    fn: change
                }
            }, $location);
        }
        vm.change = change;
        function change() {
            utils.confirm("亲，您确定要修改个人邮箱吗?", function (buttonIndex) {
                if (buttonIndex == 2) {
                    vm.bindEmail.dialogOpen()
                }
            });
        }

        vm.bindEmailShow = {
            email: ''
        };

        vm.bindEmail = {
            email: '',
            imgCode: '',
            code: '',
            isVisible: false,
            btn: {
                enable: true,
                text: '获取验证码',
                index: 0,
                timer: null,
                reset: function () {
                    vm.bindEmail.btn.text = '获取验证码';
                    vm.bindEmail.btn.enable = true;

                    if (vm.bindEmail.btn.timer) {
                        $interval.cancel(vm.bindEmail.btn.timer);
                    }
                    vm.bindEmail.btn.timer = null;
                    vm.bindEmail.code = '';
                }
            },
            dialogBefore: function () {
                vm.bindEmail.email = '';
                vm.bindEmail.imgCode = '';
                vm.bindEmail.authCode = '';
            },
            dialogOpen: function () {
                vm.bindEmail.btn.reset();
                vm.bindEmail.dialogBefore();
                vm.bindEmail.changeImgCode();
                vm.bindEmail.isVisible = true;
            },
            dialogClose: function () {
                vm.bindEmail.isVisible = false;
                getEmail();
            },
            changeImgCode: function () {
                vm.bindEmail.imgCodeSrc = urlHelper.getUrl('getImgCode') + Math.random();
            },
            getAuthCode: function () {
                if (vm.bindEmail.btn.enable && vm.bindEmail.checkEmail()) {
                    if (vm.bindEmail.checkImgCode()) {
                        vm.bindEmail.sendAuthcode();
                    }
                }
            },
            sendAuthcode: function () {

                httpRequest.getReq(urlHelper.getUrl('sendEmailCode'), {
                    email: vm.bindEmail.email,
                    imgcode: vm.bindEmail.imgCode
                }).then(function (d) {
                    utils.alert("验证码已发送至邮箱" + vm.bindEmail.email + "，请注意查收")
                    vm.bindEmail.btn.enable = false;
                    vm.bindEmail.btn.index = 60;
                    vm.bindEmail.btn.timer = $interval(function () {
                        vm.bindEmail.btn.index--;
                        vm.bindEmail.btn.text = vm.bindEmail.btn.index + " s";
                    }, 1000, 60);
                    vm.bindEmail.btn.timer.then(function () {
                        vm.bindEmail.btn.reset();
                    }, function () {
                        vm.bindEmail.btn.reset();
                    });
                }, function (d) {
                    utils.error(d.msg);
                });
            },
            checkImgCode: function () {
                if (utils.isEmpty(vm.bindEmail.imgCode)) {
                    utils.error("图片验证码不能为空");
                    return false;
                }
                if (vm.bindEmail.imgCode.length != 4) {
                    utils.error("图片验证码错误");
                    return false;
                }
                return true;
            },
            checkEmail: function () {
                if (utils.isEmpty(vm.bindEmail.email)) {
                    utils.error("邮箱不能为空");
                    return false;
                }
                if (!utils.checkEmail(vm.bindEmail.email)) {
                    utils.error("邮箱格式不正确");
                    return false;
                }
                return true;
            },
            checkSubmit: function () {
                if (vm.bindEmail.checkEmail() && vm.bindEmail.checkImgCode()) {
                    if (utils.isEmpty(vm.bindEmail.email)) {
                        utils.error("邮箱不能为空");
                        return false;
                    }
                    if (!utils.checkEmail(vm.bindEmail.email)) {
                        utils.error("邮箱格式不正确");
                        return false;
                    }
                    if (utils.isEmpty(vm.bindEmail.code)) {
                        utils.error("验证码不能为空");
                        return false;
                    }

                    return true;
                }
            },

            dialogSubmit: function () {
                if (vm.bindEmail.checkSubmit()) {
                    httpRequest.getReq(urlHelper.getUrl('updateEmail'), null, {
                        type: 'POST',
                        data: {
                            email: vm.bindEmail.email,
                            code: vm.bindEmail.code
                        }
                    }).then(function (d) {
                        utils.alert('修改成功！', vm.bindEmail.dialogClose)
                    }, function (d) {
                        utils.error(d.msg || '服务器忙，请稍后再试！');
                    });
                }
            }
        };

        function getEmail() {
            httpRequest.getReq(urlHelper.getUrl('userEmailGet'))
                .then(function (d) {
                    if (d) {
                        vm.emailStatus = true;
                        vm.bindEmail.email = d;
                    } else {
                        vm.emailStatus = false;
                    }
                })
        }


        function init() {
            getEmail();
        }


        init();

    }
});