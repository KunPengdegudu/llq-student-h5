/**
 * activity 901 controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/activeCenter/module',
    'jq',
    'qrcode',
    'screens/activeCenter/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('activeCenterYxCtrl', activeCenterYx);

    ////////
    activeCenterYx.$inject = [
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
        'activeMainUrlHelper',
        'CONSTANT_UTILS'
    ];
    function activeCenterYx($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1,
            reactNative = window.reactNativeInject;     //零零期app  fromLLQApp

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '严选专场',
                isShow: true
            }, $location);
        }

        //if (reactNative && reactNative == "fromLLQApp") {
        //    $rootScope.navConfig.isShow = false;
        //    vm.activeCenter = {
        //        'position': 'absolute',
        //        'top': 0
        //    }
        //}

        vm.hotProductList = [];
        function getHotProduct() {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: 1,
                limit: 10,
                nodeId: 668,
                widgetCode: 'WX0201'
            }, {
                ignoreLogin: true
            }).then(function (d) {

                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                        vm.hotProductList.push(item);
                    });
                }
            }, function () {

            });
        }

        function doQueryWidetNodetree() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), {
                widgetCode: 'WX031'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.nodeTree.length > 0) {
                    d.nodeTree.forEach(function (item, idx) {
                        doQueryData(item)
                    })
                }
            })
        }

        vm.productAreaList = [];
        function doQueryData(node) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                widgetCode: 'WX031',
                nodeId: node.nodeId,
                limit: 6,
                offset: 1
            }, {
                ignoreLogin: true
            }).then(function (d) {
                node.templateGoodsList = [];
                var row1 = [], row2 = [];
                if (d && d.items.length > 0) {
                    d.items.forEach(function (itemNode, idx) {
                        if (idx < 3) {
                            row1.push(itemNode);
                        } else {
                            row2.push(itemNode);
                        }
                    })
                    node.templateGoodsList.push(row1, row2);
                }
                vm.productAreaList.push(node);
            });
        }

        vm.gotoMore = gotoMore;
        function gotoMore(item) {
            var url = utils.getUrlWithParams('/template/productList', {
                nodeId: item.nodeId,
                widgetCode: 'WX031',
                name: item.nodeName
            });
            utils.gotoUrl(url);
        }

        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };
        vm.getRed = getRed;
        function getRed(id, type) {
            httpRequest.getReq(urlHelper.getUrl("couponReceive"), {
                'couponId': id,
                'couponType': type
            }).then(function (d) {
                utils.customDialog('温馨提示', '您已领取成功，前往查看', '前往查看,取消', function (buttonIndex) {
                    if (buttonIndex == 1) {
                        gotoRed(item)
                    }
                });
            }, function (d) {
                utils.alert(d.msg || '领取失败')
            })
        }

        vm.gotoRed = gotoRed;
        function gotoRed(item) {
            var url = '';
            if (item && item.couponType == 'shop_coupon') {
                url = '/profile/coupon/notUsed';
            } else {
                url = '/profile/red/notUsed'
            }
            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage(url);
            } else {
                //$window.location.href = windowLocation + url;
                utils.gotoUrl(url);
            }
        }

        vm.gotoProductDetail = function (item) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: item.productId,
                promotionId: item.promotionId,
                promotionType: item.promotionType
            });

            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage(url);
            } else {
                //$window.location.href = windowLocation + url;
                utils.gotoUrl(url);
            }
        };

        function init() {
            getHotProduct();
            doQueryWidetNodetree();
        }

        init();
    }
});