/**
 * active main controller
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

    module.controller('ActiveMainCtrl', ActiveMain);

    ////////
    ActiveMain.$inject = [
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
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ActiveMain($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, constant, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "双十一大放血",
                isShow: true,
                isShowLeftBtn: true,
                leftBtnType: "back"
            }, $location);
        }

        /*
         * 红包：red_envelope
         * 商铺优惠券：shop_coupon
         * 还款券：service_fee_discount
         * */

        vm.couponWrappers = [{
            imgBg: '../../../app/assets/imgs/active/a1111/main/coupon-blanknote.png',
            list: [{
                id: 538,
                type: "service_fee_discount"
            }, {
                id: 539,
                type: "service_fee_discount"
            }]
        }, {
            imgBg: '../../../app/assets/imgs/active/a1111/main/coupon-phone.png',
            list: [{
                id: 540,
                type: "red_envelope"
            }, {
                id: 541,
                type: "red_envelope"
            }, {
                id: 542,
                type: "red_envelope"
            }, {
                id: 543,
                type: "red_envelope"
            }]
        }, {
            imgBg: '../../../app/assets/imgs/active/a1111/main/coupon-other.png',
            list: [{
                id: 544,
                type: "red_envelope"
            }, {
                id: 545,
                type: "red_envelope"
            }]
        }];
        vm.enterList = [{
            type: '考拉专区',
            imgUrl: '../../../app/assets/imgs/active/a1111/main/shop-kaola.png',
            link: function () {
                utils.gotoUrl('/active/kaola')
            }
        }, {
            type: '严选',
            imgUrl: '../../../app/assets/imgs/active/a1111/main/shop-yx.png',
            link: function () {
                utils.gotoUrl('/active/yx')
            }
        }, {
            type: '金玉福珠宝',
            imgUrl: '../../../app/assets/imgs/active/a1111/main/shop-jyf.png',
            link: function () {
                vm.gotoTemplate('WX0011', this.type)
            }
        }];

        vm.goodsArealist = [{
            titleImg: '../../../app/assets/imgs/active/a1111/main/phone-title.png',
            widgetCode: 'WX018',
            goodsList: []
        }, {
            titleImg: '../../../app/assets/imgs/active/a1111/main/goods-title.png',
            widgetCode: 'WX015',
            goodsList: []

        }];

        function getGoodsArea() {
            vm.goodsArealist.forEach(function (itemArea, index) {
                httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                    widgetCode: itemArea.widgetCode
                }, {
                    ignoreLogin: true
                }).then(function (d) {
                    if (d && d.nodeTree && d.nodeTree.length > 0) {
                        var nodeId = d.nodeTree[0].nodeId;
                        doQueryData(nodeId, itemArea);
                    }
                });

            })
        }

        function doQueryData(nodeId, item) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                limit: 10,
                offset: 1,
                widgetCode: item.widgetCode,
                nodeId: nodeId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var items = d.items ? d.items : [],
                    itemRows = [];
                if (items && items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var itemRow = [];
                        if (i % 2 == 0) {
                            itemRow.push(items[i]);
                            if (items.length >= i + 1) {
                                itemRow.push(items[i + 1]);
                            } else {
                                itemRow.push({});
                            }
                            if (itemRow.length > 0) {
                                itemRows.push(itemRow);
                            }
                        }
                    }
                    item.goodsList = item.goodsList.concat(itemRows);
                }
            })
        }

        vm.goodsObject = {
            widgetCode: 'WX012'
        };

        vm.gotoTemplate = function (widgetCode, name) {

            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: widgetCode
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.nodeTree.length > 0) {
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
                }

            });

        };

        vm.getRed = getRed;
        function getRed(item) {
            httpRequest.getReq(urlHelper.getUrl("couponReceive"), {
                'couponId': item.id,
                'couponType': item.type
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

        vm.gotoGames = function () {
            if (utils.checkLogin($rootScope, $location, null, '/active/main')) {
                window.location.href = 'http://show.007fenqi.com/app/shake/index.html';
            }
        }


        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };

        function init() {
            getGoodsArea();
        }


        init();


    }

});