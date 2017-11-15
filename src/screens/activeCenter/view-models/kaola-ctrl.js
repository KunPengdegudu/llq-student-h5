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

    module.controller('activeCenterKaolaCtrl', activeCenterKaola);

    ////////
    activeCenterKaola.$inject = [
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
    function activeCenterKaola($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1,
            reactNative = window.reactNativeInject;     //零零期app  fromLLQApp

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '网易考拉专场',
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

        function doQueryWidetNodetree(widgetCode) {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), {
                widgetCode: widgetCode
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.nodeTree.length > 0) {
                    d.nodeTree.forEach(function (item, idx) {
                        doQueryData(widgetCode, item)
                    })
                }
            })
        }


        function doQueryData(widgetCode, node) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                widgetCode: widgetCode,
                nodeId: node.nodeId,
                limit: 6,
                offset: 1
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (widgetCode == 'WX027') {
                    getProductArea01(node, d.items);
                }
                if (widgetCode == 'WX029') {
                    getProductArea2(node, d.items);
                }
            });
        }

        vm.productAreaList01 = [];
        function getProductArea01(node, items) {
            items.forEach(function (item, idx) {
                item.priceForInt = parseInt(item.proSkuPrice);
                item.priceForDecimal = (item.proSkuPrice * 100) - (parseInt(item.priceForInt) * 100);
                if (item.priceForDecimal <= 0) {
                    item.priceForDecimal = '00';
                }
            });
            node.templateGoodsList = items;
            vm.productAreaList01.push(node);
            vm.productAreaList01.sort(function (a, b) {
                return a.nodeId - b.nodeId;
            })

        }

        vm.productAreaList02 = [];
        function getProductArea2(node, items) {
            node.templateGoodsList = [];
            var rows = [];
            if (items && items.length > 0) {
                for (var i = 0; i < items.length;) {
                    var row = [];
                    row.push(items[i], items[i + 1]);
                    i = i + 2;
                    rows.push(row);
                }
                node.templateGoodsList = rows;
            }
            console.log(node)
            vm.productAreaList02.push(node);
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

        vm.gotoQuota = function () {
            utils.gotoUrl('/activeCenter/coupon');
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

        function init() {
            //getHotProduct();
            doQueryWidetNodetree('WX027');
            doQueryWidetNodetree('WX029');
        }

        init();
    }
});