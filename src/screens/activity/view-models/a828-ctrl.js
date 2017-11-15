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

    module.controller('ActivityA828Ctrl', Activity);

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
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '七夕节',
                isShow: true
            }, $location);
        }

        if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
            $rootScope.navConfig.isShow = false;
            vm.a828Main = {
                'position': 'absolute',
                'top': 0
            }
        }

        var llqCommonUrl = '__inner://https://m.007fenqi.com/app/family/homepage/index.html#';

        vm.couponList = [[{
            couponId: 501
        }, {
            couponId: 502
        }, {
            couponId: 503
        }], [{
            couponId: 504
        }, {
            couponId: 507
        }, {
            couponId: 506
        }]];

        vm.hotProductList = [{
            productId: '38093',
            promotionId: '235',
            promotionType: 'aging',
            proSkuPrice: 680,
            widgetCode: 'WX101',
            templateName: '小姐姐礼物专区',
            imgUrl: '../../../app/assets/imgs/active/a828/a828-ornament.png'
        }, {
            productId: '3840978',
            promotionId: '253',
            promotionType: 'aging',
            proSkuPrice: 48,
            widgetCode: 'WX100',
            templateName: '小哥哥礼物专区',
            imgUrl: '../../../app/assets/imgs/active/a828/a828-cup.png'
        }];

        vm.hotGoodsList = [{
            titleImg: '../../../app/assets/imgs/active/a828/goods-title-01.png',
            itemGoodsWrapper: [{
                nodeId: null,
                list: []
            }, {
                nodeId: null,
                list: []
            }]
        }, {
            titleImg: '../../../app/assets/imgs/active/a828/goods-title-02.png',
            itemGoodsWrapper: [{
                nodeId: null,
                list: []
            }, {
                nodeId: null,
                list: []
            }]
        }];

        function doQueryWidetNodetree() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), {
                widgetCode: 'WX104'
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

        function doQueryData(node) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                widgetCode: 'WX104',
                nodeId: node.nodeId,
                limit: 6,
                offset: 1
            }, {
                ignoreLogin: true
            }).then(function (d) {
                switch (node.nodeId) {
                    case 943:
                        vm.hotGoodsList[0].itemGoodsWrapper[0].nodeId = node.nodeId;
                        vm.hotGoodsList[0].itemGoodsWrapper[0].list = d.items;
                        break;
                    case 944:
                        vm.hotGoodsList[0].itemGoodsWrapper[1].nodeId = node.nodeId;
                        vm.hotGoodsList[0].itemGoodsWrapper[1].list = d.items;
                        break;
                    case 945:
                        vm.hotGoodsList[1].itemGoodsWrapper[0].nodeId = node.nodeId;
                        vm.hotGoodsList[1].itemGoodsWrapper[0].list = d.items;
                        break;
                    case 946:
                        vm.hotGoodsList[1].itemGoodsWrapper[1].nodeId = node.nodeId;
                        vm.hotGoodsList[1].itemGoodsWrapper[1].list = d.items;
                        break;
                }
                vm.hotGoodsList.forEach(function (e, index) {
                    e.itemGoodsWrapper.forEach(function (item, idx) {
                        item.list.sort(function (a, b) {
                            return b - a;
                        })
                    })
                })
            });
        }

        vm.getRed = getRed;
        function getRed(item) {
            httpRequest.getReq(urlHelper.getUrl("couponReceive"), {
                'couponId': item.couponId
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
                utils.gotoUrl(url);
            }
        }

        vm.gotoProductDetail = gotoProductDetail;
        function gotoProductDetail(item) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: item.productId,
                promotionId: item.promotionId,
                promotionType: item.promotionType
            });

            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage(url);
            } else {
                utils.gotoUrl(url);
            }
        }

        //跳转到选品方案
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
                        utils.gotoUrl(templateUrl);
                    }
                }

            });

        };

        function initScroll() {
            var holder = jq('#activeMain');
            holder.scroll(bodyScrollFn);

            function bodyScrollFn(evt) {

                // bottom to top show
                var goodsArea = jq('#goodsArea');
                var toTop = jq("#goodsTitles");
                var goodsPoTop = goodsArea.position().top;
                if (goodsPoTop > vm.goodsPoTop) {
                    vm.goodsPoTop = goodsPoTop;
                }
                if (parseInt(goodsArea.offset().top) <= 40) {
                    toTop.css({
                        position: 'fixed',
                        top: '40px',
                        zIndex: '200'
                    });
                    goodsArea.css({
                        paddingTop: '40px'
                    });
                    vm.goodsIsFIxed = true;
                } else {
                    toTop.css({
                        position: 'relative',
                        top: 0
                    });

                    goodsArea.css({
                        paddingTop: '10px'
                    });
                    vm.goodsIsFIxed = false;
                }
            }

        }

        vm.ActiveGoodsTitles = [];
        vm.goosAreaTitle = {};

        function getActiveGoodsTitle() {
            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: 'WX012'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.nodeTree) {
                    vm.ActiveGoodsTitles = d.nodeTree;
                }
                vm.ActiveGoodsTitles.forEach(function (item, index) {
                    item.isActive = false;
                });
                if (vm.ActiveGoodsTitles.length > 0) {
                    vm.ActiveGoodsTitles[0].isActive = true;
                    vm.selectedNode = vm.ActiveGoodsTitles[0];
                    getActiveGoods(vm.selectedNode.nodeId);
                }
                var titleWidth = 100 * d.nodeTree.length;
                if (parseInt(titleWidth) < parseInt(jq($window).width())) {
                    vm.goodsAreaTitle = {
                        width: 100 + "%"
                    }
                } else {
                    vm.goodsAreaTitle = {
                        width: titleWidth + "px"
                    }
                }
            });
        }

        vm.selectGoodsNodeId = function (itemNode) {
            vm.ActiveGoodsTitles.forEach(function (item, idx) {
                item.isActive = false;
            });
            itemNode.isActive = true;
            if (itemNode.nodeId != vm.selectedNode) {
                getActiveGoods(itemNode.nodeId, 'select');
                vm.goodsList = [];
            }
            vm.selectedNode = itemNode;

            if (vm.goodsIsFIxed) {
                jq('#activeMain').scrollTop(vm.goodsPoTop);
            }
        };

        vm.getActiveGoods = getActiveGoods;
        vm.goodsList = [];
        vm.goodsPoTop = 0;
        function getActiveGoods(nodeId, type) {
            if (type == 'select') {
                pageIndex = 1;
            }
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: pageIndex,
                limit: 10,
                nodeId: nodeId,
                widgetCode: 'WX012'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;
                var itemRows = [];
                if (d && d.items) {
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
                    vm.goodsList = vm.goodsList.concat(itemRows);
                }
                if (d.items.length <= 0) {
                    vm.showBtn = false;
                } else {
                    vm.showBtn = true;
                }
            }, function () {

            });
        }

        vm.activeArea01 = [[], [], []];

        function getArea01() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidgets'), {
                type: 'commerce_promotion_6',
                limit: 9
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var items = [], moreItem = null;
                if (d && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        if (item.widgetCode != 'WX102') {
                            items.push(item);
                        } else {
                            moreItem = item;
                        }
                    });
                    if (items.length == d.items.length - 1) {
                        items.push(moreItem);
                    }
                    items.forEach(function (item, idx) {
                        if (idx % 3 == 0) {
                            vm.activeArea01[0].push(item);
                        }
                        if (idx % 3 == 1) {
                            vm.activeArea01[1].push(item);
                        }
                        if (idx % 3 == 2) {
                            vm.activeArea01[2].push(item);
                        }
                    });
                }
            }, function () {

            });
        }

        function getUiStyle() {
            var windowWidth = jq($window).width();
            vm.couponWrapperStyle = {
                width: windowWidth + 'px',
                height: windowWidth * 206 / 640 + 'px'
            }
        }

        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };

        function init() {
            getUiStyle();
            doQueryWidetNodetree();
            getArea01();
            initScroll();
            getActiveGoodsTitle();
        }

        init();
    }
});