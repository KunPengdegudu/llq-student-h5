/**
 * login login controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/login/module',
    'jq',
    'screens/login/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('LoginLoginCtrl', LoginLogin);

    ////////
    LoginLogin.$inject = [
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'loginUrlHelper',
        'EVENT_ID',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function LoginLogin($scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, eventId, constant, utils) {
        var vm = $scope;

        var redirect = $stateParams.redirect ? window.decodeURIComponent($stateParams.redirect) : '/',
            to = $stateParams.to ? window.decodeURIComponent($stateParams.to) : '/',
            pageType = $stateParams.pageType ? $stateParams.pageType : 'login';

        // 多次登录问题
        var loginReg = /^\/login\?to=/i;
        while (loginReg.test(to)) {
            to = window.decodeURIComponent(to.substring(10)) || '/';
        }

        vm.position = {};

        vm.login = {
            username: settingCache.get("__username"),
            password: '',
            source: 'wxm'
        };

        vm.enroll = {
            btn: {
                enable: true,
                text: '获取验证码',
                index: 0,
                timer: null,
                reset: function () {
                    vm.enroll.btn.text = '获取验证码';
                    vm.enroll.btn.enable = true;
                    vm.enroll.btn.timer = null;
                    vm.enroll.data.authCode = '';
                    vm.enroll.data.imgCode = '';
                }
            },
            data: {
                phone: '',
                authCode: '',
                authPhone: '',
                authAuthCode: '',
                password: '',
                confirmPassword: '',
                spreadCode: '',
                authSuccess: false,
                imgCode: '',
                imgCodeSrc: ''
            },

            changeImgCode: function () {
                vm.enroll.data.imgCodeSrc = urlHelper.getUrl('getImgCode') + Math.random();
            },

            checkImgCode: function () {
                if (utils.isEmpty(vm.enroll.data.imgCode)) {
                    utils.error("图片验证码不能为空");
                    return false;
                }
                if (vm.enroll.data.imgCode.length != 4) {
                    utils.error("图片验证码错误");
                    return false;
                }
                return true;
            },

            getAuthCode: function () {
                if (vm.enroll.btn.enable && checkPhone()) {
                    httpRequest.getReq(urlHelper.getUrl('checkUserRegister'), null, {
                        type: 'POST',
                        data: {
                            'phone': vm.enroll.data.phone
                        },
                        ignoreLogin: true
                    }).then(function (d) {
                        if (!d) {
                            if (vm.enroll.checkImgCode()) {
                                httpRequest.getReq(urlHelper.getUrl('validateImgCode'), {
                                    'imgcode': vm.enroll.data.imgCode
                                }, {
                                    ignoreLogin: true
                                }).then(function (d) {
                                    vm.enroll.sendAuthCode();
                                }, function (d) {
                                    utils.error(d.msg);
                                });
                            }
                        } else {
                            utils.error("该手机号码已经被注册！");
                        }

                    }, function (d) {
                        utils.error("获取验证码失败：" + d.msg);
                    });
                }
            },

            sendAuthCode: function () {
                httpRequest.getReq(urlHelper.getUrl('sendAuthCode'), null, {
                    type: 'POST',
                    data: {
                        'phone': vm.enroll.data.phone,
                        'imgcode': vm.enroll.data.imgCode
                    },
                    ignoreLogin: true
                }).then(function (d) {
                    vm.enroll.btn.enable = false;
                    vm.enroll.btn.index = 60;
                    vm.enroll.btn.timer = $interval(function () {
                        vm.enroll.btn.index--;
                        vm.enroll.btn.text = vm.enroll.btn.index + " s";
                    }, 1000, 60);
                    vm.enroll.btn.timer.then(function () {
                        vm.enroll.btn.reset();
                    }, function () {
                        vm.enroll.btn.reset();
                    });
                }, function (d) {
                    utils.error(d.msg);
                });
            },

            checkPhone: function () {
                if (vm.enroll.data.authSuccess) {
                    if (vm.enroll.data.authPhone != vm.enroll.data.phone) {
                        vm.enroll.data.authSuccess = false;
                        vm.enroll.data.authPhone = '';
                        vm.enroll.data.authAuthCode = '';
                    }
                }
            },

            checkAuthCode: function () {
                if (vm.enroll.data.authCode.length == 4) {
                    httpRequest.getReq(urlHelper.getUrl('validateAuthCode'), {
                        'phone': vm.enroll.data.phone,
                        'authCode': vm.enroll.data.authCode,
                        'imgcode': vm.enroll.data.imgCode
                    }, {
                        ignoreLogin: true
                    }).then(function (d) {
                        vm.enroll.data.authSuccess = true;
                        vm.enroll.data.authPhone = vm.enroll.data.phone;
                        vm.enroll.data.authAuthCode = vm.enroll.data.authCode;
                    }, function (d) {
                        utils.error(d.msg);
                    });
                } else if (vm.enroll.data.authCode.length > 4) {
                    vm.enroll.data.authCode = vm.enroll.data.authCode.substring(0, 4);
                }
            },

            checkAuthSuccess: function () {
                if (vm.enroll.data.authSuccess) {
                    $interval.cancel(vm.enroll.btn.timer);
                }
            },

            dialogSubmit: function () {
                if (checkEnrollSubmit()) {
                    var requestParam = {
                        phone: vm.enroll.data.phone,
                        authCode: vm.enroll.data.authAuthCode,
                        password: vm.enroll.data.password,
                        spreadCode: vm.enroll.data.spreadCode,
                        source: 'm'
                    };

                    requestParam.device_token = vm.position.device_token;
                    requestParam.uniqueId = vm.position.unique_device_id;
                    requestParam.device_type = vm.position.device_type;
                    requestParam.location = vm.position.location;
                    requestParam.app_name = vm.position.app_name;
                    requestParam.info = vm.position.attach_info;

                    httpRequest.getReq(urlHelper.getUrl('saveRegister'), null, {
                        type: 'POST',
                        data: requestParam,
                        ignoreLogin: true
                    }).then(function (d) {
                        settingCache.set("__username", requestParam.phone);
                        settingCache.set("__ifo", d.ifo);
                        vm.enroll.enrollConfirm();
                    }, function (d) {
                        utils.error("注册账号失败：" + d.msg);
                    });
                }
            },

            enrollConfirm: function () {
                utils.customDialog("激活信用额度", "亲，注册成功，不过目前信用额度为 0 哦！继续完善信息获得信用额度？", "先去逛逛,马上激活", function (buttonIndex) {
                    if (buttonIndex == 1) {
                        utils.alert("您后续可以在[我的-个人中心-认证信息]中完成认证", function () {
                            utils.gotoUrl(to);
                        });
                    } else if (buttonIndex == 2) {
                        var url = "/auth/main";
                        if (to) {
                            url = url + "?to=" + window.encodeURIComponent(to);
                        }
                        utils.gotoUrl(url);
                    }
                });
            }
        };

        vm.forget = {
            btn: {
                enable: true,
                text: '获取验证码',
                index: 0,
                timer: null,
                reset: function () {
                    vm.forget.btn.text = '获取验证码';
                    vm.forget.btn.enable = true;
                    vm.forget.btn.timer = null;
                    vm.forget.data.authCode = '';
                    vm.forget.data.imgCode = '';
                }
            },
            data: {
                phone: '',
                authCode: '',
                authPhone: '',
                authAuthCode: '',
                password: '',
                confirmPassword: '',
                spreadCode: '',
                authSuccess: false,
                imgCode: '',
                imgCodeSrc: ''

            },

            changeImgCode: function () {
                vm.forget.data.imgCodeSrc = urlHelper.getUrl('getImgCode') + Math.random();
            },

            checkImgCode: function () {
                if (utils.isEmpty(vm.forget.data.imgCode)) {
                    utils.error("图片验证码不能为空");
                    return false;
                }
                if (vm.forget.data.imgCode.length != 4) {
                    utils.error("图片验证码错误");
                    return false;
                }
                return true;
            },

            getAuthCode: function () {
                if (vm.forget.btn.enable && checkPhoneForget()) {
                    httpRequest.getReq(urlHelper.getUrl('checkUserRegister'), null, {
                        type: 'POST',
                        data: {
                            'phone': vm.forget.data.phone
                        },
                        ignoreLogin: true
                    }).then(function (d) {
                        if (d) {
                            if (vm.forget.checkImgCode) {
                                httpRequest.getReq(urlHelper.getUrl('validateImgCode'), {
                                    'imgcode': vm.forget.data.imgCode
                                }, {
                                    ignoreLogin: true
                                }).then(function (d) {
                                    vm.forget.sendAuthCodeForget();
                                }, function (d) {
                                    utils.error(d.msg);
                                });
                            }
                        }

                    }, function (d) {
                        utils.error("获取验证码失败：" + d.msg);
                    });
                }
            },

            sendAuthCodeForget: function () {
                httpRequest.getReq(urlHelper.getUrl('sendAuthCodeForget'), null, {
                    type: 'POST',
                    data: {
                        'phone': vm.forget.data.phone,
                        'imgcode': vm.forget.data.imgCode
                    },
                    ignoreLogin: true
                }).then(function (d) {
                    vm.forget.btn.enable = false;
                    vm.forget.btn.index = 60;
                    vm.forget.btn.timer = $interval(function () {
                        vm.forget.btn.index--;
                        vm.forget.btn.text = vm.forget.btn.index + " s";
                    }, 1000, 60);
                    vm.forget.btn.timer.then(function () {
                        vm.forget.btn.reset();
                    }, function () {
                        vm.forget.btn.reset();
                    });
                }, function (d) {
                    utils.error(d.msg);
                });
            },

            checkPhoneForget: function () {
                if (vm.forget.data.authSuccess) {
                    if (vm.forget.data.authPhone != vm.forget.data.phone) {
                        vm.forget.data.authSuccess = false;
                        vm.forget.data.authPhone = '';
                        vm.forget.data.authAuthCode = '';
                    }
                }
            },

            checkAuthCode: function () {
                if (vm.forget.data.authCode.length == 4) {
                    httpRequest.getReq(urlHelper.getUrl('validateAuthCodeForget'), {
                        'phone': vm.forget.data.phone,
                        'authCode': vm.forget.data.authCode,
                        'imgcode': vm.forget.data.imgCode
                    }, {
                        ignoreLogin: true
                    }).then(function (d) {
                        vm.forget.data.authSuccess = true;
                        vm.forget.data.authPhone = vm.forget.data.phone;
                        vm.forget.data.authAuthCode = vm.forget.data.authCode;
                    }, function (d) {
                        utils.error(d.msg);
                    });
                } else if (vm.forget.data.authCode.length > 4) {
                    vm.forget.data.authCode = vm.forget.data.authCode.substring(0, 4);
                }
            },

            checkAuthSuccess: function () {
                if (vm.forget.data.authSuccess) {
                    $interval.cancel(vm.forget.btn.timer);
                }
            },

            dialogSubmit: function () {
                if (checkForgetSubmit()) {
                    var requestParam = {
                        phone: vm.forget.data.phone,
                        authCode: vm.forget.data.authAuthCode,
                        password: vm.forget.data.password
                    };

                    httpRequest.getReq(urlHelper.getUrl('saveForget'), null, {
                        type: 'POST',
                        data: requestParam,
                        ignoreLogin: true
                    }).then(function (d) {
                        utils.alert("密码修改成功", function () {
                            vm.forgetDialog.goBack();
                        });
                    }, function (d) {
                        utils.error("修改密码失败：" + d.msg);
                    });
                }
            }
        };

        vm.disableBtn = true;

        vm.pageType = pageType; // 登录：login，注册：enroll
        vm.isActive = isActive;

        vm.clearUsername = clearUsername;
        vm.doLogin = doLogin;
        vm.switchTab = switchTab;
        vm.goBack = goBack;


        vm.forgetDialog = {
            isVisible: false,
            openDialog: function () {
                vm.forgetDialog.isVisible = true;
            },
            goBack: function () {
                vm.forgetDialog.isVisible = false;
            }
        };

        vm.agreementDialog = {
            isVisible: false,
            openDialog: function () {
                vm.agreementDialog.isVisible = true;
            },
            goBack: function () {
                vm.agreementDialog.isVisible = false;
            }
        };


        function clearUsername() {
            vm.login.username = '';
            settingCache.set("__username", "");
        }

        function isActive(type) {
            if (vm.pageType === type) {
                return true;
            }
            return false;
        }

        function switchTab(type) {
            vm.pageType = type;
        }

        function resetLogin() {
            vm.login.password = '';
        }

        function goBack() {
            utils.gotoUrl(redirect);
        }

        function goTo() {
            utils.gotoUrl(to);
        }

        function doLogin(imgcode) {
            var requestParam = vm.login;
            requestParam.device_token = vm.position.device_token || '';
            requestParam.uniqueId = vm.position.unique_device_id;
            requestParam.device_type = vm.position.device_type;
            requestParam.location = vm.position.location;
            requestParam.app_name = vm.position.app_name;
            requestParam.info = vm.position.attach_info;
            requestParam.uniqueId = '';
            //requestParam.loginType = 'needimgcode';

            requestParam.imgcode = imgcode ? imgcode : undefined;
            vm.loginImgCode.disableBtn = true;
            httpRequest.getReq(urlHelper.getUrl('dorisklogin'), null, {
                type: 'POST',
                data: requestParam,
                ignoreLogin: true
            }).then(function (d) {
                settingCache.set("__username", vm.login.username);
                settingCache.set("__ifo", d.ifo);
                vm.loginImgCode.reset();
                vm.loginImgCode.closeDialog();
                goTo();
            }, function (error) {
                vm.loginImgCode.reset();
                vm.loginImgCode.closeDialog();
                utils.error(error.msg || "登录错误，请重试!", function () {
                    if (error.code == 295 || error.code == 296 || error.code == 297) {
                        vm.loginCheckDialog.openDialog();
                    } else {
                        resetLogin();
                    }
                });
            });
        }

        vm.loginImgCode = {
            isVisible: false,
            imgUrl: '',
            imgCode: null,
            disableBtn: true,
            reset: function () {
                vm.loginImgCode.imgCode = null;
                vm.loginImgCode.imgUrl = '';
                vm.loginImgCode.disableBtn = true;
                vm.loginImgCode.getImgCode();
            },
            openDialog: function () {
                vm.loginImgCode.reset();
                vm.loginImgCode.isVisible = true;
            },
            closeDialog: function () {
                vm.loginImgCode.isVisible = false;
            },
            getImgCode: function () {
                vm.loginImgCode.imgUrl = urlHelper.getUrl('getimgcode') + Math.random();
            },
            checkImgCode: function () {
                if (vm.loginImgCode.imgCode) {
                    vm.loginImgCode.disableBtn = false;
                }
            },
            submit: function () {
                doLogin(vm.loginImgCode.imgCode);
            }
        };

        vm.getLoginErrorAccount = getLoginErrorAccount;
        function getLoginErrorAccount() {
            httpRequest.getReq(urlHelper.getUrl('getloginacount'), {
                phone: vm.login.username
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d < 3 || d >= 7) {
                    doLogin();
                } else {
                    vm.loginImgCode.openDialog();
                }
            }, function (err) {
                utils.error(err.msg || '服务器忙，请重新登陆', function () {
                    resetLogin();
                });
            })

        }

        function checkLoginBtn() {
            if (utils.isEmpty(vm.login.username) || utils.isEmpty(vm.login.password)) {
                vm.disableBtn = true;
            } else {
                vm.disableBtn = false;
            }

        }

        function checkPhoneForget() {
            if (utils.isEmpty(vm.forget.data.phone)) {
                utils.error("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.forget.data.phone)) {
                utils.error("手机号码格式不正确");
                return false;
            }
            return true;
        }

        function checkPhone() {
            if (utils.isEmpty(vm.enroll.data.phone)) {
                utils.error("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.enroll.data.phone)) {
                utils.error("手机号码格式不正确");
                return false;
            }
            return true;
        }

        function checkForgetSubmit() {
            if (utils.isEmpty(vm.forget.data.phone)) {
                utils.error("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.forget.data.phone)) {
                utils.error("手机号码格式不正确");
                return false;
            }
            if (utils.isEmpty(vm.forget.data.authAuthCode)) {
                utils.error("验证码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.forget.data.password)) {
                utils.error("新密码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.forget.data.confirmPassword)) {
                utils.error("确认密码不能为空");
                return false;
            }
            if (vm.forget.data.password !== vm.forget.data.confirmPassword) {
                utils.error("两次密码输入不相同");
                return false;
            }
            if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(vm.forget.data.password)) {
                utils.error("新密码格式错误：请填写8到20位数字或字母");
                return false;
            }

            return true;
        }

        function checkEnrollSubmit() {
            if (utils.isEmpty(vm.enroll.data.phone)) {
                utils.error("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.enroll.data.phone)) {
                utils.error("手机号码格式不正确");
                return false;
            }
            if (utils.isEmpty(vm.enroll.data.authAuthCode)) {
                utils.error("短信验证码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.enroll.data.password)) {
                utils.error("新密码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.enroll.data.confirmPassword)) {
                utils.error("确认密码不能为空");
                return false;
            }
            if (vm.enroll.data.password !== vm.enroll.data.confirmPassword) {
                utils.error("两次密码输入不相同");
                return false;
            }
            if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(vm.enroll.data.password)) {
                utils.error("新密码格式错误：请填写8到20位数字或字母");
                return false;
            }

            return true;

        }

        vm.timeIndex = 0;
        vm.authCode = '';

        vm.index01 = null;
        vm.index02 = null;
        vm.index03 = null;
        vm.index04 = null;
        vm.checkAuthCode = checkAuthCode;
        function checkAuthCode() {
            if (vm.authCode.length > 4) {
                vm.authCode = vm.authCode.slice(0, 4);
            }
            vm.index01 = vm.authCode.toString().substring(0, 1);
            vm.index02 = vm.authCode.toString().substring(1, 2);
            vm.index03 = vm.authCode.toString().substring(2, 3);
            vm.index04 = vm.authCode.toString().substring(3, 4);
            if (vm.authCode.length == 4) {
                vm.login.smscode = vm.authCode;
                doLogin();
            }
        }

        vm.loginCheckDialog = {
            isVisible: false,
            authMsg: null,
            openDialog: function () {
                if (vm.login.username) {
                    vm.showUsername = vm.login.username.replace(/(\d{3})(\d{4})/, "$1 $2 ");
                }
                vm.loginCheckDialog.sendAuthCode();
                vm.loginCheckDialog.isVisible = true;
            },
            goBack: function () {
                vm.loginCheckDialog.isVisible = false;
            },
            sendAuthCode: function () {
                if (vm.timeIndex == 0) {

                    httpRequest.getReq(urlHelper.getUrl('sendsmscode'), {
                        phone: vm.login.username
                    }, {
                        ignoreLogin: true
                    }).then(function (d) {
                        if (d) {
                            vm.loginCheckDialog.authMsg = d;
                        }
                        vm.timeIndex = 60;
                        vm.timer = $interval(function () {
                            vm.timeIndex--;
                            vm.timeText = vm.timeIndex + " s";
                        }, 1000, 60);
                        vm.timer.then(function () {
                            vm.timer = null;
                            vm.timeIndex = 0
                        }, function () {
                            vm.timer = null;
                            vm.timeIndex = 0
                        });
                    }, function (err) {

                    })
                }
            }
        };

        function init() {

            vm.enroll.changeImgCode();
            vm.forget.changeImgCode();

            // 用户信息
            vm.position.app_name = "student";
            vm.position.device_type = "h5";

            utils.getDeviceToken(function (deviceToken) {
                vm.position.device_token = deviceToken || "";
            });

            utils.getUniqueDeviceID(function (uniqueDeviceID) {
                vm.position.unique_device_id = uniqueDeviceID || "";
            });

            utils.getLocation(function (pos) {
                if (pos && !utils.isEmptyObject(pos)) {
                    vm.position.location = JSON.stringify(pos);
                }
            });

            utils.getAttachInfo(function (info) {
                if (info) {
                    vm.position.attach_info = JSON.stringify(info);
                    utils.dot(eventId["open_login_page"], info);
                }
            });


            // init img code

            var unWatch = vm.$watch('login', checkLoginBtn, true),
                unWatchPhone = vm.$watch('enroll.data.phone', vm.enroll.checkPhone, false),
                unWatchAuthCode = vm.$watch('enroll.data.authCode', vm.enroll.checkAuthCode, false),
                unWatchAuthSuccess = vm.$watch('enroll.data.authSuccess', vm.enroll.checkAuthSuccess, false);

            var unWatchPhoneForget = vm.$watch('forget.data.phone', vm.forget.checkPhone, false),
                unWatchAuthCodeForget = vm.$watch('forget.data.authCode', vm.forget.checkAuthCode, false),
                unWatchAuthSuccessForget = vm.$watch('forget.data.authSuccess', vm.forget.checkAuthSuccess, false),
                unWatchLoginImgCode = vm.$watch('loginImgCode.imgCode', vm.loginImgCode.checkImgCode, false);

            var unWatchLoginCheck = vm.$watch('authCode', checkAuthCode, true);

            vm.$on('$destroy', function () {
                unWatch();
                unWatchPhone();
                unWatchAuthCode();
                unWatchAuthSuccess();

                unWatchPhoneForget();
                unWatchAuthCodeForget();
                unWatchAuthSuccessForget();

                unWatchLoginCheck();
            });
        }

        init();


    }

});