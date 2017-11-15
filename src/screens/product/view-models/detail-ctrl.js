/**
 * product detail controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/product/module',
    'jq',
    'screens/product/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProductDetailCtrl', ProductDetail);

    ////////
    ProductDetail.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$q',
        '$stateParams',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'productUrlHelper',
        'EVENT_ID',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ProductDetail($scope, $rootScope, $state, $q, $timeout, $stateParams, $window, httpRequest, $location, urlHelper, eventId, constant, utils) {
        var vm = $scope;

        vm.requestParam = $state.params;
        vm.productPrice = $stateParams.productPrice;
        var _skuAttrValues = $stateParams.skuAttrValues;


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                isShowRightBtn: false,
                rightBtnType: "icon",
                rightBtnAttrs: {
                    icon: "icon-share",
                    fn: shareBtnFn
                },
                title: "商品",
                isShow: true
            }, $location);
        }
        vm.photoView = {
            power: 'modify',
            isVisible: false,
            rightImg: null,
            dialogBeforeHide: function () {
                return true;
            },
            dialogOpen: function (power, img, parentIdx, childIdx) {

                vm.photoView.rightImg = img;
                vm.photoView.power = power;
                vm.pIdx = parentIdx;
                vm.cIdx = childIdx;
                vm.photoView.isVisible = true;
            },
            dialogClose: function () {
                vm.photoView.isVisible = false;
            }
        };
        vm.needTip = false;

        function checkIsA214Product() {
            if (vm.requestParam.productId == 15529 || vm.requestParam.productId == 15751 || vm.requestParam.productId == 14495 || vm.requestParam.productId == 15536 || vm.requestParam.productId == 15526 || vm.requestParam.productId == 4358 || vm.requestParam.productId == 1868 || vm.requestParam.productId == 4723 || vm.requestParam.productId == 9452 || vm.requestParam.productId == 4719 || vm.requestParam.productId == 12476 || vm.requestParam.productId == 11639) {
                vm.needTip = true;
            }
        }

        //数量
        vm.count = 1;
        vm.minusCount = minusCount;
        vm.addCount = addCount;
        vm.countLimit = null;

        vm.promotionType = vm.requestParam.promotionType;
        vm.promotionIsAging = (vm.promotionType == "aging");
        vm.promotionIsSale = (vm.promotionType == "sale");

        vm.reload = reload;

        vm.isIos = jq.os.ios;
        // attrId : itemId
        vm.skuSelectObj = {};
        //itemId1,itemId2..
        vm.skuSelectItems = "";
        vm.supplier = "";
        vm.proSkuImg = null;

        vm.productImgs = {
            carouselIndex: 0,
            slides: []
        };
        vm.paymentRequestParam = {};
        vm.paymentInfo = {};


        vm.countFn = {
            isMin: true,
            isMax: false
        };

        //评论
        vm.assess = {
            isVisible: false,
            openDialog: function () {
                vm.assess.isVisible = true;
            },
            closeDialog: function () {
                vm.assess.isVisible = false;
            }
        };

        vm.shareInfo = {
            title: constant.DEFAULT_SHARE_INFO.title,
            description: constant.DEFAULT_SHARE_INFO.description,
            thumb: constant.DEFAULT_SHARE_INFO.thumb,
            shareUrl: constant.DEFAULT_SHARE_INFO.baseUrl + utils.getUrlWithParams("/product/detail", $state.params)
        };

        function setProSkuImg(proSkuImg) {
            vm.proSkuImg = proSkuImg;
            if (proSkuImg) {
                vm.flyObject.imgUrl = proSkuImg;
            }
        }

        function shareBtnFn() {
            if (vm.data && vm.data.productDTO) {
                vm.shareInfo.title = vm.data.productDTO.name;
                vm.shareInfo.thumb = vm.data.productDTO.proMainImgUrl + "@!300x300";
                if (vm.initPaymentInfoResult) {
                    vm.shareInfo.title = vm.shareInfo.title + "，月供低至" + vm.initPaymentInfoResult.everyAmount + "元";
                }
            }

            vm.shareObject.dialogOpen();
        }


        vm.contactUs = function () {
            utils.contactUs();
        };

        vm.shop = function () {
            var url = utils.getUrlWithParams('/shop/main', {
                'shopId': vm.shopId
            });

            utils.gotoUrl(url);
        };


        vm.buyCar = function () {
            utils.gotoUrl("/product/car");
        };

        function minusCount() {
            if (vm.count > 1) {
                vm.count -= 1;
                vm.countFn.isMin = false;
            }
            if (vm.count == 1) {
                vm.countFn.isMin = true;
            }
            if (vm.count < vm.countLimit) {
                vm.countFn.isMax = false;
            }
        }


        function addCount() {
            if (vm.count < vm.countLimit) {
                vm.count += 1;
                vm.countFn.isMax = false;
            }
            if (vm.count == vm.countLimit) {
                vm.countFn.isMax = true;
            }
            if (vm.count > 1) {
                vm.countFn.isMin = false;
            }
        }

        vm.addressListEmpty = false;

        //点击sku触发事件
        vm.selectSkuItem = function (selectItemId, skuId) {
            vm.skuSelectObj[skuId] = selectItemId;
            vm.skuSelectItems = getSkuSelectItemIds();

            var requestParam = {
                productId: vm.requestParam["productId"],
                promotionId: vm.requestParam["promotionId"],
                selectedSkuAttrItemIds: vm.skuSelectItems
            };

            httpRequest.getReq(urlHelper.getUrl('findProductSkuDTOForDetailByPromotion'), requestParam, {
                ignoreLogin: true
            }).then(function (d) {
                vm.data = d;
                //discount price
                if (d.productDTO && d.productDTO.proSkuPrice) {
                    d.productDTO.discountPrice = d.productDTO.proSkuPrice * d.promotionDTO.discount / 100;
                }
                if (vm.data.productDTO) {
                    vm.online = vm.data.productDTO.online;
                    vm.shopId = vm.data.productDTO.shopId;
                }

                vm.data = d;
                vm.paymentRequestParam.productSkuId = d.productDTO.proSkuId;

                loadPaymentInfo();

                //sku img
                var proSkuImg = null;
                if (d.proSkuList && d.proSkuList.length > 0) {
                    for (var i = 0; i < d.proSkuList.length; i++) {
                        var skuGroup = d.proSkuList[i];
                        for (var j = 0; j < skuGroup.shareSkuAttrItemList.length; j++) {
                            var skuItem = skuGroup.shareSkuAttrItemList[j];
                            if (skuItem.selected) {
                                proSkuImg = proSkuImg || skuItem.imgUrl;
                            }
                        }
                    }
                }
                checkCart();

                setProSkuImg(proSkuImg);
                searchShopIsEvent(d.productDTO.proSkuId);

            });


        };


        //提交购买--单独购买
        vm.goOrderConfirm = function (productId, productSkuId, promotionId, promotionType, initRate, period) {
            var url = utils.getUrlWithParams('/product/orderconfirm', {
                productId: productId,
                productSkuId: productSkuId,
                promotionId: promotionId,
                promotionType: promotionType,
                rate: typeof(initRate) == "undefined" ? -1 : initRate,
                period: typeof(period) == "undefined" ? -1 : period,
                count: vm.count
            });

            if (utils.checkLogin($rootScope, $location, null, url)) {
                utils.gotoUrl(url);
            }

        };

        vm.selectItem = null;
        vm.hasAddress = false;

        vm.chooseAddressFn = function (addressItem) {
            vm.selectItem = addressItem;

            checkCart();
        };

        vm.hasStock = false;
        vm.stock = null;

        function getStock() {
            if (vm.data) {
                httpRequest.getReq(urlHelper.getUrl('getStockInfo'), {
                    skuId: vm.data.productDTO.proSkuId,
                    addressId: vm.selectItem.addressId
                }).then(function (data) {
                    if (data && data.stock || data.stock == 0) {
                        vm.stock = data.stock;
                        vm.hasStock = true;
                    } else {
                        vm.stock = data.desc;
                        vm.hasStock = false;
                    }
                }, function (error) {
                    utils.error(error.msg);
                })
            }

        }

        function checkCart() {

            if (vm.addressDialog && vm.addressDialog.items && vm.addressDialog.items.length > 0) {
                vm.hasAddress = true;
                getStock();
            } else {
                vm.hasAddress = false;
            }

        }

        var winSize = {
            width: jq(window).width(),
            height: jq(window).height()
        };

        vm.flyObject = {
            imgUrl: null,
            start: {
                left: winSize.width - 80,
                top: winSize.height - 80,
                width: 50,
                height: 50
            },
            end: {
                left: winSize.width - 190,
                top: winSize.height - 40,
                width: 16,
                height: 16
            },
            vertexRtop: winSize.height - 200
        };

        //提交购买--购物车购买
        vm.goCart = function (productId, productSkuId, promotionId, promotionType, initRate, period, addressId) {
            if (checkBuyNow(addressId)) {
                var selectAddressId = null;
                if (vm.selectItem) {
                    selectAddressId = vm.selectItem.addressId ? vm.selectItem.addressId : null;
                }

                if (vm.online) {
                    httpRequest.getReq(urlHelper.getUrl('cartAdd'), null, {
                        type: 'POST',
                        data: {
                            productId: productId,
                            productSkuId: productSkuId,
                            quantity: vm.count,
                            deliveryAddressId: selectAddressId
                        }
                    }).then(function (d) {
                        utils.carProductNum();
                        vm.playFly();
                    }, function (err) {
                        utils.error(err.msg || "加入购物车出现错误");
                    });
                } else {
                    utils.alert('此商品已下架');
                }

            }
        };

        function checkBuyNow(addressId) {
            if (utils.isEmpty(addressId)) {
                utils.alert('请选择收货地址');
                return false;
            }
            return true;
        }

        vm.goBuy = function (productId, productSkuId, addressId) {
            var url = null;
            if (checkBuyNow(addressId)) {
                url = utils.getUrlWithParams('/product/buyNowConfirm', {
                    addressId: addressId,
                    productId: productId,
                    proSkuId: productSkuId
                });
                if (url) {
                    utils.gotoUrl(url);
                }
            }

        }

        function resetForAging() {
            if (vm.paymentInfo.initRate == 1) { //售卖
                vm.promotionType = "sale";
                vm.promotionIsAging = false;
                vm.promotionIsSale = true;
            } else {
                vm.promotionType = "aging";
                vm.promotionIsAging = true;
                vm.promotionIsSale = false;
            }
        }

        function reload() {
            loadProductDetail();
            loadProductDesc();
        }

        vm.online = false;

        function loadProductDetail() {
            var requestParam = vm.requestParam;

            httpRequest.getReq(urlHelper.getUrl('findProductSkuDTOForDetailByPromotion'), requestParam, {
                ignoreLogin: true
            }).then(function (d) {
                if (d) {
                    vm.data = d;
                    vm.shopId = vm.data.productDTO.shopId;
                    vm.supplier = d.shop.shopName;
                    vm.shopName = d.shop.shopName;
                    var proSkuImg = null;


                    if (d.promotionDTO.limitBuyCount) {
                        vm.countLimit = d.promotionDTO.limitBuyCount;
                        if (vm.countLimit == 1) {
                            vm.countFn.isMax = true;
                        } else {
                            vm.countLimit = 10;
                        }
                    }

                    if (vm.data.productDTO) {
                        vm.online = vm.data.productDTO.online;

                    }

                    //discount price
                    if (d.productDTO && d.productDTO.proSkuPrice) {
                        d.productDTO.discountPrice = d.productDTO.proSkuPrice * d.promotionDTO.discount / 100;
                    }

                    if (d.productDTO && d.productDTO.shopId) {
                        vm.shopId = d.productDTO.shopId;
                        getShopCoupon();
                    }

                    // imgs
                    if (d.productDTO && d.productDTO.proImgList && d.productDTO.proImgList.length > 0) {
                        var imgInfo;
                        for (var i = 0; i < d.productDTO.proImgList.length; i++) {
                            imgInfo = d.productDTO.proImgList[i];
                            vm.productImgs.slides.push({
                                id: imgInfo.id,
                                img: utils.htmlDecode(imgInfo.imgUrl)
                            });
                        }
                    }

                    vm.flyObject.imgUrl = d.productDTO.proImgList[0].imgUrl;

                    //sku
                    if (d.proSkuList && d.proSkuList.length > 0) {
                        for (var i = 0; i < d.proSkuList.length; i++) {
                            var skuGroup = d.proSkuList[i];
                            var skuId = skuGroup.shareSkuAttr.id;
                            for (var j = 0; j < skuGroup.shareSkuAttrItemList.length; j++) {
                                var skuItem = skuGroup.shareSkuAttrItemList[j];
                                if (skuItem.selected) {
                                    vm.skuSelectObj[skuId] = skuItem.id;
                                    proSkuImg = proSkuImg || skuItem.imgUrl;
                                }
                            }
                        }
                    }

                    setProSkuImg(proSkuImg);
                    searchShopIsEvent(d.productDTO.proSkuId);

                    preparePaymentInfo();
                    checkCart();

                    // title
                    $rootScope.navConfig.title = utils.htmlDecode(d.productDTO.name);
                }

            });
        }

        vm.couponDialog = {
            isVisible: false,
            openDialog: function () {
                vm.couponDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.couponDialog.isVisible = false;
            }
        };
        vm.activityDialog = {
            isVisible: false,
            openDialog: function () {
                vm.activityDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.activityDialog.isVisible = false;
            }
        };
        vm.couponsList = [];
        vm.hideCoupon = true;

        vm.activityList = [];
        vm.hideActivity = true;
        function getShopCoupon() {
            httpRequest.getReq(urlHelper.getUrl('couponListAndPromotion'), {
                shopId: vm.shopId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.coupons) {
                    vm.couponsList = d.coupons;
                    if (vm.couponsList.length > 0) {
                        vm.hideCoupon = false;
                    }
                }

                if (d && d.activity) {
                    vm.activityList = d.activity.activityDescList;
                    if (vm.activityList.length > 0) {
                        vm.hideActivity = false;
                    }
                }
            })
        }

        vm.receiveCoupon = function (item) {
            httpRequest.getReq(urlHelper.getUrl("shopCouponReceive"), {
                couponId: item.id,
                'couponType': item.type
            }).then(function (d) {
                utils.alert("优惠券领取成功！", vm.couponDialog.closeDialog);
            }, function (d) {
                utils.alert(d.msg || "服务繁忙，请稍后领取！", vm.couponDialog.closeDialog);
            })
        };

        vm.inActivity = false;
        vm.productPrice = 0;

        function searchShopIsEvent(proSkuId) {
            var params = {
                productId: vm.requestParam["productId"],
                skuId: proSkuId
            };
            httpRequest.getReq(urlHelper.getUrl('searchShopIsEvent'), params, {
                ignoreLogin: true
            }).then(function (d) {
                var nowSec = Date.parse(new Date());
                if (d && d.activityType) {
                    if (d.activityType == 'group_buy') {
                        vm.productPrice = d.price;
                        vm.beginTime = d.beginTime;
                        vm.endTime = d.endTime;
                        vm.isGroupBuy = true;
                        if (nowSec > d.beginTime && nowSec < d.endTime) {
                            vm.inActivity = true;
                        } else {
                            vm.inActivity = false;
                        }
                    } else {
                        vm.isGroupBuy = false;
                    }
                }
            })
        }


        function getSkuSelectItemIds() {
            var ret = "";
            var array = [];
            for (var skuId in vm.skuSelectObj) {
                array.push(vm.skuSelectObj[skuId]);
            }

            array = array.sort(function (a, b) {
                return a - b;
            });

            for (var i = 0; i < array.length; i++) {
                if (i == array.length - 1) {
                    ret += array[i];
                } else {
                    ret += array[i] + ",";
                }
            }
            return ret;
        }

        //分期还款信息
        function preparePaymentInfo() {
            if (vm.promotionType != 'aging') {
                return false;
            }

            var paymentRates = vm.data.promotionDTO.initialPaymentRates;
            var agingPeriods = vm.data.promotionDTO.agingPeriods;
            var paymentRateArray = paymentRates.split(",");
            var agingPeriodArray = agingPeriods.split(",");

            var defaultPaymentRate = paymentRateArray[0];
            var defaultAgingPeriod = agingPeriodArray[agingPeriodArray.length - 1];

            vm.paymentInfo.initRate = parseFloat(defaultPaymentRate);
            vm.paymentInfo.period = defaultAgingPeriod;

            resetForAging();

            vm.paymentRequestParam = {
                productSkuId: vm.data.productDTO.proSkuId,
                promotionId: vm.requestParam.promotionId,

                selectPaymentInfo: {
                    "initialPaymentType": vm.data.promotionDTO.initialPaymentType,
                    "initialPayment": vm.data.promotionDTO.initialPayment,
                    "repaymentWay": vm.data.promotionDTO.repaymentWay,
                    "interestType": vm.data.promotionDTO.interestType,
                    "interest": vm.data.promotionDTO.interest,
                    "initialPaymentRate": defaultPaymentRate,
                    "period": defaultAgingPeriod
                }

            };


            loadPaymentInfo(true);

        }


        function loadPaymentInfo(isInit) {
            if (vm.promotionIsAging) {
                var requestParam = vm.paymentRequestParam;
                httpRequest.getReq(urlHelper.getUrl('getPaymentInfoByQuery'), requestParam, {
                    ignoreLogin: true
                }).then(function (d) {
                    vm.paymentInfoResult = d;

                    if (isInit) {
                        vm.initPaymentInfoResult = d;
                    }
                });
            }

        }

        function loadProductDesc() {

            var descRequestParam = {
                productId: vm.requestParam.productId,
                terminalType: 'mobile'
            };

            httpRequest.getReq(urlHelper.getUrl('findProductDesc'), descRequestParam, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.detail) {
                    jq('#product_detail').html(utils.htmlDecode(d.detail, true));
                } else {
                    jq('#product_detail_wrapper').css("display", "none");
                }

                if (d.specParam) {
                    var spec = jq('#product_spec');
                    spec.html(utils.htmlDecode(d.specParam, true));
                    spec.find("table").css("width", "100%");
                } else {
                    jq('#product_spec_wrapper').css("display", "none");
                }
            });
        }


        function initProductSlideHeight() {
            var productSlides = jq("#productSlides").find("ul");
            var h = jq($window).width();
            productSlides.css("height", h + "px");
        }

        function countdownText() {

            vm.myTimes = 0;
            vm.s = 0;
            vm.m = 0;
            vm.h = 0;

            var nowSec;


            nowSec = Date.parse(new Date());

            if (nowSec < vm.beginTime) {
                vm.myTimes = parseInt((vm.beginTime - nowSec) / 1000);
                vm.myTimes = vm.myTimes - 1;

            } else if (nowSec > vm.beginTime && nowSec < vm.endTime) {
                vm.myTimes = parseInt((vm.endTime - nowSec) / 1000);
                vm.myTimes = vm.myTimes - 1;
            }

            vm.s = parseInt(vm.myTimes % 60);
            vm.m = parseInt((vm.myTimes - vm.s) / 60 % 60);
            vm.h = parseInt((vm.myTimes - vm.s - vm.m * 60) / (60 * 60) % 24);
            if (vm.s < 10 && vm.s > 0) {
                vm.s = 0 + "" + vm.s;
            }
            if (vm.m < 10) {
                vm.m = 0 + "" + vm.m;
            }
            if (vm.h < 10) {
                vm.h = 0 + "" + vm.h;
            }

        }

        setInterval(function () {
            vm.$apply(countdownText);
        }, 1000);

        vm.groupBuy = function () {
            utils.gotoUrl('/shopActivity/groupBuy')
        };


        vm.items = [];
        vm.canLoad = true;

        vm.assessReload = assessReload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;


        /**
         * Screen reload
         */
        var pageIndex = 1;

        function assessReload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();
            var params = {
                productId: vm.requestParam["productId"],
                pageNo: pageIndex,
                pageSize: 20
            };

            httpRequest.getReq(urlHelper.getUrl('getEvaluateList'), params, {ignoreLogin: true})
                .then(function (d) {
                    pageIndex++;
                    var items = d.items;
                    if (items && items.length === 0) {
                        vm.canLoad = false;
                    }
                    vm.items = vm.items.concat(items);
                    if (vm.items.length === 0) {
                        vm.isAbnormal = true;
                    }
                    dtd.resolve();
                }, function () {
                    dtd.reject();
                });
            return dtd.promise;
        }

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        vm.hasNotice = false;
        vm.productNotice = null;
        function initProductNotice() {
            httpRequest.getReq(urlHelper.getUrl('listSysNotices'), {
                'positionType': 'product_notice'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items && d.items.length > 0) {
                    vm.hasNotice = true;
                    vm.productNotice = d.items[0];
                }
            })
        }

        vm.gotoNoticeInfo = function () {
            if (vm.productNotice.linkUrl && vm.productNotice.memo && vm.productNotice.positionType) {
                var url = utils.getUrlWithParams(vm.productNotice.linkUrl, {
                    positionType: vm.productNotice.positionType
                });
                utils.gotoUrl(url)
            }
        };

        function init() {
            checkIsA214Product();
            vm.requestParam = $state.params;
            vm.productImgs.carouselIndex = 0;
            vm.productImgs.slides = [];

            initProductNotice();

            initProductSlideHeight();

            httpRequest.getReq(urlHelper.getUrl('getEvaluateCount'), {productId: vm.requestParam["productId"]}, {ignoreLogin: true}).then(function (d) {
                    vm.assess.amount = d;
                }, function (d) {
                }
            );
            utils.carProductNum();

            utils.dot(eventId["show_product_detail"], vm.requestParam);

            var unWatch = vm.$watch('requestParam', reload, true);

            vm.$on('$destroy', function () {
                unWatch();

            });
        }

        init();


    }

});
