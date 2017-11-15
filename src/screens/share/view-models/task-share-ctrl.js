/**
 * Created by qinsufan on 17-1-10.
 */
define([
    'screens/share/module',
    'jq',
    'qrcode',
    'screens/share/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('taskShareCtrl', TaskShare);

    ////////
    TaskShare.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$state',
        '$stateParams',
        '$q',
        '$window',
        '$interval',
        'settingCache',
        'httpRequest',
        'shareUrlHelper',
        'CONSTANT_UTILS',
        'CONSTANT_STYLE_URL_PREFIX'
    ];
    function TaskShare($rootScope, $scope, $location, $state, $stateParams, $q, $window, $interval, settingCache, httpRequest, urlHelper, utils, urlPrefix) {
        var vm = $scope;
        var dtd = $q.defer();

        //console.log($state);
        //var _spreadCode = $stateParams.spreadParam ? $stateParams.spreadParam : '';
        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "邀请有礼",
                isShow: true,
                isShowRightBtn: false,
                rightBtnType: "icon",
                rightBtnAttrs: {
                    icon: "icon-weixin-share"
                    // fn: loanExplation
                }

            }, $location);
        }

        vm.position = {};
        //console.log(_spreadCode);

        vm.isSharePage = false;
        vm.canShow = false;
        vm.showRules = true;
        vm.userCanWithdrawAmount = 0;
        vm.totalFriends = 0;  //用户邀请的好友数
        vm.activityInvite = 0;
        vm.totalAmount = 0;
        vm.noticeLists = [];
        vm.isShow = false;
        vm.isShowLoopRankList = false;

        vm.gotoWithdraw = gotoWithdraw;
        vm.gotoShareFriends = gotoShareFriends;
        vm.inviteFriends = inviteFriends;
        vm.startNoticeAnimate = startNoticeAnimate;
        vm.getBroadcast = getBroadcast;
        vm.getLottery = getLottery;
        vm.gotoLoading = gotoLoading;


        function gotoShareFriends() {
            utils.gotoUrl("/share/friendsList");  //跳转到好友列表页
        }

        function gotoWithdraw() {
            utils.gotoUrl('/works/transfer'); //跳转到提现
        }

        function getLottery() {
            window.location.href = 'http://show.007fenqi.com/app/cell/index.html?type=invite';
        }

        function gotoLoading() {
            window.location.href = 'https://down-cdn.007fenqi.com/app/family/homepage/index.html#/app/install';
        }

        vm.qrCodeDialog = {
            isVisible: false,
            openDialog: function () {
                vm.qrCodeDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.qrCodeDialog.isVisible = false;
            }
        };

        vm.shareGuideDialog = {
            isVisible: false,
            openDialog: function () {
                vm.shareGuideDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.shareGuideDialog.isVisible = false;
            }
        }

        //注册成功弹框
        vm.shareEnrollDialog = {
            isVisible: false,
            openDialog: function () {
                vm.shareEnrollDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.shareEnrollDialog.isVisible = false;
            }
        }

        //活动规则
        vm.rulesDialog = {
            isVisible: false,
            openDialog: function () {
                vm.rulesDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.rulesDialog.isVisible = false;
            }
        };

        vm.strategyShow = strategyShow;
        vm.strategy = {
            isVisible: false,
            closeDialog: function () {
                vm.strategy.isVisible = false;
            }
        };

        function strategyShow() {
            vm.strategy.isVisible = true;
        }

        vm.gotoRed = gotoRed;
        function gotoRed() {
            utils.gotoUrl('/profile/red/notUsed');
        }

        function inviteFriends() {
            document.getElementById("qrcode").innerHTML = "";
            var qr_code = new qrcode(document.getElementById("qrcode"), {
                width: 200,
                height: 200
            });

            jq("#qrcode").css({
                width: '200px',
                margin: "0 auto"
            });

            qr_code.makeCode(vm.shareUrl);
            vm.qrCodeDialog.openDialog();
        }


        //邀请好友注册
        vm.enroll = {
            showPwd: false,
            canSubmit: true,
            pwdShowUrl: '../../../app/assets/imgs/works-share/icon_eyeoff.png',
            showConfirmPwd: false,
            confirmPwdShowUrl: '../../../app/assets/imgs/works-share/icon_eyeoff.png',
            showSpreadCode: true,
            spreadText: '收起填写邀请码',
            spreadUrl: '../../../app/assets/imgs/works-share/icon_top.png',
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
                name: '',
                authSuccess: false,
                imgCode: '',
                imgCodeSrc: ''
            },

            changeImgCode: function () {
                vm.enroll.data.imgCodeSrc = urlHelper.getUrl('getImgCode') + Math.random();
            },

            canclePwd: function () {
                vm.enroll.data.password = '';
            },

            changePwdType: function () {
                if (vm.enroll.showPwd) {
                    vm.enroll.showPwd = false;
                    vm.enroll.pwdShowUrl = '../../../app/assets/imgs/works-share/icon_eyeon.png';
                } else {
                    vm.enroll.showPwd = true;
                    vm.enroll.pwdShowUrl = '../../../app/assets/imgs/works-share/icon_eyeoff.png';
                }
            },
            changeConfirmPwdType: function () {
                if (vm.enroll.showConfirmPwd) {
                    vm.enroll.showConfirmPwd = false;
                    vm.enroll.confirmPwdShowUrl = '../../../app/assets/imgs/works-share/icon_eyeon.png';
                } else {
                    vm.enroll.showConfirmPwd = true;
                    vm.enroll.confirmPwdShowUrl = '../../../app/assets/imgs/works-share/icon_eyeoff.png';
                }
            },

            hideSpreadCode: function () {
                if (vm.enroll.showSpreadCode) {
                    vm.enroll.showSpreadCode = false;
                    vm.enroll.spreadText = '填写邀请码';
                    vm.enroll.spreadUrl = '../../../app/assets/imgs/works-share/icon_down.png';
                } else {
                    vm.enroll.showSpreadCode = true;
                    vm.enroll.spreadText = '收起填写邀请码';
                    vm.enroll.spreadUrl = '../../../app/assets/imgs/works-share/icon_top.png';
                }
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
            checkEmptyPhone: function () {
                if (utils.isEmpty(vm.enroll.data.phone)) {
                    utils.alert("手机号码不能为空");
                    return false;
                }
                if (!utils.checkMobile(vm.enroll.data.phone)) {
                    utils. alert("手机号码格式不正确");
                    return false;
                }
                return true;
            },

            getAuthCode: function () {
                if (vm.enroll.btn.enable && vm.enroll.checkEmptyPhone()) {
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
                                    utils.alert(d.msg, vm.enroll.changeImgCode);
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
            checkSubmit: function () {
                if (utils.isEmpty(vm.enroll.data.phone)) {
                    utils.alert("手机号码不能为空");
                    return false;
                }
                if (!utils.checkMobile(vm.enroll.data.phone)) {
                    utils.alert("手机号码格式不正确");
                    return false;
                }
                if (utils.isEmpty(vm.enroll.data.authAuthCode)) {
                    utils.alert("验证码不能为空");
                    return false;
                }
                if (utils.isEmpty(vm.enroll.data.password)) {
                    utils.alert("新密码不能为空");
                    return false;
                }
                if (utils.isEmpty(vm.enroll.data.confirmPassword)) {
                    utils.alert("确认密码不能为空");
                    return false;
                }
                if (vm.enroll.data.password !== vm.enroll.data.confirmPassword) {
                    utils.alert("两次密码输入不相同");
                    return false;
                }
                if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(vm.enroll.data.password)) {
                    utils.alert("新密码格式错误:必须为8到20位的数字或字母");
                    return false;
                }
                return true;

            },

            dialogSubmit: function () {
                if (vm.enroll.checkSubmit()) {
                    var requestParam = {
                        phone: vm.enroll.data.phone,
                        authCode: vm.enroll.data.authAuthCode,
                        password: vm.enroll.data.password,
                        spreadCode: vm.enroll.data.spreadCode,
                        name: vm.enroll.data.name,
                        source: 'weixin'
                    };

                    requestParam.device_token = vm.position.device_token;
                    requestParam.device_type = vm.position.device_type;
                    requestParam.location = vm.position.location;

                    if (vm.enroll.canSubmit) {
                        vm.enroll.canSubmit = false;
                        httpRequest.getReq(urlHelper.getUrl('saveRegister'), null, {
                            type: 'POST',
                            data: requestParam,
                            ignoreLogin: true
                        }).then(function (d) {
                            vm.shareEnrollDialog.openDialog();
                            vm.enroll.canSubmit = true;
                        }, function (d) {
                            utils.alert("注册账号失败：" + d.msg);
                            vm.enroll.canSubmit = true;
                        });
                    }
                }
            }

        };
        //注册服务协议
        vm.agreementDialog = {
            isVisible: false,
            openDialog: function () {
                vm.agreementDialog.isVisible = true;
            },
            goBack: function () {
                vm.agreementDialog.isVisible = false;
            }
        };

        vm.rankTitleList = [{
            imgUrl: '../../../app/assets/imgs/works-share/rank1.png',
            isSelect: true,
            httpUrl: 'getRankDay',
            rankContent: {
                titleList: ["排名", "用户名", "好友数"],
                firstRank: {},
                rankLists: []
            }
        }, {
            imgUrl: '../../../app/assets/imgs/works-share/rank2.png',
            isSelect: false,
            httpUrl: 'getRankWeek',
            rankContent: {
                titleList: ["排名", "用户名", "好友数"],
                firstRank: {},
                rankLists: []
            }
        }, {
            imgUrl: '../../../app/assets/imgs/works-share/rank3.png',
            isSelect: false,
            httpUrl: 'getRankMonth',
            rankContent: {
                titleList: ["排名", "用户名", "好友数"],
                firstRank: {},
                rankLists: []
            }
        }];

        function selectRank(item) {
            for (var i = 0; i < vm.rankTitleList.length; i++) {
                vm.rankTitleList[i].isSelect = false;
            }
            item.isSelect = true;
        }

        //日排行
        vm.getRankList = function (item) {
            selectRank(item);
            vm.canShow = false;
            httpRequest.getReq(urlHelper.getUrl(item.httpUrl), {
                size: 8
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items && d.items.length > 0) {
                    vm.canShow = true;
                    item.rankContent.firstRank = d.items[0];
                }

                var addList = [];
                if (d.items.length > 1) {
                    for (var i = 1; i < d.items.length; i++) {
                        addList.push(d.items[i]);
                    }
                }
                item.rankContent.rankLists = addList;
            }, function () {

            });
        };

        vm.noticeAnimate = {
            timer: null,
            len: 0,
            idx: 0,
            style: {
                "margin-top": "0px"
            }
        };

        function startNoticeAnimate(len) {
            if (vm.noticeAnimate.timer) {
                $interval.cancel(vm.noticeAnimate.timer);
            }

            vm.noticeAnimate.len = len;
            vm.noticeAnimate.timer = $interval(changeNoticeStyle, 4000);

            function changeNoticeStyle() {
                vm.noticeAnimate.idx = (vm.noticeAnimate.idx + 1) % vm.noticeAnimate.len;
                vm.noticeAnimate.style["margin-top"] = (vm.noticeAnimate.idx * (-24)) + "px";
            }
        }

        //播报
        function getBroadcast() {
            httpRequest.getReq(urlHelper.getUrl('getBroadcast'), {
                size: 20
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items && d.items.length > 0) {
                    vm.isShow = true;
                    vm.noticeLists = d.items;
                    startNoticeAnimate(d.items.length);
                }
            }, function () {
                vm.isShow = false;
            });
        }

        //我的总返现
        function getWithdrawAmount() {
            httpRequest.getReq(urlHelper.getUrl('getUserWithdrawAmount'), null, {
                ignoreLogin: true
            }).then(function (d) {
                vm.userCanWithdrawAmount = d;
            }, function () {

            })
        }

        //用户通过活动邀请的总人数(登录)
        function getTotalInviteFriends() {
            httpRequest.getReq(urlHelper.getUrl('getTotalInviteFriends'), null, {
                ignoreLogin: true
            }).then(function (d) {
                vm.totalFriends = d;
            }, function () {

            })
        }

        //通过邀请活动注册的总人数(登录)
        function getInviteFriends() {
            httpRequest.getReq(urlHelper.getUrl('getInviteFriends'), null, {
                ignoreLogin: true
            }).then(function (d) {
                vm.activityInvite = d;
            }, function () {

            })
        }

        //活动总返现
        function getAllHisIncrAmount() {
            httpRequest.getReq(urlHelper.getUrl('getAllHisIncrAmount'), null, {
                ignoreLogin: true
            }).then(function (d) {
                vm.totalAmount = d;
            }, function () {

            })
        }

        //获取邀请码
        function getInviteSpreadCode() {
            var param = {
                activityType: "invite_coupon",
                channel: 'we_chat'
            };
            httpRequest.getReq(urlHelper.getUrl('getInviteSpreadCode'), null, {
                type: 'POST',
                data: param,
                isForm: true,
                ignoreLogin: true
            }).then(function (d) {
                vm.shareUrl = window.location.href + "?spreadParam=" + d;
                window.location.href = vm.shareUrl;
            }, function (d) {
            });
        }


        function init() {
            if ($rootScope.loginStatus) {
                vm.isSharePage = false;
                getBroadcast();
                getInviteSpreadCode();
                getWithdrawAmount();
                getInviteFriends();
                getTotalInviteFriends();
                getAllHisIncrAmount();
                vm.getRankList(vm.rankTitleList[0]);
            } else {
                vm.isSharePage = true;
                vm.enroll.changeImgCode();

                var windowLocation = window.location.href;
                var idx = windowLocation.indexOf("=");
                if (idx >= 0) {
                    vm.enroll.data.spreadCode = windowLocation.substring(idx + 1);
                }
                vm.position.device_type = jq.os.ios ? "ios" : jq.os.android ? "android" : "";
                utils.getLocation(function (pos) {
                    if (pos) {
                        vm.position.location = JSON.stringify(pos);
                    }
                });
            }
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
