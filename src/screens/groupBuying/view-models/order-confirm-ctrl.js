/**
 * Created by fionaqin on 2017/9/8.
 */
define([
    'screens/groupBuying/module',
    'jq',
    'screens/groupBuying/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('OrderConfirmCtrl', OrderConfirm);

    OrderConfirm.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$q',
        '$timeout',
        '$loadingOverlay',
        '$window',
        'httpRequest',
        '$location',
        'groupBuyingUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function OrderConfirm($rootScope, $scope, $state, $stateParams, $q, $timeout, $loadingOverlay, $window, httpRequest, $location, urlHelper, constant, utils) {
        var vm = $scope;

        var _productId = $stateParams.productId,
            _proSkuId = $stateParams.proSkuId,
            _addressId = $stateParams.addressId,
            _ptProductSkuId = $stateParams.ptProductSkuId,
            _pinTuanId = $stateParams.pinTuanId;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                //forbidBack: true,
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "确认订单",
                isShow: true
            }, $location);
        }


        vm.selectItem = {};
        vm.hasAddress = false;
        vm.complete = false;
        vm.needRealNameAuth = false;   //是否需要实名认证
        vm.supportDelivery = false;    //是否支持配送
        vm.isOpenGroup = false;       //是否开团
        vm.addressId = _addressId;
        vm.shopId = null;

        //获取收货地址
        function showDeliveryList() {
            httpRequest.getReq(urlHelper.getUrl('showDeliveryList'), null)
                .then(function (d) {
                    if (d.items && d.items.length > 0) {
                        vm.selectItem = d.items[0];
                        vm.addressId = d.items[0].addressId;
                        vm.complete = d.items[0].complete;
                    }
                });
        }

        vm.chooseAddressFn = function (addressItem) {
            if (addressItem) {
                vm.selectItem = addressItem;
                vm.addressId = addressItem.addressId;
                vm.complete = addressItem.complete;
                checkCart();
                getOrderDetail();
            }
            //     vm.unsupportedCartIds = [];
        };


        //获取订单详情
        vm.getOrderDetail = getOrderDetail;
        function getOrderDetail() {
            httpRequest.getReq(urlHelper.getUrl('tradePinTuan'), null, {
                type: 'POST',
                data: {
                    "addressId": vm.addressId,
                    "productId": _productId,
                    "productSkuId": _proSkuId,
                    // "ptProductId": _ptProductId,
                    'ptProductSkuId': _ptProductSkuId
                }
            }).then(function (d) {
                vm.product = d;
                vm.needRealNameAuth = d.needRealNameAuth;
                vm.supportDelivery = d.supportDelivery;
                // vm.isOpenGroup = d.isOpenGroup;
                vm.shopId = d.shopId;

            }, function (d) {
                alert(d.msg);
            });
        }

        vm.checkCart = checkCart;
        function checkCart() {
            if (vm.addressDialog && vm.addressDialog.items && vm.addressDialog.items.length > 0) {
                vm.hasAddress = true;
            } else {
                vm.hasAddress = false;
            }
        }

        vm.userRedEnvelope = null;

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
                        // identityNo: vm.outsourcingDialog.identityNo,
                        deliveryType: 'express',
                        deliveryAddressId: vm.addressId,
                        sourceFuncType: 'pd',
                        source: 'mobile',
                        shopId: vm.shopId,
                        ptProductSkuId: _ptProductSkuId,
                        productBuyDetail: {
                            productId: _productId,
                            productSkuId: _proSkuId,
                            productCount: 1
                        },
                    }

                    if (_pinTuanId) {
                        param.isOpenGroup = false;
                        param.pinTuanId = _pinTuanId;
                    } else {
                        param.isOpenGroup = true;
                    }

                    if (vm.needRealNameAuth) {
                        param.identityNo = vm.outsourcingDialog.identityNo;
                    }

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
                //开团/参团接口（创建拼团订单）
                httpRequest.getReq(urlHelper.getUrl("createPintuan"), null, {
                    type: 'POST',
                    data: param
                }).then(function (d) {
                    unlock();
                    loaderComplete();
                    submitCallback(d);

                    vm.shareOrderId = d.id;
                    vm.payDialog.params.shareOrderId = vm.shareOrderId;

                    vm.payDialog.params.agingTotalAmount = d.productPrice + d.deliveryFee;
                    vm.payDialog.params.deliveryFee = d.deliveryFee;


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
            if (vm.submitCb) {
                orderNos = vm.submitCb.orderNo;
            }
            vm.payDialog.amount = d.actualPayAmount;
            vm.payDialog.params.orderNos = orderNos;

            gotoPay();
        }


        // 跳转到付款页面
        function gotoPay() {
            vm.payDialog.openDialog();
        }

        function gotoOrderDetail() {
            var url = utils.getUrlWithParams('/groupBuying/details', {
                'tuanId': vm.submitCb.pinTuanInfo.id,
                'status': 'change'
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


        //立即支付
        vm.checkRealAuth = function () {
            if (vm.product && vm.selectItem.addressId) {
                //判断是否需要实名认证
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
            } else {
                utils.alert(vm.buyNowErrorMsg);
            }
        };


        vm.unsupportedCartIds = [];

        vm.checkCanOrder = function () {
            return !!(vm.selectItem);
        };

        vm.checkProductSupport = function (product) {
            for (var i = 0; i < vm.unsupportedCartIds.length; i++) {
                if (vm.unsupportedCartIds[i] == product.cartId) {
                    return false;
                }
            }
            return true;
        };

        function init() {
            showDeliveryList();
            getOrderDetail();

        }

        init();
    }
});