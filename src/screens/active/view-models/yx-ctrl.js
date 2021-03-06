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

    module.controller('ActiveYxCtrl', ActiveYx);

    ////////
    ActiveYx.$inject = [
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
    function ActiveYx($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '严选专场',
                isShow: true
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

        vm.hotProductList = [];
        function hotProductList() {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: 1,
                limit: 10,
                nodeId: 1058,
                widgetCode: 'WX088'
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

        vm.ActiveNodes = [];
        function getActiveGoods() {
            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: 'WX089'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.nodeTree) {
                    vm.ActiveNodes = d.nodeTree;
                }
                vm.ActiveNodes.forEach(function (item, idx) {
                    item.goodsList = [];
                    getGoods('WX089', item);
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
                var itemRows = [];
                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                    });
                    for (var i = 0; i < d.items.length; i++) {
                        var itemRow = [];
                        if (i % 2 == 1) {
                            itemRow.push(d.items[i - 1]);
                            itemRow.push(d.items[i]);
                            if (itemRow.length > 0) {
                                itemRows.push(itemRow);
                            }
                        }
                    }
                    node.goodsList = node.goodsList.concat(itemRows);
                }
            }, function () {

            });
        }

        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };
        vm.getRed = getRed;
        function getRed() {
            httpRequest.getReq(urlHelper.getUrl("couponReceive"), {
                'couponId': 523,
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

        vm.gotoRed = gotoRed;
        function gotoRed() {
            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage('/profile/red/notUsed');
            } else {
                //$window.location.href = windowLocation + url;
                utils.gotoUrl('/profile/red/notUsed');
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

        //跳转到选品方案列表
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

        function init() {
            hotProductList();
            getActiveGoods()
        }

        init();


    }

});