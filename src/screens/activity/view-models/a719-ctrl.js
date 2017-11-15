/**
 * activity 901 controller
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

    module.controller('ActivityA719Ctrl', Activity);

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
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '暑期冰价节',
                isShow: true
            }, $location);
        }

        if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
            $rootScope.navConfig.isShow = false;
            vm.a719Main = {
                'position': 'absolute',
                'top': 0
            }
        }

        var windowLocation = "https://m.007fenqi.com/app/family/wxm/index.html#";

        vm.hotProductList = [];

        function hotFun() {
            vm.promotionType = "aging";
            var pageIndex = 1;
            var params = {
                brandId: '664',
                offset: pageIndex,
                limit: 10
            };
            httpRequest.getReq(urlHelper.getUrl('listPagedProductInfoFromSearch'), null, {
                ignoreLogin: true,
                type: 'POST',
                isForm: true,
                data: params
            }).then(function (d) {
                pageIndex++;
                vm.hotProductList = d.items;
                if (vm.hotProductList && vm.hotProductList.length > 0) {
                    for (var i = 0; i < vm.hotProductList.length; i++) {
                        vm.hotProductList[i].name = utils.htmlDecode(vm.hotProductList[i].name);
                        if (vm.hotProductList[i].mainProImgUrl) {
                            vm.hotProductList[i].mainProImgUrl = utils.htmlDecode(vm.hotProductList[i].mainProImgUrl);
                        }
                    }
                }
            }, function () {
                utils.error('加载失败,请稍后重试')
            });
        }

        vm.goodsItems = null;
        vm.goodsItems2 = null;
        vm.goodsItems3 = null;

        function doQueryWidgets(goodsType) {
            httpRequest.getReq(urlHelper.getUrl("doQueryWidgets"), {
                type: goodsType
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var items = d.items;
                if (d && d.items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].mainProImgUrl) {
                            items[i].mainProImgUrl = utils.htmlDecode(vm.goodsItems[i].imageUrl);
                        }
                    }
                }

                items.forEach(function (item, index) {
                    item.name = utils.htmlDecode(item.name);
                    item.promotionDesc = utils.htmlDecode(item.promotionDesc);
                });

                if (goodsType == 'commerce_promotion_1') {
                    vm.goodsItems = items;
                }
                if (goodsType == 'commerce_promotion_2') {
                    vm.goodsItems2 = items;
                }
                if (goodsType == 'commerce_promotion_3') {
                    vm.goodsItems3 = items;
                }
            }, function () {
                utils.error('加载失败,请稍后重试')
            });
        }

        vm.gotoProductDetail = gotoProductDetail;
        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });

            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage(url);
            } else {
                //$window.location.href = windowLocation + url;
                utils.gotoUrl(url);
            }
        }

        vm.gotoTemplate = function (widgetCode, name) {

            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: widgetCode
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var nodeId = d.nodeTree[0].nodeId;
                var templateUrl = '';
                if (d.widgetViewInfo && d.widgetViewInfo.tempalteType) {
                    if (d.widgetViewInfo.tempalteType == 'list_no_banner') {
                        templateUrl = utils.getUrlWithParams('/template/commonStyle', {
                            widgetCode: widgetCode,
                            name: name,
                            nodeId: nodeId
                        });
                    }
                    if (d.widgetViewInfo.tempalteType == 'list_with_banner') {
                        templateUrl = utils.getUrlWithParams('/template/main', {
                            widgetCode: widgetCode,
                            name: name,
                            nodeId: nodeId
                        });
                    }
                    if (d.widgetViewInfo.tempalteType == 'floor_with_banner') {
                        templateUrl = utils.getUrlWithParams('/template/floorStyle', {
                            widgetCode: widgetCode,
                            name: name
                        });
                    }
                    if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                        window.postMessage(templateUrl);
                    } else {
                        //$window.location.href = windowLocation + templateUrl;
                        utils.gotoUrl(templateUrl);
                    }
                }

            });

        };

        vm.goodsAreaList = [{
            bannerSrc: '',
            name: '',
            nodeId: '',
            goodsList: []
        }, {
            bannerSrc: '',
            name: '',
            nodeId: '',
            goodsList: []
        }, {
            bannerSrc: '',
            name: '',
            nodeId: '',
            goodsList: []
        }, {
            bannerSrc: '',
            name: '',
            nodeId: '',
            goodsList: []
        }, {
            bannerSrc: '',
            name: '',
            nodeId: '',
            goodsList: []
        }];
        vm.couponList = [];


        function doQueryWidetNodetree() {
            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: 'WX037'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.nodeTree) {
                    vm.nodeTree = d.nodeTree;
                    for (var i = 0; i < d.nodeTree.length; i++) {
                        vm.goodsAreaList[i].bannerSrc = utils.htmlDecode(d.nodeTree[i].nodeImgUrl);
                        vm.goodsAreaList[i].nodeId = d.nodeTree[i].nodeId;
                        vm.goodsAreaList[i].name = utils.htmlDecode(d.nodeTree[i].nodeName);
                        doQueryData(d.nodeTree[i].nodeId, i);
                    }

                }
            });
        }

        function doQueryData(nodeId, key) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                limit: 3,
                offset: 1,
                widgetCode: 'WX037',
                nodeId: nodeId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                vm.goodsAreaList[key].goodsList = d.items;
            })
        }

        function doCoupon() {
            httpRequest.getReq(urlHelper.getUrl('availableList'), {
                tag: 'july007'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                vm.couponList = d.items;
            }, function (d) {

            })
        }

        vm.getRed = getRed;
        function getRed(item) {
            httpRequest.getReq(urlHelper.getUrl("couponReceive"), {
                'couponId': item.id,
                'couponType': item.type
            }).then(function (d) {
                var url = '';
                if (item.couponType == 'shop_coupon') {
                    url = '/profile/coupon/notUsed';
                } else {
                    url = '/profile/red/notUsed'
                }
                utils.customDialog('温馨提示', '您已领取成功，前往查看', '前往查看,取消', function (buttonIndex) {
                    if (buttonIndex == 1) {
                        if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                            window.postMessage(url);
                        } else {
                            //$window.location.href = windowLocation + url;
                            utils.gotoUrl(url);
                        }
                    } else {
                        doCoupon();
                    }
                });
            }, function (d) {
                utils.alert(d.msg || '领取失败', doCoupon)
            })
        }


        vm.gotoMore = gotoMore;
        function gotoMore(item) {
            console.log(item);
            var url = utils.getUrlWithParams('/template/productList', {
                nodeId: item.nodeId,
                widgetCode: 'WX037',
                name: item.name
            });
            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage(url);
            } else {
                //$window.location.href = windowLocation + url;
                utils.gotoUrl(url);
            }
        }

        function isWeixinBrowser() {
            var ua = window.navigator.userAgent.toLowerCase();
            alert(ua);
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }

        function init() {
            hotFun();
            doQueryWidgets('commerce_promotion_1');
            doQueryWidgets('commerce_promotion_2');
            doQueryWidgets('commerce_promotion_3');

            doQueryWidetNodetree();

            doCoupon();
        }

        init();
    }
});