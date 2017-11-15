/**
 * login login controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/weixin/module',
    'jq',
    'screens/weixin/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WeixinEnrollCtrl', weixinEnroll);

    ////////
    weixinEnroll.$inject = [
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'weixinUrlHelper',
        'CONSTANT_UTILS'
    ];
    function weixinEnroll($scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        var spreadCode = $stateParams.spreadParam ? $stateParams.spreadParam : '',
            spreadType = $stateParams.spreadType ? $stateParams.spreadType : '';

        vm.position = {};


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
                name: '',
                authSuccess: false,
                imgCode: '',
                imgCodeSrc: ''
            },

            changeImgCode: function () {
                vm.enroll.data.imgCodeSrc = urlHelper.getUrl('getImgCode') + Math.random();
            },

            checkImgCode: function () {
                if (utils.isEmpty(vm.enroll.data.imgCode)) {
                    alert("图片验证码不能为空");
                    return false;
                }
                if (vm.enroll.data.imgCode.length != 4) {
                    alert("图片验证码错误");
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
                            if (vm.enroll.checkImgCode) {
                                httpRequest.getReq(urlHelper.getUrl('validateImgCode'), {
                                    'imgcode': vm.enroll.data.imgCode
                                }, {
                                    ignoreLogin: true
                                }).then(function (d) {
                                    vm.enroll.sendAuthCode();
                                }, function (d) {
                                    alert(d.msg);
                                });
                            }
                        } else {
                            alert("该手机号码已经被注册！");
                        }

                    }, function (d) {
                        alert("获取验证码失败：" + d.msg);
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
                    alert(d.msg);
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
                        alert(d.msg);
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
                        name: vm.enroll.data.name,
                        source: 'weixin',
                        spreadType: spreadType
                    };

                    requestParam.device_token = vm.position.device_token;
                    requestParam.device_type = vm.position.device_type;
                    requestParam.location = vm.position.location;

                    httpRequest.getReq(urlHelper.getUrl('saveRegister'), null, {
                        type: 'POST',
                        data: requestParam,
                        ignoreLogin: true
                    }).then(function (d) {
                        //vm.enroll.enrollConfirm();
                        //utils.gotoUrl(urlHelper.getUrl('downloadApp'));
                        window.location.href = 'https://down-cdn.007fenqi.com/app/family/homepage/index.html';
                        //utils.gotoUrl("/weixin/v1");
                    }, function (d) {
                        alert("注册账号失败：" + d.msg);
                    });
                }
            }

        };

        window.ACCESS_SOURCE = 'm';

        if (top.location.href != self.location.href) {
            top.location.href = self.location.href;
        }

        window.downloadFn = {

            close: function () {
                var app = document.getElementById("appDownloadWrapper");
                app.parentNode.removeChild(app);
            },

            download: function () {
                window.location.href = 'https://down-cdn.007fenqi.com/app/family/homepage/index.html#/app/install';
            }
        };

        window.outerPageFn = {
            attr: null,
            show: function (src, win, attr) {

                window.outerPageFn.attr = attr;

                var outer = document.getElementById("outerPageIframeWrapper");
                outer.style.display = "block";

                var outerTitle = document.getElementById("outerPageIframeTitile");
                if (attr && attr.title) {
                    outerTitle.innerHTML = attr.title;
                } else {
                    outerTitle.innerHTML = "页面";
                }

                var iframe = document.getElementById("outerPageIframe");
                iframe.src = src;

                if (win) {
                    iframe.width = win.width + "px";
                    iframe.height = win.height + "px";
                }
            },
            hide: function (isSuccess, rtn) {
                var outer = document.getElementById("outerPageIframeWrapper");
                outer.style.display = "none";

                var metaTag = document.createElement('meta');
                metaTag.name = "viewport";
                metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
                document.getElementsByTagName('head')[0].appendChild(metaTag);

                var attr = window.outerPageFn.attr;

                if (attr) {
                    if (isSuccess) {
                        if (attr.onSuccessFn) {
                            attr.onSuccessFn(rtn);
                        }
                    } else {
                        if (attr.onFailureFn) {
                            attr.onFailureFn(rtn);
                        }
                    }
                }
            }
        };


        vm.sexOptions = [{
            value: "1",
            label: "男"
        }, {
            value: "0",
            label: "女"
        }];

        vm.disableBtn = true;


        function checkPhone() {
            if (utils.isEmpty(vm.enroll.data.phone)) {
                alert("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.enroll.data.phone)) {
                alert("手机号码格式不正确");
                return false;
            }
            return true;
        }

        function checkEnrollSubmit() {
            if (utils.isEmpty(vm.enroll.data.phone)) {
                alert("手机号码不能为空");
                return false;
            }
            if (!utils.checkMobile(vm.enroll.data.phone)) {
                alert("手机号码格式不正确");
                return false;
            }
            if (utils.isEmpty(vm.enroll.data.authAuthCode)) {
                alert("验证码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.enroll.data.password)) {
                alert("新密码不能为空");
                return false;
            }
            if (utils.isEmpty(vm.enroll.data.confirmPassword)) {
                alert("确认密码不能为空");
                return false;
            }
            if (vm.enroll.data.password !== vm.enroll.data.confirmPassword) {
                alert("两次密码输入不相同");
                return false;
            }
            if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(vm.enroll.data.password)) {
                alert("新密码格式错误:必须为8到20位的数字或字母");
                return false;
            }
            // if (utils.isEmpty(vm.enroll.data.name)) {
            //     alert("姓名不能为空");
            //     return false;
            // }
            //
            return true;

        }


        vm.agreementDialog = {
            isVisible: false,
            openDialog: function () {
                vm.agreementDialog.isVisible = true;
            },
            goBack: function () {
                vm.agreementDialog.isVisible = false;
            }
        };

        function init() {
            vm.position.device_type = jq.os.ios ? "ios" : jq.os.android ? "android" : "";
            utils.getLocation(function (pos) {
                if (pos) {
                    vm.position.location = JSON.stringify(pos);
                }
            });

            // init img code

            vm.enroll.changeImgCode();

            var unWatchPhone = vm.$watch('enroll.data.phone', vm.enroll.checkPhone, false),
                unWatchAuthCode = vm.$watch('enroll.data.authCode', vm.enroll.checkAuthCode, false),
                unWatchAuthSuccess = vm.$watch('enroll.data.authSuccess', vm.enroll.checkAuthSuccess, false);

            vm.$on('$destroy', function () {
                unWatchPhone();
                unWatchAuthCode();
                unWatchAuthSuccess();
            });
        }

        init();


    }

});
