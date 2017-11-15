/**
 * Created by llq on 16-4-21.
 */
/**
 * Created by llq on 16-4-15.
 */

define([
    'screens/works/module',
    'jq',
    'qrcode',
    'screens/works/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('TaskSpreedCtrl', TaskSpreed);

    ////////
    TaskSpreed.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT_UTILS',
        'CONSTANT_STYLE_URL_PREFIX'
    ];
    function TaskSpreed($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils, urlPrefix) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "分享赚钱",
                isShow: true

            }, $location);
        }

        vm.item = null;
        vm.spreedHtml = null;
        vm.qrCodeDialog = {
            isVisible: false,
            openDialog: function () {
                vm.qrCodeDialog.isVisible = true;
            }
        };
        vm.freezeAmount = null;
        vm.spreadCode = null;
        vm.inviteFriends = inviteFriends;
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

        vm.clipboard = {
            canCopy: navigator.appupdate && navigator.appupdate.setClipboard,
            hasCopy: false,
            setClipboard: function () {
                if (navigator.appupdate && navigator.appupdate.setClipboard) {
                    navigator.appupdate.setClipboard(vm.spreadCode, function (data) {
                        vm.clipboard.hasCopy = true;
                        utils.alert("已复制到剪切板");
                    });
                }
            }
        };
        vm.shareUrl = "http://www.007fenqi.com/w/common/register_redirect_page.html";
        vm.share = share;

        function shareWeixin(type) {
            var Wechat = navigator.wechat;

            if (Wechat) {
                Wechat.isInstalled(function (installed) {
                    if (installed) {

                        var param = {};

                        switch (type) {
                            case "weixin":
                                param.scene = Wechat.Scene.SESSION;
                                break;
                            case "timeline":
                                param.scene = Wechat.Scene.TIMELINE;
                                break;
                            default:
                                break;
                        }

                        param.message = {
                            title: "零零期分期 - 大学生分期购物商城",
                            description: "零零期是大学生分期购物商城领先品牌，于2015年5月正式上线，公司持巨资开设大学生分期业务现已覆盖多个一二线城市，“鼠标轻轻一点，精品尽在眼前”的分期快乐服务。",
                            thumb: "https://m.007fenqi.com/app/assets/imgs/weixin/share2.png",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: vm.shareUrl
                            }
                        };

                        Wechat.share(param, function () {
                        }, function (reason) {
                            utils.alert("分享失败：" + reason);
                        });

                    } else {
                        utils.alert("亲，您没有安装微信App，请安装后再进行分享。");
                    }
                });
            }
        }

        function share(type) {
            switch (type) {
                case "weixin":
                case "timeline":
                    shareWeixin(type);
                    break;
                default:
                    break;
            }
        }

        function inviteFriends() {
            document.getElementById("qrcode").innerHTML = "";
            httpRequest.getReq(urlHelper.getUrl('getSpreadInfo'), null, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                var qr_code = new qrcode(document.getElementById("qrcode"), {
                    width: 150,
                    height: 150
                });
                vm.shareUrl = utils.htmlDecode(d.spreadRegisterUrl);
                qr_code.makeCode(d.spreadRegisterUrl);
                vm.qrCodeDialog.openDialog();
            });
        }

        function init() {

            httpRequest.getReq(urlHelper.getUrl('info'), null, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                vm.item = d;
                httpRequest.getReq(urlHelper.getUrl('getEwallet')).then(function (d) {
                    vm.freezeAmount = d.freezeAmount;
                }, function (d) {
                });
                httpRequest.getReq(urlHelper.getUrl('getSpreadInfo'), null, {
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                    vm.spreadCode = d.spreadCode;
                }, function (d) {
                    utils.error(d.msg)
                });
            }, function (d) {
            });

        }

        init();

    }

});
