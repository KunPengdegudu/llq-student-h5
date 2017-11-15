/**
 * Created by fionaqin on 2017/8/30.
 */
define([
    'screens/groupBuying/module',
    'jq',
    'screens/groupBuying/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProductDetailsCtrl', ProductDetails);

    ProductDetails.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$q',
        '$timeout',
        '$loadingOverlay',
        '$interval',
        '$window',
        'httpRequest',
        '$location',
        'groupBuyingUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ProductDetails($rootScope, $scope, $state, $stateParams, $q, $timeout, $loadingOverlay, $interval, $window, httpRequest, $location, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 0,
            _ptProductId = $stateParams.ptProductId,
            _productId = $stateParams.productId;


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/groupBuying/main"
                },
                title: "商品详情",
                isShow: true
            }, $location);
        }

        vm.productId = _productId;
        vm.ptProductId = _ptProductId;
        vm.navtations = [{
            name: '商品介绍', isActive: false, id: 1
        }, {
            name: '商品参数', isActive: false, id: 2
        }, {
            name: '包装售后', isActive: false, id: 3
        }];

        vm.promotionId = null;
        vm.productDetail = null;  //商品介绍
        vm.productSpec = null;    //商品参数

        vm.selectNav = selectNav;
        function selectNav(item) {
            vm.navtations.forEach(function (item, idx) {
                item.isActive = false;
            });
            item.isActive = true;

            var productInfContainer = jq('#productInfContainer');
            if (item.id == 1) {
                if (vm.productDetail) {
                    productInfContainer.html(utils.htmlDecode(vm.productDetail, true));
                } else {
                    productInfContainer.html('<div style="width: 100%;padding: 0 15px;line-height:40px">暂无商品介绍！</div>');
                }
            } else if (item.id == 2) {
                if (vm.productSpec) {
                    productInfContainer.html(utils.htmlDecode(vm.productSpec, true));
                } else {
                    productInfContainer.html('<div style="width: 100%;padding: 0 15px;line-height:40px">暂无商品参数！</div>');
                }
            } else if (item.id == 3) {
                productInfContainer.html('<div style="width: 100%;padding: 0 15px;line-height:40px">暂无售后信息！</div>');
            }
        }

        //获取商品介绍、商品参数
        function loadProductDesc() {
            var descRequestParam = {
                productId: _productId,
                terminalType: 'mobile'
            };

            httpRequest.getReq(urlHelper.getUrl('findProductDesc'), descRequestParam, {
                ignoreLogin: true
            }).then(function (d) {
                vm.productDetail = d.detail;
                vm.productSpec = d.specParam;
                selectNav(vm.navtations[0]);
            });
        }

        vm.data = {};
        vm.postageStatus = '不包邮';
        vm.oldPrice = 0;    //市场价
        vm.normalPrice = 0;   //单独购买的价格
        // vm.showPostage = false;
        vm.hasSale = 0;   //已拼
        vm.joinNum = 0;   //几人团
        vm.productEvaluateNo = 0;    //商品评价的数量
        vm.ptProductStatus = "";    //判断底部按钮显示状态   canBuy、spellLight、robGoHold、reachedLimit、outDate

        vm.productImgs = {   //轮播图数据
            carouselIndex: 0,
            slides: []
        };

        vm.tuanInfoList = [];   //当前商品开团列表
        vm.isShowPtList = false;   //是否显示当前商品开团列表
        vm.showTag = false;
        vm.tagStrs = [];

        vm.productImg = '';    //弹框内产品图
        vm.desc = '';
        vm.hasStock = false;    //拼光了  or   去拼团
        vm.selectedSku = [];    //存放选中的sku

        vm.ptProductSkuDOList = [];     //进行比对的skuId
        vm.productDetailInfoDTOSkus = [];
        vm.shareSkuAttrVOList = [];
        vm.productPrice = 0;   //拼团价格
        vm.name = '';
        vm.currTime = 0;    //当前时间（浏览器时间）

        //跳转到订单确认页要传的参数
        vm.addressId = null;
        vm.productSkuId = null;
        vm.ptProductSkuId = null;


        vm.productInfo = {};
        vm.defaultSku = null;
        vm.canBuy = true;


        function initProductSlideHeight() {
            var productSlides = jq("#productSlides").find("ul");
            var h = jq($window).width();
            productSlides.css("height", h + "px");
        }

        //参团玩法
        vm.gotoRule = function () {
            utils.gotoUrl('/groupBuying/rule');
        };

        //"立即参团"——跳转到参团详情页
        vm.gotoGrouponDetails = gotoGrouponDetails;
        function gotoGrouponDetails(item) {
            var url = utils.getUrlWithParams('/groupBuying/details', {
                tuanId: item.id,
                status: 'unchange'
            });
            utils.gotoUrl(url);
        }

        //跳转到订单确认页
        vm.gotoOrderConfirm = gotoOrderConfirm;
        function gotoOrderConfirm() {
            if (vm.hasStock > 0) {
                if (vm.selectItem) {
                    var url = utils.getUrlWithParams('/groupBuying/orderConfirm', {
                        'addressId': vm.addressId,
                        'productId': _productId,
                        'proSkuId': vm.productSkuId,
                        'ptProductSkuId': vm.ptProductSkuId
                    });
                    if (utils.checkLogin($rootScope, $location, null, url)) {
                        utils.gotoUrl(url);
                    }
                } else {
                    if (checkLogin()) {
                        utils.alert("请填写收货地址", function () {
                            vm.joinGrouponDialog.closeDialog();
                        });
                    }
                }
            } else {
                utils.alert('库存不足', function () {
                    vm.joinGrouponDialog.closeDialog();
                });
            }
        }


        function checkLogin() {
            if (!$rootScope.loginStatus) {
                utils.alert('未登录不能使用,请登录', function () {
                    utils.gotoUrl("/login");
                });
                return false;
            }
            return true;
        }

        //产品弹框
        vm.joinGrouponDialog = {
            isVisible: false,
            openDialog: function () {
                vm.joinGrouponDialog.isVisible = true;
                // if(vm.defaultSku){
                //     vm.joinGrouponDialog.isVisible = true;
                // }
            },
            closeDialog: function () {
                vm.joinGrouponDialog.isVisible = false;
            }
        }


        //商品详情
        vm.getPtPproductDetail = getPtPproductDetail;
        function getPtPproductDetail() {
            httpRequest.getReq(urlHelper.getUrl('getPtPproductDetail'), {
                ptProductId: _ptProductId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                loaderComplete();
                vm.data = d;
                vm.promotionId = d.promotionId;
                vm.hasSale = d.salesQuantity;
                vm.ptProductStatus = d.ptProductStatus;
                vm.postageStatus = d.exemptionPostage;
                vm.joinNum = d.joinNum;

                if (d.tagFeature) {
                    vm.tagStrs = d.tagFeature.split(",");
                    if (vm.tagStrs.length > 0) {
                        vm.showTag = true;
                    } else {
                        vm.showTag = false;
                    }
                }

                if (d.productDetailInfoDTO && d.productDetailInfoDTO.product) {
                    vm.productInfo = d.productDetailInfoDTO.product;
                    vm.oldPrice = vm.productInfo.marketPrice;
                    vm.productImg = vm.productInfo.imgUrl;
                    vm.name = vm.productInfo.name;
                }


                if (vm.productInfo && vm.productInfo.sku && vm.productInfo.sku.skuItemIds) {
                    vm.defaultSku = vm.productInfo.sku.skuItemIds;
                }


                // imgs
                if (d.productDetailInfoDTO && d.productDetailInfoDTO.imgs && d.productDetailInfoDTO.imgs.length > 0) {
                    var imgInfo;
                    for (var i = 0; i < d.productDetailInfoDTO.imgs.length; i++) {
                        imgInfo = d.productDetailInfoDTO.imgs[i];
                        vm.productImgs.slides.push({
                            id: imgInfo.id,
                            img: utils.htmlDecode(imgInfo.imgUrl)
                        });
                    }
                }

                var initSelectedSku = {};
                if (d && d.productDetailInfoDTO && d.productDetailInfoDTO.skus && d.productDetailInfoDTO.skus.length > 0) {

                    var productDTO = d.productDetailInfoDTO;
                    vm.productDetailInfoDTOSkus = d.productDetailInfoDTO.skus;

                    var initSkusId = null;
                    if (productDTO.product && productDTO.product.sku) {
                        initSkusId = productDTO.product.sku.id;
                        if (productDTO.product.sku.skuAttributeList) {

                            //初始化sku
                            if (d && d.shareSkuAttrVOList && d.shareSkuAttrVOList.length > 0) {
                                vm.shareSkuAttrVOList = d.shareSkuAttrVOList;
                                //初始选中有货列表第一个sku组合
                                for (var i = 0; i < d.shareSkuAttrVOList.length; i++) {
                                    var itemSkuList = d.shareSkuAttrVOList[i].shareSkuAttrItemDTOList;
                                    if (itemSkuList && itemSkuList.length > 0) {
                                        initSelected(itemSkuList, false);
                                        itemSkuList.forEach(function (itemSkuObj, idx) {
                                            productDTO.product.sku.skuAttributeList.forEach(function (itemSku, idx) {
                                                if (itemSku.attributeValueId == itemSkuObj.id) {
                                                    vm.selectedSku.push(itemSkuObj);
                                                }
                                            });
                                        });
                                    }
                                }
                                initSelected(vm.selectedSku, true);
                            }
                        }

                        if (d.ptProductSkuDOList && d.ptProductSkuDOList.length > 0) {
                            d.ptProductSkuDOList.forEach(function (item, idx) {
                                if (initSkusId == item.skuId) {
                                    vm.productPrice = item.itemPrice;
                                }
                            })
                        }
                    }


                }

                if (d && d.ptProductSkuDOList && d.ptProductSkuDOList.length > 0) {

                    vm.ptProductSkuDOList = d.ptProductSkuDOList;
                }
                getSkuResult(vm.selectedSku);

            });
        }


        //选中操作
        vm.select = function (category, item) {
            initSelected(category.shareSkuAttrItemDTOList, false);
            item.isSelect = true;

            vm.selectedSku.forEach(function (itemIndex, index) {
                if (itemIndex.skuAttrId == category.id) {
                    vm.selectedSku.splice(index, 1);
                    vm.selectedSku.push(item);
                }
            })
            getSkuResult(vm.selectedSku);
        }


        vm.hasProduct = false;
        function getSkuResult(items) {
            //处理数据
            var result = '';
            var newResult = '';
            items.sort(function (a, b) {
                return a.id - b.id;
            });

            items.forEach(function (itemId, ind) {
                result += itemId.id + ",";
                newResult = result.substring(0, result.length - 1);
            });
            vm.hasStock = false;
            //根据获得的数据结果进行比对
            if (newResult.length > 0) {
                if (vm.productDetailInfoDTOSkus.length > 0 && vm.ptProductSkuDOList.length > 0) {
                    vm.productDetailInfoDTOSkus.forEach(function (itemSku, idx) {
                        if (itemSku.skuItemIds == newResult) {
                            vm.normalPrice = itemSku.price;
                            vm.desc = itemSku.productSkuTag;

                            vm.hasProduct = true;

                            vm.ptProductSkuDOList.forEach(function (item, index) {
                                if (itemSku.id == item.skuId) {
                                    vm.productSkuId = item.skuId;
                                    vm.ptProductSkuId = item.id;

                                    vm.productPrice = item.itemPrice;   //拼团价格
                                    if (item.stock && item.stock > 0) {
                                        vm.hasStock = true;
                                    } else {
                                        vm.hasStock = false;
                                    }
                                }
                            });
                        }
                    });
                }
            } else {
                vm.normalPrice = vm.productInfo.sku.price;
            }

        }


        //当前商品开团列表
        vm.getPtTuanList = getPtTuanList;
        function getPtTuanList() {
            httpRequest.getReq(urlHelper.getUrl('getPtTuanList'), {
                ptProductId: _ptProductId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                vm.currTime = d.currTime;
                if (d && d.ptTuanDTOList && d.ptTuanDTOList.length > 0) {
                    vm.isShowPtList = true;
                    vm.tuanInfoList = d.ptTuanDTOList.slice(0, 2);

                    vm.tuanInfoList.forEach(function (item, ind) {
                        for (var i = 0; i < item.ptTuanItemDTOList.length; i++) {
                            if (item.ptTuanItemDTOList[i].captain) {
                                item.phone = item.ptTuanItemDTOList[i].phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                            }
                        }
                        dropDown(item);
                    })
                } else {
                    vm.isShowPtList = false;
                }
            });
        }

        //商品评价（数量）
        function getEvaluateCount() {
            httpRequest.getReq(urlHelper.getUrl('getEvaluateCount'), {
                productId: _productId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                vm.productEvaluateNo = d;
            });
        }

        //获取收货地址
        function showDeliveryList() {
            httpRequest.getReq(urlHelper.getUrl('showDeliveryList'), null, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items && d.items.length > 0) {
                    vm.selectItem = d.items[0];
                    vm.addressId = d.items[0].addressId;
                }
            });
        }

        //收货地址
        vm.selectItem = null;
        vm.hasAddress = false;

        vm.chooseAddressFn = function (addressItem) {
            if (addressItem) {
                vm.selectItem = addressItem;
                vm.addressId = addressItem.addressId;
            }
            checkCart();
        };

        vm.toSelectAddress = function () {
            var url = $window.location.hash.substr(1);
            if (utils.checkLogin($rootScope, $location, null, url)) {
                vm.addressDialog.openDialog();
            }
        };

        vm.checkCart = checkCart;
        function checkCart() {
            if (vm.addressDialog && vm.addressDialog.items && vm.addressDialog.items.length > 0) {
                vm.hasAddress = true;
            } else {
                vm.hasAddress = false;
            }

        }

        //单独购买
        vm.gotoProductDetail = gotoProductDetail;
        function gotoProductDetail() {
            var requestParams;
            if (vm.promotionId) {
                requestParams = {
                    productId: _productId,
                    promotionId: vm.promotionId
                }
            } else {
                requestParams = {
                    productId: _productId
                }
            }

            var url = utils.getUrlWithParams('/product/detail', requestParams);
            utils.gotoUrl(url);
        }

        var loadingTimer;

        vm.loaderComplete = loaderComplete;
        function loaderComplete() {
            $loadingOverlay.hide();

            if (loadingTimer) {
                $timeout.cancel(loadingTimer);
                loadingTimer = null;
            }
        }

        function showLoading(msg) {
            var template = "<div class='ui-loading'><img class='ui-loading-img' src='../../assets/imgs/base/loading.gif' /><div class='ui-loading-text'>拼命加载中...</div></div></div>";
            $loadingOverlay.show(template);
            loadingTimer = $timeout(function () {
                $loadingOverlay.hide();
            }, 10000);

        }

        //插件类函数
        //初始化选中
        function initSelected(arr, bool) {
            //arr 数组 (颜色、尺寸等大类目);
            //bool 初始化状态值：bool(控制选中 or 不选中);
            arr.forEach(function (item, idx) {
                item.isSelect = bool;
            });
            return arr;
        }

        function setDialog() {
            var dialogH = jq("#userDialog");
            var h = jq($window).height() * 0.464;
            dialogH.css("height", h + "px");
        }

        //倒计时
        function dropDown(item) {
            item.timeDiff = item.endTime - vm.currTime;
            $interval(function () {
                if (item.timeDiff > 0) {
                    item.timeDiff = item.timeDiff - 1000;
                    item.dropDown = timeFormat(item.timeDiff);
                } else {
                    item.dropDown = "00" + ":" + "00";
                }
            }, 1000);
        }

        //时间格式处理
        var data = {};

        function timeFormat(time) {
            if (time && time > 0) {
                var thisTime = parseInt(time);
                if (typeof (thisTime) == 'number') {
                    var s, m, h;
                    s = (parseInt(time / 1000)) % 60;
                    m = (parseInt(time / 1000 / 60)) % 60;
                    h = parseInt(time / 1000 / 60 / 60);
                    data.hour = (h > 9) ? h : ('0' + h);
                    data.minute = (m > 9) ? m : ('0' + m);
                    data.second = (s > 9) ? s : ('0' + s);
                    return data.hour + ":" + data.minute + ":" + data.second;
                }
            }
        }

        vm.gotoMain = gotoMain;
        function gotoMain() {
            utils.gotoUrl('/groupBuying/main')
        }

        vm.doOrder = function () {
            if (vm.shareSkuAttrVOList.length > 0) {
                vm.joinGrouponDialog.openDialog();
            } else {
                vm.productSkuId = vm.productInfo.sku.id;
                vm.ptProductSkuDOList.forEach(function (item, index) {
                    if (vm.productSkuId == item.skuId) {
                        vm.ptProductSkuId = item.id;
                    }
                });
                if (vm.data.stock > 0) {
                    vm.hasStock = true;
                }
                gotoOrderConfirm();

            }
        }
        vm.assessItems = []
        //评论
        vm.assess = {
            isVisible: false,
            openDialog: function () {
                vm.assess.isVisible = true;
                getAssessItems();
            },
            closeDialog: function () {
                vm.assess.isVisible = false;
            }
        };
        vm.isAbnormal = true;
        vm.getAssessItems = getAssessItems;
        function getAssessItems() {
            var params = {
                productId: _productId,
                pageNo: pageIndex,
                pageSize: 20
            };

            httpRequest.getReq(urlHelper.getUrl('getEvaluateList'), params, {ignoreLogin: true})
                .then(function (d) {
                    pageIndex++;
                    var items = d.items;
                    vm.assessItems = vm.assessItems.concat(items);
                    if (items.length === 0) {
                        vm.isAbnormal = false;
                    }
                }, function () {
                });
        }


        function init() {
            showLoading();
            getPtPproductDetail();
            selectNav(vm.navtations[0]);
            loadProductDesc();
            showDeliveryList();
            setDialog();
            getPtTuanList();
            getEvaluateCount();
            initProductSlideHeight();
        }

        init();
    }
});