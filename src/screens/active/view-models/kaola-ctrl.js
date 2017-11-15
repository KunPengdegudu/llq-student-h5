/**
 * active kaola controller
 * @create 2015/10/18
 * @author dxw
 */
define([
    'screens/active/module',
    'jq',
    'qrcode',
    'screens/active/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ActiveKaolaCtrl', ActiveKaola);

    ////////
    ActiveKaola.$inject = [
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
        'activeUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ActiveKaola($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "考拉专区",
                isShow: true,
                isShowLeftBtn: true,
                leftBtnType: "back"
            }, $location);
        }
        vm.showQuota = false;

        vm.couponWrappers = [{
            imgBg: '../../../app/assets/imgs/active/a1111/main/coupon-blanknote.png',
            list: [{
                id: 538,
                type: "shop_coupon"
            }, {
                id: 539,
                type: "shop_coupon"
            }]
        }, {
            imgBg: '../../../app/assets/imgs/active/a1111/main/coupon-phone.png',
            list: [{
                id: 540,
                type: "shop_coupon"
            }, {
                id: 541,
                type: "shop_coupon"
            }, {
                id: 542,
                type: "shop_coupon"
            }, {
                id: 543,
                type: "shop_coupon"
            }]
        }, {
            imgBg: '../../../app/assets/imgs/active/a1111/main/coupon-other.png',
            list: [{
                id: 544,
                type: "shop_coupon"
            }, {
                id: 545,
                type: "shop_coupon"
            }]
        }];

        vm.changeQuota = changeQuota;
        function changeQuota() {
            vm.showQuota = !vm.showQuota;
        }


        vm.ActiveNodes = [];
        vm.firstNode = null;
        function getActiveGoods() {
            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: 'WX085'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var otherEnters = [];
                if (d && d.nodeTree) {
                    d.nodeTree.forEach(function (item, idx) {
                        if (item.nodeId == '1043') {
                            vm.firstNode = item;
                        } else {
                            otherEnters.push(item);
                        }
                    });
                    getOtherEnters(otherEnters)
                }
            });
        }

        function getOtherEnters(items) {
            var itemRows = [];
            if (items && items.length > 0) {
                for (var i = 0; i < items.length; i++) {
                    var itemRow = [];
                    if (i % 2 == 1) {
                        itemRow.push(items[i - 1]);
                        itemRow.push(items[i]);
                        if (itemRow.length > 0) {
                            itemRows.push(itemRow);
                        }
                    }
                }
                vm.ActiveNodes = vm.ActiveNodes.concat(itemRows);
            }
        }

        function getActiveNodes() {
            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: 'WX086'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.nodeTree) {
                    vm.ActiveNodeList = d.nodeTree;
                }
                vm.ActiveNodeList.forEach(function (item, idx) {
                    item.goodsList = [];
                    getGoods('WX086', item);
                });
            });
        }

        vm.getGoods = getGoods;
        function getGoods(widgetCode, node) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: 1,
                limit: 10,
                nodeId: node.nodeId,
                widgetCode: widgetCode
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                        node.goodsList.push(item);
                    });
                }
            }, function () {

            });
        }

        vm.getRed = getRed;
        function getRed() {
            httpRequest.getReq(urlHelper.getUrl("couponReceive"), {
                'couponId': 522,
                'couponType': 'red_envelope'
            }).then(function (d) {

                utils.customDialog('温馨提示', '您已领取成功，前往查看', '前往查看,取消', function (buttonIndex) {
                    if (buttonIndex == 1) {
                        gotoRed()
                    }
                });
            }, function (d) {
                utils.customDialog('温馨提示', d.msg || '领取失败', '前往查看,取消', function (buttonIndex) {
                    if (buttonIndex == 1) {
                        gotoRed()
                    }
                });
            })
        }

        function gotoRed() {
            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage('/profile/red/notUsed');
            } else {
                utils.gotoUrl('/profile/red/notUsed');
            }
        }

        vm.gotoProductList = gotoProductList;
        function gotoProductList(item, widgetCode) {
            var url = utils.getUrlWithParams('/template/productList', {
                nodeId: item.nodeId,
                widgetCode: widgetCode,
                name: item.nodeName
            });

            //if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
            //    window.postMessage(url);
            //} else {
            //$window.location.href = windowLocation + templateUrl;
            utils.gotoUrl(url);
            //}
        }

        //跳转到商品
        vm.gotoProduct = function (item) {
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

        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };
        function init() {
            getActiveGoods();
            getActiveNodes();
        }


        init();


    }

});