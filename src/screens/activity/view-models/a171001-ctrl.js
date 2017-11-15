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

    module.controller('ActivityA171001Ctrl', Activity);

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
                title: '国庆中秋 双重聚惠',
                isShow: true
            }, $location);
        }

        if (window.reactNativeInject && window.reactNativeInject == "fromLLQApp") {
            $rootScope.navConfig.isShowLeftBtn = false;
        }

        vm.iphoneList = [{
            imgUrl: '../../../app/assets/imgs/active/a171001/iphone-8.jpg',
            productId: 3844679,
            promotionId: 49,
            promotionType: 'aging'
        }, {
            imgUrl: '../../../app/assets/imgs/active/a171001/iphone-8P.jpg',
            productId: 3844680,
            promotionId: 49,
            promotionType: 'aging'
            //}, {
            //    imgUrl: '../../../app/assets/imgs/active/a171001/iphone-X.jpg',
            //    productId: 3
        }];


        function doQueryWidetNodetree() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), {
                widgetCode: 'WX015'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.nodeTree.length > 0) {
                    d.nodeTree.forEach(function (item, idx) {
                        doQueryData(item, idx);
                        vm.hotGoodsList[idx].nodeImgUrl = item.nodeImgUrl;
                        vm.hotGoodsList[idx].nodeName = item.nodeName;
                    })
                }
            })
        }

        vm.hotGoodsList = [{
            nodeImgUrl: '',
            nodeName: '',
            productList: []
        }]
        function doQueryData(node, idx) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                widgetCode: 'WX015',
                nodeId: node.nodeId,
                limit: 6,
                offset: 1
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items) {
                    d.items.forEach(function (item, index) {
                        if (index % 2 == 0) {
                            var row = [];
                            row.push(item);
                            if (index + 1 < d.items.length) {
                                row.push(d.items[index + 1])
                            }

                            vm.hotGoodsList[idx].productList.push(row);
                        }
                    })
                }
            });
        }


        vm.couponList = [];
        function getRedlist() {
            httpRequest.getReq(urlHelper.getUrl('availableList'), {
                tag: 'gqzqyh'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items.length > 0) {
                    vm.couponList = d.items;
                    vm.couponWrapper = {
                        width: 240 * d.items.length + 'px'
                    }
                }
            });
        }

        vm.getRed = getRed;
        function getRed(item) {
            httpRequest.getReq(urlHelper.getUrl("couponReceive"), {
                'couponId': item.id
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
            utils.gotoUrl(url)
        }

        vm.gotoQQ = function () {
            window.location.href = 'http://qm.qq.com/cgi-bin/qm/qr?k=UhPJ_P3lQ2dwLR90rv3oWqo98yh5kBXj';
        }

        vm.gotoProductDetail = gotoProductDetail;
        function gotoProductDetail(item) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: item.productId,
                promotionId: item.promotionId,
                promotionType: item.promotionType
            });
            utils.gotoUrl(url);
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
                    utils.gotoUrl(templateUrl);
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
                        paddingTop: '0'
                    });
                    vm.goodsIsFIxed = false;
                }
            }

        }

        vm.ActiveGoodsTitles = [];

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

        vm.activeAreaList = [];
        vm.jdItem = {};
        vm.kaolaItem = {};
        vm.yxItem = {};

        function getArea01() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidgets'), {
                type: 'commerce_promotion_1'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var items = [];
                if (d && d.items.length > 0) {
                    d.items.forEach(function (item, index) {
                        switch (item.id) {
                            case 129:
                                vm.jdItem = item;
                                break;
                            case 136:
                                vm.kaolaItem = item;
                                break;
                            case 120:
                                vm.yxItem = item;
                                break;
                        }
                    })
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
            getRedlist();
            getUiStyle();
            doQueryWidetNodetree();
            getArea01();
            initScroll();
            getActiveGoodsTitle();
        }

        init();
    }
});