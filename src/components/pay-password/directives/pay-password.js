define(['angular',
    'jq',
    'text!components/pay-password/views/pay-password-tpl.html'
], function (angular, jq, payPasswordTpl) {

    'use strict';

    angular
        .module('components.payPassword', [])
        .directive('payPassword', payPasswordProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/pay-password/views/pay-password-tpl.html', payPasswordTpl);
        }]);

    payPasswordProvider.$inject = [
        '$location',
        '$window',
        '$timeout',
        '$interval',
        'httpRequest',
        '$loadingOverlay',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    var CHECK_FETCH_REQUIRE_U = '/m/s/credit/fetch/check_fetch_require_u.json';     //查询认证状态
    var CHECK_USER_AGING_OR_LOAN = '/m/s/user/checkUserAgingOrLoan.json';
    var IS_SET_PAY_PASSWORD = "/m/s/ewallet/is_pay_password_set.json";              //查询支付密码
    var SET_PAY_PASSWORD = "/m/m/safe/paypassword/init.json";                    //设置支付密码
    var RESET_PAY_PASSWORD = "/m/m/safe/passward/check.json";                       //修改支付密码
    var SEND_VERIFY_MESSAGE = "/m/m/safe/sendvoicecode.json";                                //发送验证语音
    var GET_VERIFY_FRG_PWD_TYPE = "/m/s/ewallet/get_verify_frg_pwd_type.json";      //获得验证条件的方式
    var GET_MSG_PHONE = '/m/m/safe/get_msgPhone.json';      //获取通讯手机号码

    function payPasswordProvider($location, $window, $timeout, $interval, httpRequest, $loadingOverlay, constant, utils) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'components/pay-password/views/pay-password-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope;

                vm.showPhone = '';

                var setPayPasswordFn = vm.$eval($attribute.setPayPasswordFn);

                vm.setPayPassword = {
                    isVisible: false,
                    errorText: '',
                    password: '',
                    restNewWord: '',
                    authCode: '',
                    btn: {
                        enable: true,
                        text: '语音验证码',
                        index: 0,
                        timer: null,
                        reset: function () {
                            if (vm.setPayPassword.btn.timer) {
                                $interval.cancel(vm.setPayPassword.btn.timer);
                            }
                            vm.setPayPassword.btn.text = '语音验证码';
                            vm.setPayPassword.btn.enable = true;
                            vm.setPayPassword.btn.timer = null;
                            vm.setPayPassword.authCode = '';
                        }
                    },
                    dialogBefore: function () {
                        vm.setPayPassword.password = '';
                        vm.setPayPassword.restNewWord = '';
                        vm.setPayPassword.authCode = '';
                        vm.setPayPassword.btn.reset();
                    },
                    openDialog: function () {
                        vm.setPayPassword.dialogBefore();
                        vm.setPayPassword.isVisible = true;
                    },
                    closeDialog: function () {
                        vm.setPayPassword.isVisible = false;
                    },
                    getAuthCode: function () {
                        if (vm.setPayPassword.btn.enable && vm.setPayPassword.checkPassword()) {
                            httpRequest.getReq(SEND_VERIFY_MESSAGE)
                                .then(function (d) {
                                    vm.setPayPassword.btn.enable = false;
                                    vm.setPayPassword.btn.index = 150;
                                    vm.setPayPassword.btn.timer = $interval(function () {
                                        if (vm.setPayPassword.btn.index <= 1) {
                                            vm.setPayPassword.btn.reset();
                                        } else {
                                            vm.setPayPassword.btn.index--;
                                            vm.setPayPassword.btn.text = vm.setPayPassword.btn.index + " s";
                                        }
                                    }, 1000, 150);
                                }, function (d) {
                                    utils.error(d.msg);
                                });
                        }
                    },
                    checkPassword: function () {
                        if (utils.isEmpty(vm.setPayPassword.password)) {
                            utils.error("支付密码不能为空");
                            return false;
                        }
                        if (utils.isEmpty(vm.setPayPassword.password)) {
                            utils.error("支付密码不能为空");
                            return false;
                        }
                        if (!(/^\d{6}$/).test(vm.setPayPassword.password)) {
                            utils.error("支付密码格式错误，支付密码为6位数字");
                            return false;
                        }
                        if (vm.setPayPassword.password != vm.setPayPassword.restNewWord) {
                            utils.error("两次密码输入不一致，请重新输入");
                            return false;
                        }
                        return true;
                    },
                    dialogSubmit: function () {
                        if (checkPayPassword(vm.setPayPassword.password)) {
                            httpRequest.getReq(SET_PAY_PASSWORD, null, {
                                type: 'POST',
                                data: {
                                    code: vm.setPayPassword.authCode,
                                    password: vm.setPayPassword.password
                                }
                            }).then(function () {
                                vm.setPayPassword.closeDialog();
                                vm.setPayPassword.errorText = '';
                                if (setPayPasswordFn) {
                                    setPayPasswordFn(vm.setPayPassword.password);
                                } else {
                                    utils.alert("支付密码设置成功");
                                }
                            }, function (d) {
                                vm.setPayPassword.errorText = d.msg;
                                utils.error("设置支付密码失败");
                            });
                        }
                    }
                };

                vm.resetPayPassword = {
                    errorText: '',
                    oldPayPassword: '',
                    newPayPassword: '',
                    restNewWord: '',
                    isVisible: false,
                    authCode: '',
                    btn: {
                        enable: true,
                        text: '语音验证码',
                        index: 0,
                        timer: null,
                        reset: function () {
                            if (vm.resetPayPassword.btn.timer) {
                                $interval.cancel(vm.resetPayPassword.btn.timer);
                            }
                            vm.resetPayPassword.btn.timer = null;

                            vm.resetPayPassword.btn.text = '语音验证码';
                            vm.resetPayPassword.btn.enable = true;

                            vm.resetPayPassword.authCode = '';
                        }
                    },
                    dialogBefore: function () {
                        vm.resetPayPassword.oldPayPassword = '';
                        vm.resetPayPassword.newPayPassword = '';
                        vm.resetPayPassword.restNewWord = '';
                        vm.resetPayPassword.authCode = '';
                        vm.resetPayPassword.btn.reset();
                    },
                    openDialog: function () {
                        vm.resetPayPassword.dialogBefore();
                        httpRequest.getReq(CHECK_USER_AGING_OR_LOAN)
                            .then(function (d) {
                                    if (d) {
                                        httpRequest.getReq(IS_SET_PAY_PASSWORD)
                                            .then(function (d) {
                                                if (d) {
                                                    vm.resetPayPassword.isVisible = true;
                                                } else {
                                                    utils.customDialog('提醒', '亲，您未设置支付密码，请设置', '设置,关闭', function (idx) {
                                                        if (idx == 1) {
                                                            vm.setPayPassword.openDialog();
                                                        }
                                                    });
                                                }
                                            }, function (d) {
                                                utils.error(d.msg || "系统错误");
                                            });
                                    } else {
                                        utils.customDialog('亲，您未完成认证', '您的认证未申请或暂未通过，当前无可用额度哦。请在APP中【我的认证】页查看当前认证状态。', '先逛逛,去下载', function (btnIdx) {
                                            if (btnIdx == 1) {
                                                utils.gotoUrl("/enter/main");
                                            } else if (btnIdx == 2) {
                                                utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                                            }
                                        });
                                    }
                                }
                            )
                    },
                    closeDialog: function () {
                        vm.resetPayPassword.isVisible = false;
                    },
                    getAuthCode: function () {
                        if (vm.resetPayPassword.btn.enable && vm.resetPayPassword.checkPassword()) {
                            httpRequest.getReq(SEND_VERIFY_MESSAGE)
                                .then(function (d) {
                                    vm.resetPayPassword.btn.enable = false;
                                    vm.resetPayPassword.btn.index = 150;
                                    vm.resetPayPassword.btn.timer = $interval(function () {
                                        if (vm.resetPayPassword.btn.inde <= 1) {
                                            vm.resetPayPassword.btn.reset();
                                        } else {
                                            vm.resetPayPassword.btn.index--;
                                            vm.resetPayPassword.btn.text = vm.resetPayPassword.btn.index + " s";
                                        }
                                    }, 1000, 150);
                                }, function (d) {
                                    utils.error(d.msg);
                                });
                        }
                    },
                    checkPassword: function () {
                        if (utils.isEmpty(vm.resetPayPassword.oldPayPassword)) {
                            utils.error("旧支付密码不能为空");
                            return false;
                        }
                        if (utils.isEmpty(vm.resetPayPassword.newPayPassword)) {
                            utils.error("新支付密码不能为空");
                            return false;
                        }
                        if (utils.isEmpty(vm.resetPayPassword.restNewWord)) {
                            utils.error("确认密码不能为空");
                            return false;
                        }
                        if (vm.resetPayPassword.newPayPassword != vm.resetPayPassword.restNewWord) {
                            utils.error("新密码与确认密码输入不一致，请重新输入");
                            return false;
                        }
                        return true;
                    },
                    dialogSubmit: function () {
                        if (checkResetPasswordSubmit()) {
                            httpRequest.getReq(RESET_PAY_PASSWORD, null, {
                                type: 'POST',
                                data: {
                                    code: vm.resetPayPassword.authCode,
                                    oldPassword: vm.resetPayPassword.oldPayPassword,
                                    password: vm.resetPayPassword.newPayPassword,
                                    type: 'payPassword'
                                }
                            }).then(function () {
                                vm.resetPayPassword.closeDialog();
                                vm.resetPayPassword.errorText = '';
                                utils.alert("支付密码修改成功");
                            }, function (d) {
                                vm.resetPayPassword.errorText = d.msg;
                                utils.error("修改支付密码失败:" + d.msg)
                            });
                        }
                    }
                };

                vm.forgetPayPassword = {
                    isVisible: false,
                    errorText: '',
                    newPayPassword: '',
                    restNewWord: '',
                    btn: {
                        enable: true,
                        text: '语音验证码',
                        index: 0,
                        timer: null,
                        reset: function () {
                            if (vm.forgetPayPassword.btn.timer) {
                                $interval.cancel(vm.forgetPayPassword.btn.timer);
                            }
                            vm.forgetPayPassword.btn.text = '语音验证码';
                            vm.forgetPayPassword.btn.enable = true;
                            vm.forgetPayPassword.btn.timer = null;
                            vm.forgetPayPassword.authCode = '';
                        }
                    },
                    dialogBefore: function () {
                        vm.forgetPayPassword.newPayPassword = '';
                        vm.forgetPayPassword.restNewWord = '';
                        vm.forgetPayPassword.btn.reset();
                    },
                    openDialog: function () {
                        vm.resetPayPassword.closeDialog();
                        vm.forgetPayPassword.dialogBefore();
                        vm.forgetPayPassword.isVisible = true;
                    },
                    closeDialog: function () {
                        vm.forgetPayPassword.isVisible = false;
                    },
                    getAuthCode: function () {
                        if (vm.forgetPayPassword.btn.enable) {
                            httpRequest.getReq(SEND_VERIFY_MESSAGE)
                                .then(function (d) {
                                    vm.forgetPayPassword.btn.enable = false;
                                    vm.forgetPayPassword.btn.index = 150;
                                    vm.forgetPayPassword.btn.timer = $interval(function () {
                                        if (vm.forgetPayPassword.btn.index <= 1) {
                                            vm.forgetPayPassword.btn.reset();
                                        } else {
                                            vm.forgetPayPassword.btn.index--;
                                            vm.forgetPayPassword.btn.text = vm.forgetPayPassword.btn.index + " s";
                                        }
                                    }, 1000, 150);
                                }, function (d) {
                                    utils.error(d.msg);
                                });
                        }
                    },
                    dialogSubmit: function () {
                        var params = {
                            code: vm.forgetPayPassword.authCode,
                            password: vm.forgetPayPassword.newPayPassword
                        };
                        if (canForgetPasswordSubmit()) {
                            httpRequest.getReq(SET_PAY_PASSWORD, null, {
                                type: 'POST',
                                data: params
                            }).then(function (d) {
                                vm.forgetPayPassword.errorText = '';
                                vm.forgetPayPassword.closeDialog();
                                utils.alert('支付密码重置成功');
                            }, function (d) {
                                vm.forgetPayPassword.errorText = d.msg;
                                utils.error('重置支付密码失败');
                            })
                        }
                    }
                };

                vm.gotoBindPhone = function (type) {
                    if (type == 'set') {
                        vm.setPayPassword.closeDialog();
                    }
                    if (type == 'revise') {
                        vm.resetPayPassword.closeDialog();
                    }
                    if (type == 'forget') {
                        vm.forgetPayPassword.closeDialog();
                    }
                    vm.bindPhone.dialogOpen();
                };

                function canForgetPasswordSubmit() {
                    if (utils.isEmpty(vm.forgetPayPassword.authCode)) {
                        utils.error('验证码不能为空');
                        return false;
                    }
                    if (utils.isEmpty(vm.forgetPayPassword.newPayPassword)) {
                        utils.error('旧密码不能为空');
                        return false;
                    }
                    if (!(/^\d{6}$/).test(vm.forgetPayPassword.newPayPassword)) {
                        utils.error("输入有误，支付密码为6位数字");
                        return false;
                    }
                    if (vm.forgetPayPassword.newPayPassword !== vm.forgetPayPassword.restNewWord) {
                        utils.error("两次密码输入不相同");
                        return false;
                    }
                    return true;
                }


                function checkResetPasswordSubmit() {
                    if (vm.resetPayPassword.oldPayPassword == '') {
                        utils.error("旧密码不能为空");
                        return false;
                    }
                    if (vm.resetPayPassword.newPayPassword == '') {
                        utils.error("新密码不能为空");
                        return false;
                    }
                    if (vm.resetPayPassword.restNewWord == '') {
                        utils.error("确认密码不能为空");
                        return false;
                    }
                    if (vm.resetPayPassword.newPayPassword !== vm.resetPayPassword.restNewWord) {
                        utils.error("两次密码输入不相同");
                        return false;
                    }
                    if (!(/^\d{6}$/).test(vm.resetPayPassword.newPayPassword)) {
                        utils.error("新密码格式错误，支付密码为6位数字");
                        return false;
                    }
                    if (utils.isEmpty(vm.resetPayPassword.authCode)) {
                        utils.error("验证码不能为空");
                        return false;
                    }
                    return true;
                }


                function checkPayPassword(payPassword) {
                    if (!(/^\d{6}$/).test(payPassword)) {
                        utils.error("输入有误，支付密码为6位数字");
                        return false;
                    }
                    if (utils.isEmpty(vm.setPayPassword.authCode)) {
                        utils.error("验证码不能为空");
                        return false;
                    }
                    return true;
                }

                function init() {
                    httpRequest.getReq(GET_MSG_PHONE)
                        .then(function (d) {
                            vm.showPhone = d;
                        })
                }

                init();
            }
        };
    }

})
;