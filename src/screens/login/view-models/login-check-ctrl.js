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

    module.controller('LoginCheckCtrl', LoginCheck);

    ////////
    LoginCheck.$inject = [
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
    function LoginCheck($scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, eventId, constant, utils) {
        var vm = $scope,
            _phone = $stateParams.phone || '',
            _pwd = $stateParams.pwd || '';

        vm.position = {};

        vm.login = {
            username: _phone,
            password: _pwd,
            source: 'wxm',
            smscode: ''
        };

        vm.timeIndex = 0;
        vm.authMsg = null;
        vm.authCode = '';

        vm.showUsername = _phone.replace(/(\d{3})(\d{4})/, "$1 $2 ");
        vm.sendAuthCode = sendAuthCode;

        function checkUserInfo() {
            if (utils.isEmpty(_phone) || utils.isEmpty(_pwd)) {
                utils.alert('服务异常，请重新登陆', function () {
                    window.location.href = 'http://m.007fenqi.com/app/family/wxm/index.html#/login';
                });
                return false
            }
            return true;
        }

        function sendAuthCode() {
            vm.authMsg = null;
            if (vm.timeIndex == 0) {

                httpRequest.getReq(urlHelper.getUrl('sendsmscode'), {
                    phone: _phone
                }, {
                    ignoreLogin: true
                }).then(function (d) {
                    if (d) {
                        vm.authMsg = d;
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

        function doLogin() {
            var requestParam = vm.login;
            requestParam.device_token = vm.position.device_token;
            requestParam.uniqueId = vm.position.unique_device_id;
            requestParam.device_type = vm.position.device_type;
            requestParam.location = vm.position.location;
            requestParam.app_name = vm.position.app_name;
            requestParam.info = vm.position.attach_info;

            httpRequest.getReq(urlHelper.getUrl('dorisklogin'), null, {
                type: 'POST',
                data: requestParam,
                ignoreLogin: true
            }).then(function (d) {
                settingCache.set("__username", vm.login.username);
                settingCache.set("__ifo", d.ifo);
                utils.gotoUrl('/enter/main');
            }, function (d) {
                utils.error(d.msg || "服务器忙，请重试!", function () {
                    vm.authCode = '';
                    vm.timeIndex = 0;
                    vm.authMsg = null;
                });
            });

        }

        vm.gotoUrl = function (url) {
            if (url) {
                utils.gotoUrl(url);
            }
        }

        vm.index01 = null;
        vm.index02 = null;
        vm.index03 = null;
        vm.index04 = null;
        vm.checkAuthCode = checkAuthCode;
        function checkAuthCode() {
            if (vm.authCode.length > 4) {
                vm.login.smscode = vm.authCode.slice(0, 4);
            } else {
                vm.login.smscode = vm.authCode;
            }
            console.log(vm.login);
            vm.index01 = vm.authCode.toString().substring(0, 1);
            vm.index02 = vm.authCode.toString().substring(1, 2);
            vm.index03 = vm.authCode.toString().substring(2, 3);
            vm.index04 = vm.authCode.toString().substring(3, 4);
            if (vm.authCode.length == 4) {
                doLogin();
            }
        }

        function init() {

            // 用户信息
            vm.position.app_name = "student";
            vm.position.device_type = jq.os.ios ? "ios" : jq.os.android ? "android" : "";

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
            if (checkUserInfo()) {
                sendAuthCode();
            }

            // init img code

            var unWatch = vm.$watch('authCode', checkAuthCode, true);
            //
            vm.$on('$destroy', function () {
                unWatch();
            });
        }

        init();


    }

});