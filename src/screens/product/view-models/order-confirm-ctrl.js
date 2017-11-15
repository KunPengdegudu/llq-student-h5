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

    module.controller('ProductOrderConfirmCtrl', ProductOrderConfirm);

    ////////
    ProductOrderConfirm.$inject = [
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
    function ProductOrderConfirm($scope, $rootScope, $stateParams, $location, $timeout, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope;

        vm.lock = false;
        function unlock() {
            vm.lock = false;
        }

        function setLock() {
            vm.lock = true;
        }

        var loadingTimer;

        var _productId = $stateParams.productId,
            _productSkuId = $stateParams.productSkuId,
            _promotionId = $stateParams.promotionId,
            _promotionType = $stateParams.promotionType,//aging, lease, sale, seckill
            _deliveryType = $stateParams.deliveryType,
            _addressId = $stateParams.addressId;

        vm.rate = $stateParams.rate;
        vm.period = $stateParams.period;

        vm.count = parseInt($stateParams.count);
        vm.countLimit = 10;
        vm.remark = null;

        var PromotionType = {
            AGING: 'aging',
            LEASE: 'lease',
            SALE: 'sale',
            SECKILL: 'seckill'
        };


        vm.isEmpty = utils.isEmpty;
        vm.submitOrder = submitOrder;

        var currentUrl = utils.getUrlWithParams("/product/orderconfirm", {
            promotionId: $stateParams.promotionId,
            promotionType: $stateParams.promotionType,
            productId: $stateParams.productId,
            productSkuId: $stateParams.productSkuId,
            rate: vm.rate,
            period: vm.period,
            redirect: $stateParams.redirect,
            count: vm.count,
            deliveryType: $stateParams.deliveryType,
            addressId: $stateParams.addressId
        });

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                currentUrl: currentUrl,
                leftBtnType: "back",
                title: "确认订单",
                isShow: true
            }, $location);
        }

        var deliveryTypeDesc = {
            'take_their': {
                name: '自提',
                text: function () {
                    return '自提：0元';
                },
                price: function () {
                    return 0;
                }
            },
            'visit': {
                name: '送货上门',
                text: function () {
                    return '送货上门：0元';
                },
                price: function () {
                    return 0;
                }
            },
            'express': {
                name: '快递',
                text: function () {
                    return '快递：' + vm.product.deliveryAmount + '元';
                },
                price: function () {
                    return vm.product.deliveryAmount;
                }
            }
        };

        vm.showFlag = {
            bySelf: false,
            byAddr: false,
            deposit: false,
            aging: false
        };

        vm.deliveryTypeDialog = {
            isVisible: false,
            items: [{
                key: 'take_their',
                text: function () {
                    return '自提：0元';
                }
            }, {
                key: 'visit',
                text: function () {
                    return '送货上门：0元';
                }
            }, {
                key: 'express',
                text: function () {
                    return '快递：' + vm.product.deliveryAmount + '元';
                }
            }],
            openDialog: function () {
                if (_promotionType === PromotionType.AGING || _promotionType === PromotionType.SALE) {
                    vm.deliveryTypeDialog.isVisible = true;
                } else {
                    utils.alert("亲，秒杀和特卖活动只能选择自提方式！");
                }
            },
            closeDialog: function () {
                vm.deliveryTypeDialog.isVisible = false;
            },
            checkDeliveryType: function (item) {
                if (vm.product.deliveryTypes) {
                    var dtArr = vm.product.deliveryTypes.split(",");
                    for (var i = 0; i < dtArr.length; i++) {
                        if (item.key == dtArr[i]) {
                            return true;
                        }
                    }
                    return false;
                }
                return true;
            },
            setValue: function (key) {
                setDeliveryType(key);
                vm.deliveryTypeDialog.isVisible = false;
            },
            getValue: function () {
                return vm.order.delivery_type;
            }

        };

        vm.deliveryDialog = {
            init: false,
            isVisible: false,
            items: null,
            openDialog: function () {
                if (!vm.deliveryDialog.init) {
                    httpRequest.getReq(urlHelper.getUrl('getUserArayacak'))
                        .then(function (d) {
                            vm.deliveryDialog.items = d.items;
                            vm.deliveryDialog.init = true;
                        });
                }
                vm.deliveryDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.deliveryDialog.isVisible = false;
            }
        };

        vm.addressDialog = {
            isVisible: false,
            items: null,
            selectItem: null,
            openDialog: function () {
                vm.addressDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.addressDialog.isVisible = false;
            },
            isAddressListEmpty: function () {
                if (vm.addressDialog.items && vm.addressDialog.items.length > 0) {
                    return false;
                }
                return true;
            },
            chooseAddress: function (index) {
                vm.addressDialog.selectItem = vm.addressDialog.items[index];
                vm.addressDialog.closeDialog();
            },
            initAddress: function () {
                vm.addressDialog.flushItems();
            },
            flushItems: function () {
                var requestParam = {};
                httpRequest.getReq(urlHelper.getUrl('showDeliveryList'), requestParam)
                    .then(function (d) {
                        vm.addressDialog.items = d.items;

                        if (d.items && d.items.length > 0) {
                            // 如果selectItem不为空，按照id从新赋值，如果为空，取默认值
                            if (vm.addressDialog.selectItem) {
                                var selectItemId = vm.addressDialog.selectItem.id;
                                vm.addressDialog.selectItem = null;
                                for (var i = 0; i < d.items.length; i++) {
                                    if (d.items[i].addressId == selectItemId) {
                                        vm.addressDialog.selectItem = d.items[i];
                                    }
                                }
                            } else if (_addressId) {
                                vm.addressDialog.selectItem = d.items[0];
                                for (var i = 0; i < d.items.length; i++) {
                                    if (d.items[i].addressId == _addressId) {
                                        vm.addressDialog.selectItem = d.items[i];
                                    }
                                }
                            } else {
                                vm.addressDialog.selectItem = d.items[0];
                                for (var i = 0; i < d.items.length; i++) {
                                    if (d.items[i].default) {
                                        vm.addressDialog.selectItem = d.items[i];
                                    }
                                }
                            }
                        } else {
                            vm.addressDialog.selectItem = null;
                        }
                    });
            }
        };

        vm.editAddressDialog = {
            isVisible: false,
            openDialog: function () {
                vm.editAddressDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.editAddressDialog.isVisible = false;
            }
        };

        vm.addAddressDialog = {
            isVisible: false,
            item: {},
            isNew: false,
            openDialog: function (isNew) {
                if (isNew) {
                    vm.addAddressDialog.item = {};
                    vm.addAddressDialog.isNew = true;
                } else {
                    vm.addAddressDialog.isNew = false;
                }
                vm.addAddressDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.addAddressDialog.isVisible = false;
            },
            getTitleText: function () {
                if (vm.addAddressDialog.isNew) {
                    return "新增收货地址";
                }
                return "修改收货地址";
            },
            check: function () {
                // check
                if (utils.isEmpty(vm.addAddressDialog.item.name)) {
                    utils.error("收货人姓名不能为空");
                    return false;
                }
                if (utils.isEmpty(vm.addAddressDialog.item.phone)) {
                    utils.error("联系电话不能为空");
                    return false;
                }
                if (!utils.checkMobile(vm.addAddressDialog.item.phone)) {
                    utils.error("联系电话格式不正确");
                    return false;
                }
                if (utils.isEmpty(vm.addAddressDialog.item.pca)) {
                    utils.error("省市区不能为空");
                    return false;
                }
                if (utils.isEmpty(vm.addAddressDialog.item.address)) {
                    utils.error("详细地址不能为空");
                    return false;
                }
                return true;
            },
            save: function () {
                var checked = vm.addAddressDialog.check();
                if (checked) {
                    var addressItem = vm.addAddressDialog.item;
                    var requestParam = {
                        address: addressItem.address,
                        cityCode: addressItem.cityCode,
                        name: addressItem.name,
                        phone: addressItem.phone,
                        provinceCode: addressItem.provinceCode
                    };
                    if (utils.isEmpty(vm.addAddressDialog.item.addressId)) {
                        httpRequest.getReq(urlHelper.getUrl('addDelivery'), null, {
                            type: 'POST',
                            data: requestParam
                        }).then(function (d) {
                            vm.addressDialog.flushItems();
                            vm.addAddressDialog.closeDialog();
                            vm.editAddressDialog.closeDialog();
                        }, function (d) {
                            utils.error(d.msg);
                        });
                    } else {
                        requestParam.addressId = vm.addAddressDialog.item.addressId;
                        httpRequest.getReq(urlHelper.getUrl('modifyDelivery'), null, {
                            type: 'POST',
                            data: requestParam
                        }).then(function (d) {
                            vm.addressDialog.flushItems();
                            vm.addAddressDialog.closeDialog();
                            vm.editAddressDialog.closeDialog();
                        }, function (d) {
                            utils.error(d.msg);
                        });
                    }
                }
            },
            modify: function (item) {
                vm.addAddressDialog.item = item;
                vm.addAddressDialog.item.pca = item.province + item.city;
                vm.addAddressDialog.openDialog();
            },
            del: function () {
                utils.confirm("亲，是否确定要删除此地址", function (buttonIndex) {
                    if (buttonIndex == 2) {
                        var requestParam = {
                            'address_id': vm.addAddressDialog.item.addressId
                        };
                        httpRequest.getReq(urlHelper.getUrl('delDelivery'), requestParam)
                            .then(function (d) {
                                vm.addressDialog.flushItems();
                                vm.addAddressDialog.closeDialog();
                            }, function (d) {
                                utils.error("删除地址失败");
                            });
                    }

                });
            },
            getPca: function () {
                return "";
            }
        };

        vm.pcaDialog = {
            isVisible: false,
            items: null,
            itemsType: 'province', // province,city,area
            keys: ['province', 'city'],
            attrs: {
                province: {
                    text: '省份',
                    nameField: "provinceName",
                    codeField: "provinceCode"
                },
                city: {
                    text: '城市',
                    nameField: "cityName",
                    codeField: "cityCode"
                }
            },

            values: [],
            valueText: [],
            getItemsTitle: function () {
                return vm.pcaDialog.attrs[vm.pcaDialog.itemsType].text;
            },
            getItemName: function (item) {
                return item[vm.pcaDialog.attrs[vm.pcaDialog.itemsType].nameField];
            },
            getItemCode: function (item) {
                return item[vm.pcaDialog.attrs[vm.pcaDialog.itemsType].codeField];
            },
            checkSelected: function (item) {
                var idx = vm.pcaDialog.getIndex(),
                    codeField = vm.pcaDialog.attrs[vm.pcaDialog.keys[idx]].codeField;
                return (vm.addAddressDialog.item[codeField] == item[codeField]);
            },
            getIndex: function () {
                var idx = 0;
                for (; idx < vm.pcaDialog.keys.length; idx++) {
                    if (vm.pcaDialog.keys[idx] == vm.pcaDialog.itemsType) {
                        break;
                    }
                }
                return idx;
            },
            setValue: function (item) {
                var idx = vm.pcaDialog.getIndex();
                vm.pcaDialog.values[idx] = vm.pcaDialog.getItemCode(item);
                vm.pcaDialog.valueText[idx] = vm.pcaDialog.getItemName(item);
                idx++;

                if (idx < vm.pcaDialog.keys.length) {
                    vm.pcaDialog.setItems(vm.pcaDialog.keys[idx]);
                } else {
                    vm.addAddressDialog.item.pca = "";
                    for (var i = 0; i < vm.pcaDialog.keys.length; i++) {
                        vm.addAddressDialog.item[vm.pcaDialog.attrs[vm.pcaDialog.keys[i]].codeField] = vm.pcaDialog.values[i];
                        vm.addAddressDialog.item.pca = vm.addAddressDialog.item.pca + vm.pcaDialog.valueText[i];
                    }
                    vm.pcaDialog.closeDialog();
                }
            },
            setItems: function (type) {
                vm.pcaDialog.itemsType = type;
                vm.pcaDialog.items = [];
                if (type == 'province') {
                    var requestParam = {};
                    httpRequest.getReq(urlHelper.getUrl('getAllProvinceList'), requestParam)
                        .then(function (d) {
                            vm.pcaDialog.items = d.items;
                        });
                } else if (type == 'city') {
                    var requestParam = {
                        provinceCode: vm.pcaDialog.values[0]
                    };
                    httpRequest.getReq(urlHelper.getUrl('getCityListByProvince'), requestParam)
                        .then(function (d) {
                            vm.pcaDialog.items = d.items;
                        });
                }
            },
            openDialog: function () {
                vm.pcaDialog.isVisible = true;
                vm.pcaDialog.values = [];
                vm.pcaDialog.valueText = [];
                vm.pcaDialog.setItems('province');
            },
            closeDialog: function () {
                vm.pcaDialog.isVisible = false;
            },
            goBack: function () {
                var idx = vm.pcaDialog.getIndex();
                idx--;
                if (idx < 0) {
                    vm.pcaDialog.closeDialog();
                } else {
                    vm.pcaDialog.setItems(vm.pcaDialog.keys[idx]);
                }
            }
        };

        vm.idNo = {
            'ora_id_no': null,
            'id_no': null
        };

        vm.order = {
            'source': 'mobile',
            'pay_amount': 0,
            'period': vm.period,
            'product_id': _productId,
            'promotion_id': _promotionId,
            'product_sku_id': _productSkuId,
            'type': _promotionType,
            'delivery_type': null,
            'address_id': null
        };

        vm.product = {
            skuPrice: 0,
            firstPrice: 0,
            lastPrice: 0,
            everyAmount: 0,
            realPrice: 0,
            deliveryLabel: null,
            productName: '',
            productSku: ''
        };

        vm.productDTO = {};

        vm.promotionDTO = {};

        vm.payment = {};

        vm.requestParam = {};
        vm.isAbnormal = false;


        vm.hasNoDelivery = false;


        vm.reload = reload;

        vm.submitCb = {};

        vm.rateObject = {

            rate: [],

            init: function () {
                var rateArr = new Array();
                var paymentRateArray = vm.promotionDTO.initialPaymentRates.split(",").sort(getNewrRateArr);
                for (var i = 0; i < paymentRateArray.length; i++) {
                    var rate = parseFloat(paymentRateArray[i]);
                    if (rate == 0) {
                        rateArr.push({
                            key: rate + "",
                            text: "零首付"
                        });
                    } else if (rate == 1) {
                        rateArr.push({
                            key: rate + "",
                            text: "全额付"
                        });
                    } else {
                        rateArr.push({
                            key: rate + "",
                            text: (rate * 100) + "%"
                        });
                    }
                }

                function getNewrRateArr(a, b) {
                    return b - a;
                }

                vm.rateObject.rate = rateArr;
            },

            select: function (pr) {
                vm.rate = pr.key;
                reloadByType();
            },

            isSelect: function (pr) {
                if (pr.key == vm.rate) {
                    return true;
                }
                return false;
            }

        };

        vm.periodsObject = {

            period: [],

            init: function () {
                var periodArr = new Array();
                var agingPeriodArray = vm.promotionDTO.agingPeriods.split(",");
                for (var i = 0; i < agingPeriodArray.length; i++) {
                    var period = agingPeriodArray[i];
                    periodArr.push({
                        key: period + "",
                        text: period + "个月"
                    });
                }

                vm.periodsObject.period = periodArr;
            },

            select: function (ap) {
                vm.period = ap.key;
                reloadByType();
            },

            isSelect: function (ap) {
                if (ap.key == vm.period) {
                    return true;
                }
                return false;
            }

        };

        vm.countFn = {
            isMin: true,
            isMax: false,

            setCountLimit: function (limitBuyCount) {
                if (limitBuyCount) {
                    vm.countLimit = limitBuyCount;
                } else {
                    vm.countLimit = 10;
                }
                vm.countFn.checkState();
            },

            checkState: function () {
                vm.countFn.isMin = (vm.count <= 1);
                vm.countFn.isMax = (vm.count >= vm.countLimit);
            },

            minusCount: function () {
                if (vm.count > 1) {
                    vm.count -= 1;
                }
                vm.countFn.checkState();
                reloadByType();
            },

            addCount: function () {
                if (vm.count < vm.countLimit) {
                    vm.count += 1;
                }
                vm.countFn.checkState();
                reloadByType();
            }
        };


        function reload() {
            var requestParam = {
                productId: _productId,
                productSkuId: _productSkuId,
                promotionId: _promotionId
            };

            httpRequest.getReq(urlHelper.getUrl('findProductWithSkuDTOWithPromotionInfoByPromotionId'), requestParam)
                .then(function (d) {

                    vm.productDTO = d.productDTO;
                    vm.promotionDTO = d.promotionDTO;

                    vm.product.skuPrice = d.productDTO.proSkuPrice;
                    vm.product.realPrice = d.promotionDTO.discount / 100 * d.productDTO.proSkuPrice;
                    //vm.product.realPrice = vm.product.realPrice.toFixed(2);
                    vm.product.deliveryAmount = d.promotionDTO.deliveryAmount;
                    if (!vm.product.deliveryAmount && vm.product.deliveryAmount !== 0) {
                        vm.product.deliveryAmount = 15;
                    }
                    vm.product.deliveryTypes = d.promotionDTO.deliveryTypes;

                    vm.product.productName = d.productDTO.name;
                    vm.product.productSku = '';
                    for (var i = 0; i < d.proSkuList.length; i++) {
                        vm.product.productSku = vm.product.productSku + d.proSkuList[i].shareSkuAttrItemList[0].value + ' ';
                    }

                    vm.rateObject.init();
                    vm.periodsObject.init();
                    vm.countFn.setCountLimit(d.promotionDTO.limitBuyCount);

                    // 默认选择第一项
                    if (vm.rateObject.rate && vm.rateObject.rate.length > 0) {
                        var firstItem = vm.rateObject.rate[0];
                        vm.rate = firstItem.key;
                    }

                    reloadByType();
                    setDefaultDeliveryType();

                });

        }

        function reloadByType() {
            if (_promotionType === PromotionType.AGING) {
                reloadForAging();
            } else if (_promotionType === PromotionType.SALE) {
                vm.product.firstPrice = vm.product.realPrice;
                vm.product.lastPrice = vm.product.firstPrice * vm.count;
            } else {
                vm.product.firstPrice = 50;
                vm.product.lastPrice = vm.product.firstPrice * vm.count;
            }
        }

        function reloadForAging() {
            vm.product.firstPrice = vm.rate * vm.product.realPrice;
            vm.product.lastPrice = vm.product.firstPrice * vm.count;
            var param = {
                productSkuId: _productSkuId,
                promotionId: vm.promotionDTO.promotionId,
                selectPaymentInfo: JSON.stringify({
                    period: vm.period,
                    initialPaymentType: vm.promotionDTO.initialPaymentType,
                    initialPaymentRate: vm.rate,
                    initialPayment: vm.promotionDTO.initialPayment,
                    repaymentWay: vm.promotionDTO.repaymentWay,
                    interestType: vm.promotionDTO.interestType,
                    interest: vm.promotionDTO.interest
                })
            };

            httpRequest.getReq(urlHelper.getUrl('getPaymentInfoByQuery'), param)
                .then(function (d) {
                    vm.payment = d;
                });
        }

        function checkSubmit() {
            if (vm.order.delivery_type == "take_their") {
                if (utils.isEmpty(vm.idNo.id_no)) {
                    utils.error("请填写身份证号码");
                    return false;
                }
                if (!utils.checkID(vm.idNo.id_no)) {
                    utils.error("身份证号码格式不正确");
                    return false;
                }
            } else {
                if (!vm.addressDialog.selectItem) {
                    utils.error("请选择收货地址");
                    return false;
                }
            }
            return true;
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

        vm.payDialog = {
            params: {},
            openDialog: function () {
                vm.payDialog.params.order_no = vm.submitCb.orderNo;
                vm.payInfo.open();
            },
            successFn: gotoOrderDetail
        };


        // 跳转到付款页面
        function gotoPay() {
            vm.payDialog.openDialog();
        }

        function checkCredit(d) {
            // 判断是否通过V2和是否信息完整
            var checkCF = d.checkCreditFetch;
            if (checkCF && (!checkCF.lightCreditActive || !checkCF.increaseCreditRequire || !checkCF.contractInforUpload || !checkCF.sesameCertificated)) {
                return false;
            }
            return true;
        }

        function applySuccess(rtn) {
            utils.customDialog('分期购物合同成功', '亲，您的分期购物合同签署成功，请点击生成订单进行下单！', '生成订单', function (buttonIndex) {
                submitOrder();
            });
        }

        function applyFailure(rtn) {
            utils.customDialog('分期购物合同取消', '亲，您未同意分期购物合同，如需分期请重新进行购买！', '关闭', function (buttonIndex) {
            });
        }

        function gotoContract(url) {
            var attr = {
                target: this,
                title: "分期购物合同",
                onSuccessFn: applySuccess,
                onFailureFn: applyFailure
            };

            if (jq.os.android && navigator.appupdate && navigator.appupdate.openUrl) {
                utils.customDialog(attr.title, "亲，首次分期需要您签署电子合同，此合同需要您打开浏览器进行签署。", "关闭,打开合同", function (buttonIndex) {
                    if (buttonIndex == 1) {
                        applyFailure();
                    } else if (buttonIndex == 2) {
                        utils.customDialog("提醒", "亲，在签署合同过程中是否遇到问题？", "关闭订单,签署成功并生成订单", function (buttonIndex) {
                            if (buttonIndex == 1) {
                                applyFailure();
                            } else if (buttonIndex == 2) {
                                submitOrder();
                            }
                        });
                        utils.gotoBrowser(url);
                    }
                });
            } else {
                utils.gotoUrl(url, attr);
            }
        }

        function submitCallback(d) {

            vm.submitCb = d;

            // 判断是否签署合同
            if (d.fddContractSignUrl) {

                var url = encodeURI(utils.htmlDecode(d.fddContractSignUrl));
                if (navigator.appupdate && navigator.appupdate.openUrlInner && navigator.appupdate.closeUrlInner) {

                    var currentUrl = utils.getUrlWithParams("/product/orderconfirm", {
                        promotionId: $stateParams.promotionId,
                        promotionType: $stateParams.promotionType,
                        productId: $stateParams.productId,
                        productSkuId: $stateParams.productSkuId,
                        rate: vm.rate,
                        period: vm.period,
                        redirect: $stateParams.redirect,
                        count: vm.count,
                        deliveryType: vm.order.delivery_type,
                        addressId: ((vm.order.delivery_type != "take_their") ? vm.addressDialog.selectItem.addressId : null)
                    });

                    navigator.appupdate.openUrlInner('分期购物合同',
                        url,
                        constant.APP_HOME_URL + currentUrl,
                        "亲，是否取消签署分期购物合同，如果合同未签署将无法申请分期购物？");
                } else {
                    gotoContract(url);
                }

                return;
            }


            var promotionType = d.type,
                status = d.status;
            switch (promotionType) {
                case PromotionType.AGING:

                    switch (status) {
                        case "wait_confirmed":   //等待确认，待审核
                            //根据订单状态判断分期流程
                            if (checkCredit(d)) {
                                utils.alert("订单已成功提交，请耐心等待工作人员审核！", gotoOrderDetail);
                            } else {
                                utils.customDialog("下单成功", "订单已经成功提交，请耐心等待工作人员审核，【系统检测到您还未完成V2线上认证，请尽快进行V2认证，完成V2认证的好处：1、加快完成面签流程 2、可获得首次免息白条借款】", '先逛逛,去认证', gotoConfirmOrder);
                            }
                            break;

                        case "wait_pay" :   //等待付款，不用审核直接支付or审核通过就直接去支付
                            gotoPay();
                            break;

                        default:
                            // 0首付，直接显示下单成功，进入订单详情
                            //根据订单状态判断分期流程
                            if (checkCredit(d)) {
                                utils.alert("恭喜你下单成功，工作人员正在处理，请耐心等待！", gotoOrderDetail);
                            } else {
                                utils.customDialog("下单成功", "订单已经成功提交，请耐心等待工作人员审核，【系统检测到您还未完成V2线上认证，请尽快进行V2认证，完成V2认证的好处：1、加快完成面签流程 2、可获得首次免息白条借款】", '先逛逛,去认证', gotoConfirmOrder);
                            }
                            break;
                    }

                    break;

                case PromotionType.SALE:
                case PromotionType.LEASE:
                case PromotionType.SECKILL:
                    gotoPay();
                    break;
            }


        }

        function doSubmitOrder(param) {
            httpRequest.getReq(urlHelper.getUrl("createOrderContractUp"), null, {
                type: 'POST',
                data: param
            }).then(function (d) {
                unlock();
                loaderComplete();
                submitCallback(d);
            }, function (d) {
                //utils.checkAuth(d, $location);
                unlock();
                loaderComplete();
                utils.alert(d.msg);
            });
        }
        function gotoConfirmOrder(btnIdx) {
            if (btnIdx == 2) {
                utils.gotoUrl(constant.AUTH_V2);
            } else {
                utils.gotoUrl("/profile/myorder/orderall");
            }
        }

        function gotoA915(btnIdx) {
            if (btnIdx == 2) {
                utils.gotoUrl("/activity/a915");
            }
        }

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

        function submitOrder() {

            if (vm.lock) {
                return;
            } else {
                setLock();
            }

            if (checkSubmit()) {

                showLoading("亲，正在生成订单，请不要离开...");

                var param = jq.extend({}, vm.order);

                // 重新赋值，地址、首付款
                if (vm.order.delivery_type != "take_their") {
                    param.address_id = vm.addressDialog.selectItem.addressId;
                }
                param.pay_amount = vm.product.firstPrice * vm.count;

                param.count = vm.count;
                param.period = vm.period;
                param.remark = vm.remark;

                if (vm.idNo.ora_id_no != vm.idNo.id_no) {

                    httpRequest.getReq(urlHelper.getUrl('updateUserInfo'), {
                        id_no: vm.idNo.id_no
                    }).then(function (d) {
                        doSubmitOrder(param);
                    }, function (d) {
                        unlock();
                        loaderComplete();
                        utils.error(d.msg);
                    });
                } else {
                    doSubmitOrder(param);
                }

            } else {
                unlock();
            }
        }

        function setDeliveryType(type) {
            vm.order.delivery_type = type;
            vm.product.deliveryLabel = deliveryTypeDesc[type];

            if (type === 'take_their') {
                vm.showFlag.bySelf = true;
                vm.showFlag.byAddr = false;

                // 获取身份证
                httpRequest.getReq(urlHelper.getUrl('getUserInfo'))
                    .then(function (d) {
                        if (utils.isEmpty(vm.idNo.id_no)) {
                            vm.idNo.ora_id_no = d.idNo;
                            vm.idNo.id_no = d.idNo;
                        }
                    });
            } else {
                vm.showFlag.bySelf = false;
                vm.showFlag.byAddr = true;
                vm.addressDialog.initAddress();
            }
        }

        function setDefaultDeliveryType() {
            var defaultDeliveryType = _deliveryType || 'take_their';

            if (vm.product.deliveryTypes) {
                var dtArr = vm.product.deliveryTypes.split(",");
                var match = false;
                for (var i = 0; i < dtArr.length; i++) {
                    if (dtArr[i] == defaultDeliveryType) {
                        match = true;
                        break;
                    }
                }
                if (!match) {
                    defaultDeliveryType = dtArr[0];
                }
            }

            setDeliveryType(defaultDeliveryType);
        }

        function initType() {
            if (_promotionType === PromotionType.AGING) {
                vm.showFlag.aging = true;
                vm.showFlag.deposit = false;
                vm.showFlag.sale = false;
            } else if (_promotionType === PromotionType.SALE) {
                vm.showFlag.aging = false;
                vm.showFlag.deposit = false;
                vm.showFlag.sale = true;
            } else {
                vm.showFlag.aging = false;
                vm.showFlag.deposit = true;
                vm.showFlag.sale = false;
            }
        }

        function init() {
            initType();
            vm.countFn.checkState();

            httpRequest.getReq(urlHelper.getUrl('queryUserInfor'))
                .then(function (d) {
                    if (d.creditStatus == "pass") {
                        vm.credit_v3 = true;
                    }

                    if (d.completeStatus == "un_completed") {
                        vm.credit_v1 = false;
                    } else {
                        vm.credit_v1 = true;

                        if (d.blankCompleteStatus == "completed") {
                            vm.credit_v2 = true;
                        }

                    }
                    reload();
                }, function (err) {
                    reload();
                });


        }

        function doFeedback() {
            var feedback = $stateParams.feedback;
            if (feedback === "success") {
                applySuccess();
            } else if (feedback === "failure" || feedback === "back") {
                applyFailure();
            }
        }

        init();
        doFeedback();
    }

});
