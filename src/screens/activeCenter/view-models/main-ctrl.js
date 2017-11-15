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

    module.controller('activeCenterMainCtrl', activeCenterMain);

    ////////
    activeCenterMain.$inject = [
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
    function activeCenterMain($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1,
            _name = $stateParams.name,
            reactNative = window.reactNativeInject,
            carouseHeight = 0;    //零零期app  fromLLQApp

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '818扒光节',
                isShow: true,
                closeWebView: true
            }, $location);
        }

        //if (reactNative && reactNative == "fromLLQApp") {
        //    $rootScope.navConfig.isShow = false;
        //    vm.activeCenter = {
        //        'position': 'absolute',
        //        'top': 0
        //    }
        //}
        vm.activeTimeNodes = [];


        vm.timeNodeTop = [];
        vm.timeNodeBottom = [];
        vm.showEnterTitle = '818扒光节';
        vm.useCouponStyle = true;
        function getTimeNode(systemTime) {
            var countDown = 0,
                times = [{
                    timeShow: '8月14日',
                    titleShow: '众多优惠抢先看',
                    btnShow: '活动热身',
                    startTime: '2017-08-01 00:00:00',
                    endTime: '2017-08-14 23:59:59',
                    active: false
                }, {
                    timeShow: '8月15日',
                    titleShow: '神券在手 买单不愁',
                    btnShow: '整点抢券',
                    startTime: '2017-08-15 00:00:00',
                    endTime: '2017-08-15 23:59:59',
                    active: false
                }, {
                    timeShow: '8月16日-17日',
                    titleShow: '用券减100 再送碎屏险',
                    btnShow: '手机减再送',
                    startTime: '2017-08-16 00:00:00',
                    endTime: '2017-08-16 23:59:59',
                    active: false
                }, {
                    timeShow: '8月17日-18日',
                    titleShow: '大平台折后再满减',
                    btnShow: '各大平台',
                    startTime: '2017-08-17 00:00:00',
                    endTime: '2017-08-17 23:59:59',
                    active: false
                }, {
                    timeShow: '8月18日-20日',
                    titleShow: '全场满减送+免息券',
                    btnShow: '神券专区',
                    startTime: '2017-08-18 00:00:00',
                    endTime: '2017-08-21 00:00:00',
                    active: false
                }];
            vm.systemTime = systemTime;

            times.forEach(function (item, index) {
                item.active = false;
                item.startTimeStamp = parseInt(new Date(Date.parse(item.startTime.replace(/-/g, "/"))).getTime());
                item.endTimeStamp = parseInt(new Date(Date.parse(item.endTime.replace(/-/g, "/"))).getTime());
                if (systemTime >= item.startTimeStamp && systemTime <= item.endTimeStamp) {
                    item.active = true;
                    item.style = {
                        backgroundColor: '##fcf004',
                        color: '#5a2eca'
                    };
                    vm.showEnterTitle = item.btnShow;
                } else {
                    item.style = {};
                }

                if (index % 2 != 1) {
                    vm.timeNodeBottom.push(item);
                } else {
                    vm.timeNodeTop.push(item);
                }
            });
            vm.activeTimeNodes = times;
        }

        vm.pageInfo = {
            carouselIndex: 0,
            imgSize: {
                width: 614,
                height: 270
            },
            styles: {
                height: "1px"
            },
            slides: [{
                id: 's1',
                url: '/activeCenter/kaola',
                img: "/app/assets/imgs/active-center/main/carousel-img-kl.jpg"
            }, {
                id: 's2',
                url: '/activeCenter/yx',
                img: "/app/assets/imgs/active-center/main/carousel-img-yx.jpg"
            }, {
                id: 's3',
                url: '/activeCenter/jd',
                img: "/app/assets/imgs/active-center/main/carousel-img-jd.jpg"
            }],
            init: function () {
                var winWidth = jq($window).width() * 0.92;
                carouseHeight = vm.pageInfo.imgSize.height * winWidth / vm.pageInfo.imgSize.width;
                vm.pageInfo.styles.height = parseInt(carouseHeight) + "px";
            }

        };

        vm.hotProductList01 = [];
        function getHotProduct01() {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: 1,
                limit: 10,
                nodeId: 835,
                widgetCode: 'WX018'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                        vm.hotProductList01.push(item);
                    });
                    vm.hotProduct = {
                        width: d.items.length * 150 + "px"
                    }
                }
            }, function () {

            });
        }

        vm.hotProductList02 = [];
        function getHotProduct02() {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                offset: 1,
                limit: 10,
                nodeId: 817,
                widgetCode: 'WX018'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                        vm.hotProductList02.push(item);
                    });
                    vm.hotProduct = {
                        width: d.items.length * 150 + "px"
                    }
                }
            }, function () {

            });
        }

        vm.activeEnters = [];
        vm.enterRowsStyle = {};
        function getEnters() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidgets'), {
                type: 'commerce_promotion_1',
                limit: 12
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var itemRows = [];

                var window = jq($window).width();

                vm.enterRowsStyle = {
                    height: (window / 2) * 300 / 449 + "px"
                };
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
                    vm.activeEnters = itemRows;
                }
            }, function () {

            });
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
                jq('#activeMain').scrollTop(vm.goodsPoTop + 5);
            }
        };

        vm.goodsList = [];

        vm.showBtn = true;
        vm.getActiveGoods = getActiveGoods;
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

        vm.goodsIsFIxed = false;

        vm.goodsPoTop = 0;

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

        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };

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

        vm.gotoUrl = function (url) {
            if (url) {
                utils.gotoUrl(url);
            }
        };

        vm.gotoCoupon = function () {
            utils.gotoUrl('/activeCenter/coupon')
        };

        function getTimeForNow() {
            httpRequest.getReq(urlHelper.getUrl('getTimestamp'), null, {
                ignoreLogin: true
            }).then(function (d) {
                getTimeNode(d);
            })
        }

        function init() {
            getTimeForNow();
            getHotProduct01();
            getHotProduct02();
            getEnters();
            getActiveGoodsTitle();
            initScroll();
            vm.pageInfo.init();
        }

        init();
    }
});