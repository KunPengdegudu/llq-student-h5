/**
 * seckill main controller
 * @create 2015/11/15
 * @author D.xw
 */
define([
        'screens/product/module',
        'jq',
        'screens/product/utils/url-helper'
    ], function (module, jq) {

        'use strict';

        module.controller('ProductCarConfirmCtrl', ProductCarConfirm);

        ////////
        ProductCarConfirm.$inject = [
            '$scope',
            '$rootScope',
            '$stateParams',
            '$location',
            '$timeout',
            '$loadingOverlay',
            '$q',
            'httpRequest',
            'productUrlHelper',
            'CONSTANT',
            'CONSTANT_UTILS'
        ];
        function ProductCarConfirm($scope, $rootScope, $stateParams, $location, $timeout, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
            var vm = $scope;

            if ($rootScope && $rootScope.navConfig) {
                $rootScope.resetNavConfig({
                    forbidBack: true,
                    isShowLeftBtn: true,
                    leftBtnType: "back",
                    title: "确认订单",
                    isShow: true
                }, $location);
            }


            vm.shopItems = utils.string2Json($stateParams.shopItemsStr);
            if (vm.selectedAddressId = vm.shopItems[0].deliveryAddressIds) {
                vm.selectedAddressId = vm.shopItems[0].deliveryAddressIds[0];
            }
            vm.userRedEnvelopeId = null;
            vm.userRedEnvelope = null;
            vm.needRealNameAuth = false;

            // 提交按钮
            vm.lock = false;
            function unlock() {
                vm.lock = false;
            }

            function setLock() {
                vm.lock = true;
            }

            var loadingTimer;

            function loaderComplete() {
                $loadingOverlay.hide();

                if (loadingTimer) {
                    $timeout.cancel(loadingTimer);
                    loadingTimer = null;
                }
            }

            function showLoading(msg) {
                var template = "<div class='ui-loading'><img class='ui-loading-img' src='../../assets/imgs/base/loading.gif' /><div class='ui-loading-text'>" + msg + "</div></div></div>";
                $loadingOverlay.show(template);
                loadingTimer = $timeout(function () {
                    $loadingOverlay.hide();
                }, 20000);
            }

            vm.submitOrder = submitOrder;
            vm.checkRealAuth = checkRealAuth;
            vm.submitCb = {};
            vm.hasCreateOrder = false;

            vm.gotoProduct = function (product) {
                var url = utils.getUrlWithParams("/product/detail", {
                    productId: product.productId,
                    promotionType: 'aging'
                });
                utils.gotoUrl(url);
            };

            function getCartIds() {
                var cartIds = [];
                if (vm.shopItems) {
                    for (var i = 0; i < vm.shopItems.length; i++) {
                        var item = vm.shopItems[i];
                        cartIds = cartIds.concat(item.cartIds);
                    }
                }
                return cartIds;
            }

            vm.outsourcingDialog = {
                identityNo: null,
                isVisible: false,
                openDialog: function () {
                    vm.outsourcingDialog.isVisible = true;
                    vm.outsourcingDialog.identityNo = null;
                },
                closeDialog: function () {
                    vm.outsourcingDialog.isVisible = false;
                },
                check: function () {
                    if (utils.isEmpty(vm.outsourcingDialog.identityNo)) {
                        utils.error("身份证号码不能为空");
                        return false;
                    }
                    if (!utils.checkID(vm.outsourcingDialog.identityNo)) {
                        utils.error("身份证格式不正确");
                        return false;
                    }
                    return true;
                },
                submit: function () {
                    if (vm.outsourcingDialog.check()) {
                        submitOrder();
                    }
                }
            };

            function checkRealAuth() {

                // 判断是否有不支持派送的商品
                if (vm.cartData && vm.cartData.addressId) {
                    if (vm.unsupportedCartIds && vm.unsupportedCartIds.length > 0) {
                        showUnsupportDialog();
                    } else {
                        if (vm.needRealNameAuth) {
                            httpRequest.getReq(urlHelper.getUrl('realNameAuthValidate'), null, {
                                type: 'POST',
                                data: {
                                    name: vm.selectItem.name
                                },
                                isForm: true
                            }).then(function (d) {
                                if (!d) {
                                    vm.outsourcingDialog.openDialog();
                                } else {
                                    submitOrder();
                                }
                            }, function (err) {
                                utils.error(err.msg || "服务器忙，用户信息查询失败，请稍后再试");
                            })
                        } else {
                            submitOrder();
                        }
                    }
                } else {
                    utils.alert(vm.cartSettleErrorMsg);
                }
            };

            function submitOrder() {

                if (vm.lock) {
                    return;
                } else {
                    setLock();
                }
                showLoading("亲，正在生成订单，请不要离开...");

                vm.outsourcingDialog.closeDialog();
                var param = {
                    deliveryType: 'express',
                    deliveryAddressId: vm.selectItem.addressId,
                    sourceFuncType: 'cart',
                    source: 'mobile',
                    identityNo: vm.outsourcingDialog.identityNo
                };

                var buyDetailList = [];
                for (var i = 0; i < vm.cartGroups.length; i++) {
                    var group = vm.cartGroups[i];

                    var groupDetail = {
                        shopId: group.shop.id,
                        remark: group.remark,
                        userCouponIds: []
                    };

                    if (group.userShopCouponId) {
                        groupDetail.userCouponIds = [group.userShopCouponId];
                    }

                    var productBuyDetails = [];
                    for (var j = 0; j < group.carts.length; j++) {
                        var cart = group.carts[j];
                        productBuyDetails.push({
                            productId: cart.productId,
                            productSkuId: cart.productSkuId,
                            productCount: cart.quantity,
                            outWarehouseId: cart.outWarehouseId
                        });
                    }
                    groupDetail.productBuyDetails = productBuyDetails;
                    buyDetailList.push(groupDetail);
                }

                param.buyDetailList = buyDetailList;

                param.cartIds = getCartIds();

                if (vm.cartData.userRedEnvelopeId) {
                    param.redEnvelopeId = vm.cartData.userRedEnvelopeId;
                }

                doSubmitOrder(param);

            }


            vm.throwError = function () {
                utils.alert('您当前选择的地址信息不完整，请修改地址或新增地址');
            }
            vm.payDialog = {
                amount: null,
                params: {
                    orderNos: null,
                    agingTotalAmount: null,
                    deliveryFee: null,
                    agingBackUrl: null,
                    shareOrderId: null
                },
                openDialog: function () {
                    vm.payInfo.open();
                },
                successFn: gotoOrderDetail
            };

            function doSubmitOrder(param) {

                if (vm.hasCreateOrder) {
                    unlock();
                    loaderComplete();
                    submitCallback(vm.submitCb);
                } else {
                    httpRequest.getReq(urlHelper.getUrl("createMulitOrder"), null, {
                        type: 'POST',
                        data: param
                    }).then(function (d) {
                        unlock();
                        loaderComplete();
                        submitCallback(d);
                        vm.shareOrderId = d.multiOrder[0].mainOrder.id;
                        vm.payDialog.params.shareOrderId = vm.shareOrderId;
                    }, function (d) {
                        unlock();
                        loaderComplete();
                        utils.alert((d && d.msg) ? d.msg : '订单出现错误');
                    });
                }

            }

            function submitCallback(d) {
                vm.submitCb = d;
                vm.hasCreateOrder = true;

                var orderNos = "";
                if (vm.submitCb && vm.submitCb.multiOrder) {
                    var multiOrder = vm.submitCb.multiOrder;
                    for (var i = 0; i < multiOrder.length; i++) {
                        orderNos = orderNos + ',' + multiOrder[i].mainOrder.orderNo;
                    }
                }

                vm.payDialog.params.orderNos = orderNos.substring(1);

                gotoPay();
            }


            // 跳转到付款页面
            function gotoPay() {
                vm.payDialog.openDialog();
            }

            function gotoOrderDetail() {
                var url = utils.getUrlWithParams('/product/orderdetail', {
                    'order_id': vm.submitCb.id,
                    'goBack': '/profile/myorder/orderall'
                });

                if (utils.checkLogin($rootScope, $location, null, url)) {
                    utils.gotoUrl(url);
                }
            }


            vm.selectItem = null;

            vm.cartGroups = [];
            vm.unsupportedCartIds = [];

            vm.chooseAddressFn = function (addressItem) {
                vm.selectItem = addressItem;
                vm.cartData = {};
                vm.cartGroups = [];
                vm.unsupportedCartIds = [];

                checkCart();
            };

            vm.checkCanOrder = function () {
                return !!(vm.selectItem);
            };

            function selectCoupons(d) {
                vm.userRedEnvelopeId = d.userRedEnvelopeId;
                if (vm.userRedEnvelopeId) {
                    for (var i = 0; i < d.userRedEnvelopes.length; i++) {
                        if (d.userRedEnvelopes[i].id == d.userRedEnvelopeId) {
                            vm.userRedEnvelope = d.userRedEnvelopes[i];
                            break;
                        }
                    }
                } else {
                    vm.userRedEnvelope = null;
                }

                // 设置参数中使用的店铺优惠券
                var useCoupon = {};
                for (var i = 0; i < d.cartGroups.length; i++) {
                    var group = d.cartGroups[i];
                    if (group.userShopCouponId) {
                        useCoupon['shop_' + group.shop.id] = group.userShopCouponId;
                    }
                }

                if (vm.shopItems) {
                    for (var i = 0; i < vm.shopItems.length; i++) {
                        var item = vm.shopItems[i];
                        if (useCoupon['shop_' + item.shopId]) {
                            item.userShopCouponId = useCoupon['shop_' + item.shopId];
                        }
                    }
                }
            }

            vm.getUserCoupon = getUserCoupon;
            function getUserCoupon(group) {
                if (group && group.userShopCouponId) {
                    var coupon = {};
                    for (var i = 0; i <= group.userCoupons.length; i++) {
                        if (group.userCoupons[i].id == group.userShopCouponId) {
                            return group.userCoupons[i];
                        }
                    }
                    return coupon;
                }
                return {};
            }

            vm.couponDialog = {
                isVisible: false,
                selectId: null,
                items: null,
                type: null,
                shopId: null,
                openDialog: function (items, selectId, type, shopId) {
                    vm.couponDialog.isVisible = true;

                    vm.couponDialog.items = items;
                    vm.couponDialog.selectId = selectId;
                    vm.couponDialog.type = type;
                    vm.couponDialog.shopId = shopId;
                },
                closeDialog: function () {
                    vm.couponDialog.isVisible = false;
                },
                checkSelected: function (item) {
                    if (item.id == vm.couponDialog.selectId) {
                        return true;
                    }
                    return false;
                },
                useCoupon: function (item) {
                    vm.couponDialog.isVisible = false;
                    if (item.id != vm.couponDialog.selectId) {
                        if (vm.couponDialog.type === 'all') {
                            vm.userRedEnvelopeId = item.id;
                        } else {
                            if (vm.shopItems) {
                                for (var i = 0; i < vm.shopItems.length; i++) {
                                    if (vm.shopItems[i].shopId == vm.couponDialog.shopId) {
                                        vm.shopItems[i].userShopCouponId = item.id;
                                        break;
                                    }
                                }
                            }
                        }
                        checkCart();
                    }
                }
            };

            function checkCart() {
                vm.cartData = {};
                var shopItems = [{}];
                for (var i = 0; i < vm.shopItems.length; i++) {
                    shopItems[i] = {
                        cartIds: vm.shopItems[i].cartIds,
                        shopId: vm.shopItems[i].shopId
                    };
                }
                httpRequest.getReq(urlHelper.getUrl('cartSettle'), null, {
                    type: 'POST',
                    data: {
                        shopItems: shopItems,
                        addressId: (vm.selectItem) ? vm.selectItem.addressId : null,
                        userRedEnvelopeId: vm.userRedEnvelopeId
                    }
                }).then(function (d) {
                    if (d && d.cartGroups && d.cartGroups.length > 0) {

                        vm.cartData = d;
                        vm.cartGroups = d.cartGroups;
                        vm.unsupportedCartIds = d.unsupportedCartIds || [];

                        vm.payDialog.amount = vm.cartData.totalAmount;
                        vm.payDialog.params.agingTotalAmount = vm.cartData.agingTotalAmount;
                        vm.payDialog.params.deliveryFee = vm.cartData.deliveryFee;

                        var currentUrl = utils.getUrlWithParams("/product/carconfirm", {
                            shopItemsStr: JSON.stringify(vm.shopItems)
                        });
                        vm.payDialog.params.agingBackUrl = currentUrl;

                        // 选择优惠券
                        selectCoupons(d);

                    }
                    vm.needRealNameAuth = d.needRealNameAuth;
                }, function (err) {
                    vm.cartSettleErrorMsg = err.msg || '服务器忙，请稍后再试!';
                    utils.alert(vm.cartSettleErrorMsg);
                });

            }

            function getUnsupportedProductTitle() {
                var text = "";
                var cartIdMap = {};
                for (var i = 0; i < vm.unsupportedCartIds.length; i++) {
                    cartIdMap[vm.unsupportedCartIds[i]] = true;
                }
                for (var i = 0; i < vm.cartGroups.length; i++) {
                    var group = vm.cartGroups[i];
                    for (var j = 0; j < group.carts.length; j++) {
                        var cart = group.carts[j];
                        if (cartIdMap[cart.cartId]) {
                            text += ',[' + cart.productTitle + ']';
                        }
                    }
                }
                return text.substring(1);
            }

            function fixSupportProducts() {
                var ids = "";
                var idsArr = [];
                var cartIdMap = {};
                for (var i = 0; i < vm.unsupportedCartIds.length; i++) {
                    cartIdMap[vm.unsupportedCartIds[i]] = true;
                }

                var newShopItems = [];
                for (var i = 0; i < vm.shopItems.length; i++) {
                    var shop = vm.shopItems[i];
                    var cartIds = [];
                    for (var j = 0; j < shop.cartIds.length; j++) {
                        if (!cartIdMap[shop.cartIds[j]]) {
                            cartIds.push(shop.cartIds[j]);
                        }
                    }
                    if (cartIds.length > 0) {
                        newShopItems.push({
                            shopId: shop.shopId,
                            cartIds: cartIds
                        });
                    }
                }

                vm.shopItems = newShopItems;

            }

            function showUnsupportDialog() {
                var text = getUnsupportedProductTitle();
                utils.customDialog("无法送达",
                    "亲，您设置的送货地址不支持配送如下商品，" + text,
                    "移除不支持商品,返回购物车,关闭",
                    function (idx) {
                        if (idx == 1) {
                            fixSupportProducts();
                            if (vm.shopItems.length > 0) {
                                checkCart();
                            } else {
                                $rootScope.gotoBack();
                            }
                        } else if (idx == 2) {
                            $rootScope.gotoBack();
                        }
                    });
            }

            vm.checkProductSupport = function (product) {
                for (var i = 0; i < vm.unsupportedCartIds.length; i++) {
                    if (vm.unsupportedCartIds[i] == product.cartId) {
                        return false;
                    }
                }
                return true;
            };

            vm.removeProduct = function (product, $event) {

                $event.stopPropagation();

                var removeCartId = product.cartId;

                var newShopItems = [];

                for (var i = 0; i < vm.shopItems.length; i++) {
                    var shop = vm.shopItems[i];
                    var cartIds = [];
                    for (var j = 0; j < shop.cartIds.length; j++) {
                        if (shop.cartIds[j] != removeCartId) {
                            cartIds.push(shop.cartIds[j]);
                        }
                    }
                    if (cartIds.length > 0) {
                        if (cartIds.length == shop.cartIds.length) {
                            newShopItems.push(shop);
                        } else {
                            newShopItems.push({
                                shopId: shop.shopId,
                                cartIds: cartIds
                            });
                        }
                    }
                }

                vm.shopItems = newShopItems;

                if (vm.shopItems.length > 0) {
                    checkCart();
                } else {
                    $rootScope.gotoBack();
                }
            };


            function init() {

            }

            init();
        }

    }
);
