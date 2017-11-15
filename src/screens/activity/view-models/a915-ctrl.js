/**
 * activity 915 controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/activity/module',
    'jq',
    'qrcode',
    'screens/activity/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ActivityA915Ctrl', Activity);

    ////////
    Activity.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'activityUrlHelper',
        'CONSTANT_UTILS'
    ];
    function Activity($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "915活动",
                isShow: false
            }, $location);
        }

        var promotionIdMap = {};

        vm.goBack = goBack;

        vm.shareUrl = "http://www.007fenqi.com/w/common/register_redirect_page.html";
        vm.share = share;

        vm.sungsang = [];
        vm.gotoProductDetail = gotoProductDetail;
        vm.inviteFriends = inviteFriends;

        function shareWeixin(type) {
            var Wechat = navigator.wechat;

            if (Wechat) {
                Wechat.isInstalled(function (installed) {
                    if (installed) {

                        var param = {};

                        switch(type) {
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
                            title: "零零期 - 全国首选的大学生分期购物神器",
                            description: "大学生借款免息，0首付买手机等数码产品，更多福利等着你",
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

        function share (type) {
            switch(type) {
                case "weixin":
                case "timeline":
                    shareWeixin(type);
                    break;
                default:
                    break;
            }
        }

        function goBack () {
            utils.gotoUrl("/enter/main");
        }

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('#/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            location.replace(url);
        }


        vm.qrCodeDialog = {
            isVisible : false,
            openDialog : function(){
                vm.qrCodeDialog.isVisible = true;
            }
        };

        function inviteFriends(){
            document.getElementById("qrcode").innerHTML = "";
            httpRequest.getReq(urlHelper.getUrl('getSpreeSpreadUrl'))
                .then(function(d){
                    var qr_code = new qrcode(document.getElementById("qrcode"),{
                        width : 150,
                        height : 150
                    });
                    vm.shareUrl = d;
                    qr_code.makeCode(d);
                    vm.qrCodeDialog.openDialog();
                });
        }

        function init(){

            httpRequest.getReq(urlHelper.getUrl('getActivityInfo'), null, {
                ignoreLogin: true
            }).then(function (d) {
                if(d){
                    for(var activeType in d){
                        var promotionId = d[activeType];
                        if(activeType == 'activitySpreePromotionId'){
                            promotionIdMap.gift = promotionId;
                        }
                        if(activeType == 'activitySpree220PromotionId'){
                            promotionIdMap.sungsang = promotionId;
                        }
                        if(activeType == 'activitySpree150PromotionId'){
                            promotionIdMap.apple = promotionId;
                        }
                        if(activeType == 'activitySpree100PromotionId'){
                            promotionIdMap.other = promotionId;
                        }
                    }

                    if(promotionIdMap) {

                        for(var promotion in promotionIdMap){
                            queryProductsByPromotion(promotion);
                        }
                    }

                }

            });




        }

        function queryProductsByPromotion(promotionName) {
            var promotionId = promotionIdMap[promotionName];
            var requestParam1 = {
                promotionType: 'aging',
                promotionId: promotionId,
                offset: 1,
                limit: 10
            };

            if (utils.isAppleStore()) {
                requestParam1.source = "appstore" + utils.getAppVersion();
            }

            httpRequest.getReq(urlHelper.getUrl('listPagedProductInfoFromSearch'), requestParam1, {
                ignoreLogin: true
            }).then(function (d) {

                var items = d.items;

                if (items && items.length > 0) {

                    if(items.length % 2 != 0 && promotionName != "gift"){
                        items = items.slice(0,items.length - 1);
                    }

                    for (var i = 0; i < items.length; i++) {
                        if (items[i].mainProImgUrl) {
                            items[i].mainProImgUrl = utils.htmlDecode(items[i].mainProImgUrl);
                        }
                    }
                }

                if(promotionName == 'gift'){
                    if(items.length > 0){
                        vm.giftProduct = items[0];
                    }
                }

                vm[promotionName] = items;
            });
        }


        init();


    }

});