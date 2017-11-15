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

    module.controller('SecurityConfirmPhoneCtrl', SecurityConfirmPhone);

    ////////
    SecurityConfirmPhone.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        '$interval',
        'httpRequest',
        'securityUrlHelper',
        'CONSTANT_UTILS'
    ];
    function SecurityConfirmPhone($rootScope, $scope, $location, $q, $interval, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/security/main"
                },
                title: "验证手机",
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
            utils.confirm("亲，您确定要更换通讯手机号码?", function (buttonIndex) {
                if (buttonIndex == 2) {
                    vm.bindPhone.dialogOpen()
                }
            });
        }

        vm.bindPhoneShow = {
            phone: '',
            change: function () {
                utils.confirm("亲，您确定要更换通讯手机号码?", vm.bindPhone.dialogOpen);
            }
        };
        vm.showPhone = '';
        vm.bindPhone = {
            phone: '',
            status: false,
            imgCode: '',
            authCode: '',
            errorText: '',
            isVisible: false,
            btn: {
                enable: true,
                text: '获取验证码',
                index: 0,
                timer: null,
                reset: function () {
                    if (vm.bindPhone.btn.timer) {
                        $interval.cancel(vm.bindPhone.btn.timer);
                    }
                    vm.bindPhone.btn.text = '获取验证码';
                    vm.bindPhone.btn.enable = true;
                    vm.bindPhone.btn.timer = null;
                    vm.bindPhone.authCode = '';
                }
            },
            dialogBefore: function () {
                vm.bindPhone.phone = '';
                vm.bindPhone.imgCode = '';
                vm.bindPhone.authCode = '';
                vm.bindPhone.btn.reset();
            },
            dialogOpen: function () {
                vm.bindPhone.dialogBefore();
                vm.bindPhone.changeImgCode();
                vm.bindPhone.isVisible = true;
            },
            dialogClose: function () {
                vm.bindPhone.isVisible = false;
                getAttach();
            },
            changeImgCode: function () {
                vm.bindPhone.imgCodeSrc = urlHelper.getUrl('getImgCode') + Math.random();
            },
            getAuthCode: function () {
                if (vm.bindPhone.btn.enable && vm.bindPhone.checkPhone()) {
                    if (vm.bindPhone.checkImgCode()) {
                        vm.bindPhone.sendAuthCode();
                    }
                }
            },
            sendAuthCode: function () {
                httpRequest.getReq(urlHelper.getUrl('sendAuthCode'), null, {
                    type: 'POST',
                    data: {
                        'phone': vm.bindPhone.phone,
                        'imgcode': vm.bindPhone.imgCode,
                        'type': 'yuyin'
                    }
                }).then(function (d) {
                    vm.bindPhone.btn.enable = false;
                    vm.bindPhone.btn.index = 150;
                    vm.bindPhone.btn.timer = $interval(function () {
                        vm.bindPhone.btn.index--;
                        vm.bindPhone.btn.text = vm.bindPhone.btn.index + " s";
                    }, 1000, 150);
                    vm.bindPhone.btn.timer.then(function () {
                        vm.bindPhone.btn.reset();
                    }, function () {
                        vm.bindPhone.btn.reset();
                    });
                }, function (d) {
                    utils.error(d.msg);
                });
            },
            checkImgCode: function () {
                if (utils.isEmpty(vm.bindPhone.imgCode)) {
                    utils.error("图片验证码不能为空");
                    return false;
                }
                if (vm.bindPhone.imgCode.length != 4) {
                    utils.error("图片验证码错误");
                    return false;
                }
                return true;
            },
            checkPhone: function () {
                if (utils.isEmpty(vm.bindPhone.phone)) {
                    utils.error("手机号码不能为空");
                    return false;
                }
                if (!utils.checkMobile(vm.bindPhone.phone)) {
                    utils.error("手机号码格式不正确");
                    return false;
                }
                return true;
            },
            checkSubmit: function () {
                if (vm.bindPhone.checkPhone() && vm.bindPhone.checkImgCode()) {
                    if (utils.isEmpty(vm.bindPhone.phone)) {
                        utils.error("手机号码不能为空");
                        return false;
                    }
                    if (!utils.checkMobile(vm.bindPhone.phone)) {
                        utils.error("手机号码格式不正确");
                        return false;
                    }
                    if (utils.isEmpty(vm.bindPhone.authCode)) {
                        utils.error("验证码不能为空");
                        return false;
                    }

                    return true;
                }
            },

            dialogSubmit: function () {
                if (vm.bindPhone.checkSubmit()) {
                    httpRequest.getReq(urlHelper.getUrl('updatePhone'), null, {
                        type: 'POST',
                        data: {
                            'phone': vm.bindPhone.phone,
                            'authCode': vm.bindPhone.authCode
                        }
                    }).then(function (d) {
                       utils.alert('修改成功！', vm.bindPhone.dialogClose)
                    }, function (d) {
                        vm.bindPhone.errorText = d.msg;
                        utils.error(d.msg);
                    });
                }
            }
        };

        function getAttach() {

            httpRequest.getReq(urlHelper.getUrl('getAttach'))
                .then(function (d) {
                    if (d) {
                        if (d.msgPhone) {
                            if (d.msgPhone.status) {
                                vm.bindPhone.status = true;
                            }
                            if (d.msgPhone.content) {
                                vm.bindPhone.phone = d.msgPhone.content.phone;
                                if (d.msgPhone.content.phone) {
                                    vm.showBindPhone = d.msgPhone.content.phone;
                                } else {
                                    vm.showBindPhone = vm.showPhone
                                }
                            }

                        }
                    }
                });

        }

        function init() {
            getAttach();
            httpRequest.getReq(urlHelper.getUrl('getMsgPhone'), {}).then(function (d) {
                vm.showPhone = d;
            }, function () {

            })
        }

        init();


    }
});
