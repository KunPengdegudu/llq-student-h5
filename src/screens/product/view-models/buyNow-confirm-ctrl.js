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

    module.controller('ProductBuyNowConfirmCtrl', ProductBuyNowConfirm);

    ////////
    ProductBuyNowConfirm.$inject = [
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
    function ProductBuyNowConfirm($scope, $rootScope, $stateParams, $location, $timeout, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope;

        var _productId = $stateParams.productId,
            _proSkuId = $stateParams.proSkuId,
            _addressId = $stateParams.addressId;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                //forbidBack: true,
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "确认订单",
                isShow: true
            }, $location);
        }

        vm.userRedEnvelope = null;
        vm.selectedAddressId = _addressId;

        vm.remark = null;

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
        vm.submitCb = {};
        vm.hasCreateOrder = false;

        vm.gotoProduct = function (product) {
            var url = utils.getUrlWithParams("/product/detail", {
                productId: product.productId,
                promotionType: 'aging'
            });
            utils.gotoUrl(url);
        };


        function submitOrder() {

            // 判断是否有不支持派送的商品
            if (vm.product) {
                if (!vm.supportDelivery) {
                    utils.alert('此地址不支持配送！');
                } else {
                    if (vm.lock) {
                        return;
                    } else {
                        setLock();
                    }

                    showLoading("亲，正在生成订单，请不要离开...");

                    vm.outsourcingDialog.closeDialog();

                    var param = {
                        identityNo: vm.outsourcingDialog.identityNo,
                        deliveryType: 'express',
                        deliveryAddressId: vm.selectItem.addressId ? vm.selectItem.addressId : _addressId,
                        sourceFuncType: 'pd',
                        source: 'mobile'
                    };

                    param.buyDetailList = [{
                        "shopId": vm.product.shopId,
                        "remark": vm.remark,
                        "userCouponIds": vm.selectedShop.id ? [vm.selectedShop.id] : [],
                        "productBuyDetails": [{
                            "productId": _productId,
                            "productSkuId": _proSkuId,
                            "productCount": 1
                        }]
                    }];
                    param.redEnvelopeId = vm.selectedRed.id;
                    doSubmitOrder(param);
                }
            } else {
                utils.alert(vm.errMsg);
            }
        }


        vm.throwError = function () {
            utils.alert('您当前选择的地址信息不完整，请修改地址或新增地址');
        };
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
                }, function (err) {
                    unlock();
                    loaderComplete();
                    vm.buyNowErrorMsg = err.msg || '服务器忙，请稍后再试!';
                    utils.alert(vm.buyNowErrorMsg);
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

        vm.checkRealAuth = function () {
            // 判断是否有不支持派送的商品
            if (vm.product && vm.selectItem.addressId) {
                if (vm.product.needRealNameAuth) {
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
            } else {
                utils.alert(vm.buyNowErrorMsg);
            }
        };


        vm.selectItem = null;

        vm.unsupportedCartIds = [];

        vm.chooseAddressFn = function (addressItem) {
            vm.selectItem = addressItem;
            vm.unsupportedCartIds = [];

            checkCart();
        };

        vm.checkCanOrder = function () {
            return !!(vm.selectItem);
        };

        vm.selectedRed = {};
        vm.selectedShop = {};

        function selectCoupons(d) {
            if (d.userRedEnvelopeId) {
                d.platformUserCoupons.forEach(function (item, index) {
                    if (item.id == d.userRedEnvelopeId) {
                        vm.selectedRed = item;
                    }
                })
            } else {
                vm.userRedEnvelope = null;
            }

            // 设置参数中使用的店铺优惠券

            if (d.userShopCouponId) {
                d.shopUserCoupons.forEach(function (item, index) {
                    if (item.id == d.userShopCouponId) {
                        vm.selectedShop = item;
                    }
                })
            }
            var useCoupon = {};
            for (var i = 0; i < d.shopUserCoupons.length; i++) {
                var group = d.shopUserCoupons[i];
                if (group.couponId) {
                    useCoupon['shop_' + group.shopId] = group.couponId;
                }
            }
            getParamsForPay();
        }

        function getParamsForPay() {
            if (!vm.selectedRed.amount) {
                vm.selectedRed.amount = 0;
            }
            if (!vm.selectedShop.amount) {
                vm.selectedShop.amount = 0;
            }
            vm.payDialog.amount = vm.product.totalProductAmount - vm.selectedRed.amount - vm.selectedShop.amount;
            vm.payDialog.params.agingTotalAmount = vm.product.totalOrderAmount;
            vm.payDialog.params.deliveryFee = vm.product.deliveryFee;
        }

        vm.getUserCoupon = getUserCoupon;
        function getUserCoupon(type, product) {
            if (type == 'red') {
                if (product && product.platformUserCoupons) {
                    for (var i = 0; i <= product.platformUserCoupons.length; i++) {
                        if (product.platformUserCoupons[i].id == product.userRedEnvelopeId) {
                            vm.selectedRed = product.platformUserCoupons[i];
                        }
                    }
                }
            } else {
                if (product && product.shopUserCoupons) {
                    for (var i = 0; i <= product.shopUserCoupons.length; i++) {
                        if (product.shopUserCoupons[i].id == product.userShopCouponId) {
                            vm.selectedShop = product.shopUserCoupons[i];
                        }
                    }
                }
            }
        }

        vm.useShop = null;

        vm.couponDialog = {
            isVisible: false,
            selectId: null,
            items: [],
            type: null,
            shopId: null,
            openDialog: function (type, selected) {

                vm.couponDialog.isVisible = true;

                var noneItem = {
                    id: null,
                    amount: 0,
                    couponType: "red_envelope"
                };
                vm.couponDialog.items = [];
                if (type == 'red') {
                    noneItem.name = "不使用";
                    noneItem.couponType = "red_envelope";
                    vm.couponDialog.items = [noneItem].concat(vm.product.platformUserCoupons);
                    vm.couponDialog.selectId = getUserCoupon(type, selected);
                    vm.couponDialog.items.forEach(function (value, index) {
                        value.isSelected = false;
                    });
                    vm.selectedRed.isSelected = true;
                    vm.couponDialog.checkSelected(vm.selectedRed);

                } else {
                    noneItem.name = "不使用";
                    noneItem.couponType = "shop_coupon";
                    noneItem.shopId = selected.shopId;
                    vm.couponDialog.items = [noneItem].concat(vm.product.shopUserCoupons);
                    vm.couponDialog.selectId = getUserCoupon(type, selected);
                    vm.couponDialog.items.forEach(function (value, index) {
                        value.isSelected = false;
                    });
                    vm.selectedShop.isSelected = true;
                    vm.couponDialog.checkSelected(vm.selectedShop);
                }


                vm.couponDialog.type = type;
            },
            closeDialog: function () {
                vm.couponDialog.isVisible = false;
            },
            checkSelected: function (item) {
                vm.couponDialog.items.forEach(function (value, index) {
                    value.isSelected = false;
                    if (value.id == item.id) {
                        value.isSelected = true;
                    }
                })
            },
            useCoupon: function (item) {
                if (item.couponType == 'red_envelope') {
                    vm.selectedRed = item;
                } else {
                    vm.selectedShop = item;
                }
                getParamsForPay();
                vm.couponDialog.checkSelected(item);
                vm.couponDialog.closeDialog();
            }
        };

        function checkCart() {
            vm.product = null;
            var params = {
                "addressId": vm.selectItem.addressId ? vm.selectItem.addressId : _addressId,
                "productSkuId": _proSkuId,
                "productId": _productId,
                "quantity": 1
            };

            httpRequest.getReq(urlHelper.getUrl('buyNowSettle'), null, {
                type: 'POST',
                data: params
            }).then(function (d) {
                vm.product = d;

                vm.supportDelivery = d.supportDelivery; //判断地址师傅支持配送

                // 选择优惠券
                selectCoupons(d);

            }, function (err) {
                vm.errMsg = err.msg || "服务器忙，请稍后再试";
                utils.alert(vm.errMsg);
            })

        }

        vm.checkProductSupport = function (product) {
            for (var i = 0; i < vm.unsupportedCartIds.length; i++) {
                if (vm.unsupportedCartIds[i] == product.cartId) {
                    return false;
                }
            }
            return true;
        };

        function init() {

        }

        init();
    }

});
