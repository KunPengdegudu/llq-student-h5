define([
    'angular',
    'jq',
    'text!components/active-goods-inline/views/active-goods-inline-tpl.html'
], function (angular, jq, activeGoodsInlineTpl) {

    'use strict';

    angular
        .module('components.activeGoodsInline', [])
        .directive('activeGoodsInline', activeGoodsProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/active-goods-inline/views/active-goods-inline-tpl.html', activeGoodsInlineTpl);
        }]);

    activeGoodsProvider.$inject = [
        'CONSTANT',
        '$window',
        'httpRequest',
        'CONSTANT_UTILS'
    ];

    var DO_QUERY_WIDET_NODE_TREE = '/select/product/doQueryWidetNodetree.json';
    var DO_QUERY_DATA = '/select/product/doQueryData.json';

    /**
     * 参数
     * widgetCode
     * arrayStyle   row / column
     * reverse  end
     * **/
    function activeGoodsProvider(constant, $window, httpRequest, utils) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/active-goods-inline/views/active-goods-inline-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope,
                    pageIndex = 1,
                    _reactNative = window.reactNativeInject;

                vm.widgetCode = vm.$eval($attribute.widgetCode);
                vm.arrayStyle = vm.$eval($attribute.arrayStyle) ? vm.$eval($attribute.arrayStyle) : 'row';
                vm.reverse = vm.$eval($attribute.reverse) ? vm.$eval($attribute.reverse) : '';

                vm.ActiveGoodsTitles = [];
                function getActiveGoodsTitle() {
                    httpRequest.getReq(DO_QUERY_WIDET_NODE_TREE, {
                        widgetCode: vm.widgetCode
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
                        var titleWidth = 95 * d.nodeTree.length;
                        if (parseInt(titleWidth) < parseInt(jq($window).width())) {
                            vm.goodsAreaTitle = {
                                width: 95 + "%"
                            }
                        } else {
                            vm.goodsAreaTitle = {
                                width: titleWidth + "px"
                            }
                        }
                    });
                }

                vm.showBtn = true;
                vm.goodsList = [];
                vm.getActiveGoods = getActiveGoods;
                function getActiveGoods(nodeId, type) {
                    if (type == 'select') {
                        pageIndex = 1;
                    }
                    httpRequest.getReq(DO_QUERY_DATA, {
                        offset: pageIndex,
                        limit: 10,
                        nodeId: nodeId,
                        widgetCode: vm.widgetCode
                    }, {
                        ignoreLogin: true
                    }).then(function (d) {
                        pageIndex++;
                        var itemRows = [];
                        if (d && d.items) {
                            if (vm.arrayStyle == 'row') {
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
                            } else {
                                d.items.forEach(function (item, idx) {
                                    item.name = utils.htmlDecode(item.name);
                                    if (item.mainProImgUrl) {
                                        item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                                    }
                                    vm.goodsList.push(item);
                                });
                            }
                        }
                        console.log(d.items)
                        if (d.items.length == 0) {
                            vm.showBtn = false;
                        } else {
                            vm.showBtn = true;
                        }
                    }, function () {

                    });
                }

                vm.goodsIsFIxed = false;

                vm.goodsPoTop = 0;
                //选择
                vm.selectGoodsNodeId = function (itemNode) {
                    vm.ActiveGoodsTitles.forEach(function (item, idx) {
                        item.isActive = false;
                    });
                    itemNode.isActive = true;
                    if (itemNode != vm.selectedNode) {
                        getActiveGoods(itemNode.nodeId, 'select');
                        vm.goodsList = [];
                    }
                    vm.selectedNode = itemNode;

                    if (vm.goodsIsFIxed) {
                        jq('#activeMain').scrollTop(vm.goodsPoTop + 5);
                    }
                };


                //跳转到商品
                vm.gotoProductDetail = function (item) {
                    var url = utils.getUrlWithParams('/product/detail', {
                        productId: item.productId,
                        promotionId: item.promotionId,
                        promotionType: item.promotionType
                    });

                    if (_reactNative && _reactNative == "fromLLQApp") {
                        window.postMessage(url);
                    } else {
                        //$window.location.href = windowLocation + url;
                        utils.gotoUrl(url);
                    }
                };

                //滚动定位
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

                function init() {
                    initScroll();
                    getActiveGoodsTitle();
                }

                init();
            }
        };
    }

});