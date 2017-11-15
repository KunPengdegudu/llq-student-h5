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

    module.controller('activeCenterJdCtrl', activeCenterJd);

    ////////
    activeCenterJd.$inject = [
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
    function activeCenterJd($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1,
            reactNative = window.reactNativeInject;     //零零期app  fromLLQApp

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '京东专场',
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

        vm.hotProductList01 = [];
        function getHotProduct01() {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: 1,
                limit: 10,
                nodeId: 850,
                widgetCode: 'WX015'
            }, {
                ignoreLogin: true
            }).then(function (d) {

                vm.itemProductStyle = {
                    width: '150px'
                };

                vm.productWrapper = {
                    width: 150 * d.items.length + "px"
                };
                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                        vm.hotProductList01.push(item);
                    });
                }
            }, function () {

            });
        }

        vm.hotProductList02 = [];
        function getHotProduct02() {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: 1,
                limit: 10,
                nodeId: 820,
                widgetCode: 'WX019'
            }, {
                ignoreLogin: true
            }).then(function (d) {

                var window = jq($window).width();
                var itemWidth = window / 3;
                vm.itemProductStyle = {
                    width: itemWidth + 'px'
                };

                vm.productWrapper = {
                    width: itemWidth * d.items.length + "px"
                };
                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                        vm.hotProductList02.push(item);
                    });
                }
            }, function () {

            });
        }

        vm.activeEnters = [];
        vm.enterRowsStyle = {};
        function getEnters() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidgets'), {
                type: 'commerce_promotion_4'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var itemRows = [];
                if (d && d.items) {
                    for (var i = 0; i < d.items.length;) {
                        itemRows.push(d.items.slice(i, i + 3));
                        i = i + 3;
                    }
                    vm.activeEnters = itemRows;
                }
            }, function () {

            });
        }

        vm.ActiveGoodsTitles = [];
        vm.goosAreaTitle = {};

        function getActiveGoodsTitle() {
            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: 'WX017'
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
                jq('#activeMain').scrollTop(vm.goodsPoTop + 5);
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
                widgetCode: 'WX017'
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

        vm.gotoGoods = function () {
            utils.gotoUrl('/activeCenter/goods');
        };


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
                    if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                        window.postMessage(templateUrl);
                    } else {
                        //$window.location.href = windowLocation + templateUrl;
                        utils.gotoUrl(templateUrl);
                    }
                }

            });

        };


        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };

        function init() {
            getHotProduct01();
            getHotProduct02();
            getEnters();
            getActiveGoodsTitle();
            initScroll();
        }

        init();
    }
});