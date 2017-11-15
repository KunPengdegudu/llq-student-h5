
define([
    'screens/login/module',
    'jq',
    'screens/login/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('LoginNewCtrl', LoginNew);

    ////////
    LoginNew.$inject = [
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
    function LoginNew($scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, eventId, constant, utils) {
        var vm = $scope;

        var redirect = $stateParams.redirect ? window.decodeURIComponent($stateParams.redirect) : '/',
            to = $stateParams.to ? window.decodeURIComponent($stateParams.to) : '/',
            channel = $stateParams.channel ? $stateParams.channel : 'yunying',
            spreadCode=$stateParams.spreadCode ? $stateParams.spreadCode : null,
            pageType = $stateParams.pageType ? $stateParams.pageType : 'login';

        // 多次登录问题
        var loginReg = /^\/login\?to=/i;
        while(loginReg.test(to)) {
            to = window.decodeURIComponent(to.substring(10)) || '/';
        }
        /*自定义*/
         function getBaseWidth(){
            var _self = window;
            _self.width = 750;    //设置默认最大宽度
            _self.fontSize = 100;    //默认字体大小
            _self.widthProportion = function(){var p = (document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth)/_self.width;return p>1?1:p<0.42?0.42:p;};       //根据屏幕尺寸，获取当前屏幕与最大屏幕的百分比
            _self.changePage = function(){
                document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+_self.widthProportion()*_self.fontSize+"px !important");
                //修改根元素html的font-size的值
            }
            _self.changePage();
            window.addEventListener('resize',function(){_self.changePage();},false);
            //侦听屏幕宽带的变化
        };

        var bH = (window.innerHeight || document.body.clientHeight) / 100 - 0.01;
        console.log(bH);
        vm.position = {};

        vm.login = {
            username: settingCache.get("__username"),
            password: '',
            source: 'l_a'
        };
        vm.ifShowPwd=true;
        vm.changePwdStatus=function(){
            vm.ifShowPwd=!vm.ifShowPwd
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
                spreadCode: spreadCode,
                authSuccess: false,
                imgCode: '',
                imgCodeSrc: ''
            },

            changeImgCode: function () {
                vm.enroll.data.imgCodeSrc = urlHelper.getUrl('getImgCode') + Math.random();
            },

            checkImgCode: function () {
                if (utils.isEmpty(vm.enroll.data.imgCode)) {
                    utils.alert("图片验证码不能为空");
                    return false;
                }
                if (vm.enroll.data.imgCode.length != 4) {
                    utils.alert("图片验证码错误");
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
                                    utils.alert(d.msg);
                                });
                            }
                        } else {
                            utils.alert("该手机号码已经被注册！");
                        }

                    }, function (d) {
                        utils.alert("获取验证码失败：" + d.msg);
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
                    utils.alert(d.msg);
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
                        utils.alert(d.msg);
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
                        source: 'wx',
                        channel:channel
                    };

                    requestParam.device_token = vm.position.device_token;
                    requestParam.uniqueId = vm.position.unique_device_id;
                    requestParam.device_type = vm.position.device_type;
                    // requestParam.location = vm.position.location;
                    requestParam.app_name = vm.position.app_name;
                    requestParam.info = vm.position.attach_info;
                    // requestParam.userType = vm.userType.type;

                    httpRequest.getReq(urlHelper.getUrl('saveRegister'), null, {
                        type: 'POST',
                        data: requestParam,
                        ignoreLogin: true
                    }).then(function (d) {
                        settingCache.set("__username", requestParam.phone);
                        settingCache.set("__ifo", d.ifo);
                        vm.loginSuccessDialog.openDialog();
                    }, function (d) {
                        utils.alert("注册账号失败：" + d.msg);
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

        vm.loginSuccessDialog = {
            isVisible: false,
            openDialog: function (type) {

                vm.loginSuccessDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.loginSuccessDialog.isVisible = false;
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
                    utils.alert("图片验证码不能为空");
                    return false;
                }
                if (vm.forget.data.imgCode.length != 4) {
                    utils.alert("图片验证码错误");
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
                                    utils.alert(d.msg);
                                });
                            }
                        }

                    }, function (d) {
                        utils.alert("获取验证码失败：" + d.msg);
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
                    utils.alert(d.msg);
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
                        utils.alert(d.msg);
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
                        utils.alert("修改密码失败：" + d.msg);
                    });
                }
            }
        };

        vm.userType = [{
            type: 'student',
            value: '在校学生'
        }, {
            type: 'graduate',
            value: '社会人士'
        }];

        vm.userType.type = 'student';
        vm.userType.value = "在校学生";

        vm.isSelectItemUserType = function (sexItem) {
            return sexItem.type == vm.userType.type;
        };
        vm.selectItemUserType = function (sexItem) {
            if (vm.userType.type != sexItem.type) {
                vm.userType.type = sexItem.type;
                vm.userType.value = sexItem.value;
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

        vm.ifShowSpreadCode=false;
        vm.showSpreadCode=function(){
            vm.ifShowSpreadCode=!vm.ifShowSpreadCode;
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

        function doLogin() {

            var requestParam = vm.login;
            requestParam.device_token = vm.position.device_token;
            requestParam.uniqueId = vm.position.unique_device_id;
            requestParam.device_type = vm.position.device_type;
            // requestParam.location = vm.position.location;
            requestParam.app_name = vm.position.app_name;
            requestParam.info = vm.position.attach_info;

            httpRequest.getReq(urlHelper.getUrl('login'), null, {
                type: 'POST',
                data: requestParam,
                ignoreLogin: true
            }).then(function (d) {
                settingCache.set("__username", vm.login.username);
                settingCache.set("__ifo", d.ifo);
                goTo();
            }, function (d) {
                resetLogin();
                utils.alert(d.msg || "登录错误，请重试!");
            });

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
                utils.alert("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.forget.data.phone)) {
                utils.alert("手机号码格式不正确");
                return false;
            }
            return true;
        }

        function checkPhone() {
            if (utils.isEmpty(vm.enroll.data.phone)) {
                utils.alert("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.enroll.data.phone)) {
                utils.alert("手机号码格式不正确");
                return false;
            }
            return true;
        }

        function checkForgetSubmit() {
            if (utils.isEmpty(vm.forget.data.phone)) {
                utils.alert("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.forget.data.phone)) {
                utils.alert("手机号码格式不正确");
                return false;
            }
            if (utils.isEmpty(vm.forget.data.authAuthCode)) {
                utils.alert("验证码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.forget.data.password)) {
                utils.alert("新密码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.forget.data.confirmPassword)) {
                utils.alert("确认密码不能为空");
                return false;
            }
            if (vm.forget.data.password !== vm.forget.data.confirmPassword) {
                utils.alert("两次密码输入不相同");
                return false;
            }
            if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(vm.forget.data.password)) {
                utils.alert("新密码格式错误：请填写8到20位数字或字母");
                return false;
            }

            return true;
        }

        function checkEnrollSubmit() {
            if (utils.isEmpty(vm.enroll.data.phone)) {
                utils.alert("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.enroll.data.phone)) {
                utils.alert("手机号码格式不正确");
                return false;
            }
            if (utils.isEmpty(vm.enroll.data.authAuthCode)) {
                utils.alert("短信验证码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.enroll.data.password)) {
                utils.alert("密码不能为空");
                return false;
            }
            if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(vm.enroll.data.password)) {
                utils.alert("密码格式错误：请填写8到20位数字或字母");
                return false;
            }

            return true;

        }

        function init() {
            getBaseWidth();
            console.log(1);
            console.log(bH);
            console.log(2);
            vm.enroll.changeImgCode();
            vm.forget.changeImgCode();

            // 用户信息
            vm.position.app_name = "student";
            vm.position.device_type = jq.os.ios ? "ios" : jq.os.android ? "android" : "";

            utils.getDeviceToken(function (deviceToken) {
                vm.position.device_token = deviceToken || "";
            });

            utils.getUniqueDeviceID(function (uniqueDeviceID) {
                vm.position.unique_device_id = uniqueDeviceID || "";
            });

            // utils.getLocation(function (pos) {
            //     if (pos && !utils.isEmptyObject(pos)) {
            //         vm.position.location = JSON.stringify(pos);
            //     }
            // });

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
                unWatchAuthSuccessForget = vm.$watch('forget.data.authSuccess', vm.forget.checkAuthSuccess, false);

            vm.$on('$destroy', function () {
                unWatch();
                unWatchPhone();
                unWatchAuthCode();
                unWatchAuthSuccess();

                unWatchPhoneForget();
                unWatchAuthCodeForget();
                unWatchAuthSuccessForget();
            });
        }

        init();


    }

});