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

    module.controller('activeCenterGoodsCtrl', activeCenterGoods);

    ////////
    activeCenterGoods.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'httpRequest',
        '$location',
        'activeMainUrlHelper',
        'CONSTANT_UTILS'
    ];
    function activeCenterGoods($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1,
            reactNative = window.reactNativeInject;     //零零期app  fromLLQApp

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "扒光低价",
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
        vm.hotGoodsLeft = [];
        vm.hotGoodsRight = [];
        function getHotProduct() {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: 1,
                limit: 10,
                nodeId: 860,
                widgetCode: 'WX026'
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
                        if (idx > 0) {
                            if (idx % 2 == 1) {
                                vm.hotGoodsLeft.push(item);
                            } else {
                                vm.hotGoodsRight.push(item);
                            }
                        }
                    });
                }
            }, function () {

            });
        }

        vm.ActiveGoodsTitles = [];
        vm.goosAreaTitle = {};

        function getActiveGoodsTitle() {
            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: 'WX013'
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
                widgetCode: 'WX012'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;
                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                        vm.goodsList.push(item);
                    });
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


        //跳转到商品
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

        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };

        function init() {
            getHotProduct();
            getActiveGoodsTitle();
            initScroll();
        }

        init();
    }
});