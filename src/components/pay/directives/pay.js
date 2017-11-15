define(['angular',
    'jq',
    'jsencrypt',
    'text!components/pay/views/pay-tpl.html'
], function (angular, jq, jsencrypt, payTpl) {

    'use strict';

    angular
        .module('components.pay', [])
        .directive('pay', payProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/pay/views/pay-tpl.html', payTpl);
        }]);

    payProvider.$inject = [
        '$location',
        '$window',
        '$timeout',
        'httpRequest',
        '$loadingOverlay',
        'CONSTANT',
        'CONSTANT_UTILS',
        '$interval',
        'settingCache'
    ];

    var PAY_URL = {
        order: {
            alipay: "/m/s/alipay/pay/pay_orders.json",
            weixin: "/m/s/wechat/pay/pay_orders.json",
            card: "https://m.007fenqi.com/m/s/pinganquick/gateway/pay/pay_orders.do",
            jd: "https://m.007fenqi.com/m/s/jd/gateway/pay/pay_orders.do",
            calAging: "/w/order/aging/cal_aging_order.json"
        },
        repay: {
            alipay: "/m/s/alipay/pay/aging/repay.json",
            weixin: "/m/s/wechat/pay/aging/repay.json",
            card: "https://m.007fenqi.com/m/s/pinganquick/gateway/pay/aging/repay.do",
            jd: "https://m.007fenqi.com/m/s/jd/gateway/pay/aging/repay.do"
        },
        cart: {
            alipay: "/m/s/alipay/pay/pay_orders.json",
            weixin: "/m/s/wechat/pay/pay_orders.json",
            card: "https://m.007fenqi.com/m/s/pinganquick/gateway/pay/pay_orders.do",
            jd: "https://m.007fenqi.com/m/s/jd/gateway/pay/pay_orders.do",
            calAging: "/w/order/aging/cal_aging_order.json"
        }
    };

    var ALIPAY_PART_REPAY = '/m/s/alipay/pay/aging/aging_part_repay.json';
    var WEIXIN_PART_REPAY = '/m/s/wechat/pay/aging/aging_part_repay.json';
    var CARD_PART_REPAY = 'https://m.007fenqi.com/m/s/pinganquick/gateway/pay/aging/aging_part_repay.do';
    var JD_PART_REPAY = 'https://m.007fenqi.com/m/s/jd/gateway/pay/aging/aging_part_repay.do';

    var ALIPAY_PART_PAY = '/m/s/alipay/pay/aging/part_pay.json';
    var WEIXIN_PART_PAY = '/m/s/wechat/pay/aging/part_pay.json';
    var CARD_PART_PAY = 'https://m.007fenqi.com/m/s/pinganquick/gateway/pay/aging/part_pay.do';
    var JD_PART_PAY = 'https://m.007fenqi.com/m/s/jd/gateway/pay/aging/part_pay.do';

    var QUERY_PART_PAY_RULE = '/m/s/pay/query_part_pay_rule.json';
    var CREATE_AGING_ORDER = '/w/order/aging/create_aging_order_p.json';


    var GET_ACTIVITY_FOR_PAY = '/mc/get_activity_and_coupons_for_pay.json';
    var GET_ACTIVITY_FOR_REPAY = '/mc/get_service_fee_coupons.json';

    var CHECK_USER_AGING_OR_LOAN = '/m/s/user/checkUserAgingOrLoan.json';

    var CHECK_FETCH_REQUIRE = '/m/s/credit/fetch/check_fetch_require_u.json';
    var CHECK_NEED_SIGN_CONTRACT = '/m/s/aging/need_sign_contract.json';
    var SIGN_CONTRACT = '/m/s/aging/sign_contract.json';

    var IS_SET_PAY_PASSWORD = "/m/s/ewallet/is_pay_password_set.json";              //查询支付密码

    var DO_QUERY_RECOMMEND_DATA_BY_USER = '/recommend/doQueryRecommandDataByUser.json';        //猜你喜欢商品列表

    var PAY_RESP_URL = "/m/s/pay/pay_result.json";

    var ALIPAY_CODE = {
        "9000": "订单支付成功",
        "8000": "正在处理中",
        "4000": "订单支付失败",
        "6001": "用户中途取消",
        "6002": "网络连接出错"
    };

    var WEIXIN_SELLER = "1272239001";

    var WEIXIN_CODE = {
        "0": "订单支付成功",
        "-1": "订单支付失败",
        "-2": "用户中途取消"
    };


    // order的payParams: {orderNos,agingTotalAmount,deliveryFee,agingBackUrl}
    // cart的payParams: {orderNos,agingTotalAmount,deliveryFee,agingBackUrl}

    function payProvider($location, $window, $timeout, httpRequest, $loadingOverlay, constant, utils, $interval, settingCache) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'components/pay/views/pay-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope;

                vm.payNo = null;
                vm.useWeixin = useWeixin;
                vm.useAlipay = useAlipay;
                vm.useCard = useCard;
                vm.useJD = useJD;
                vm.canPartRepay = canPartRepay;
                vm.payLimit = {
                    maxPartPayTimes: null,
                    currentPayTimes: null,
                    minPartPayAmount: null
                };
                vm.payPasswordNo = null;
                vm.passwordWrong = passwordWrong;
                vm.ifShowLimit = ifShowLimit;
                vm.getPayType = getPayType;

                vm.canUse = true;

                vm.partRepay = {
                    active: false,
                    partAmount: null,
                    checkAmount: function () {
                        if (vm.$eval($attribute.payAmount) < vm.partRepay.partAmount) {
                            utils.error('自定义金额不能大于本期的总金额,请重新输入！');
                            return false;
                        }
                        if (isNaN(vm.partRepay.partAmount)) {
                            utils.error('请输入数字');
                            return false;
                        }
                        if (vm.partRepay.partAmount < vm.payLimit.minPartPayAmount) {
                            utils.error('不能低于最小还款金额，请重新输入');
                            return false;
                        }
                        return true;
                    },
                    changePartRepayType: function () {
                        vm.partRepay.active = !vm.partRepay.active;
                        if (vm.partRepay.active) {
                            vm.partRepay.partAmount = vm.payInfo.amount;
                        }
                    }

                };
                function canPartRepay() {
                    if (vm.$eval($attribute.payType) == 'repay') {
                        if (vm.payLimit.maxPartPayTimes <= vm.payLimit.currentPayTimes) {
                            return false;
                        }
                        return true;
                    } else {
                        return false;
                    }

                }


                function passwordWrong() {
                    utils.customDialog("亲，您的支付密码错误!", "找回密码,关闭", function (buttonIndex) {
                        if (buttonIndex == 1) {
                            utils.gotoUrl("/profile/res");
                        }
                    });
                }

                function ifShowLimit() {
                    if (vm.$eval($attribute.payType) == 'repay') {
                        if (vm.partRepay.active) {
                            return true;
                        }
                        if (vm.payLimit.maxPartPayTimes == vm.payLimit.currentPayTimes && vm.payLimit.maxPartPayTimes != 0) {
                            return true;
                        }
                    }

                    return false;
                }

                vm.showPayType = function () {
                    var payType = vm.$eval($attribute.payType);

                    if (payType === 'order' || payType === 'cart') {
                        if (getPayAmount() === 0) {
                            return false;
                        }
                    }

                    return true;
                };

                vm.payInfo = {
                    isVisible: false,

                    title: null,
                    amount: null,
                    payType: null,
                    payParams: null,
                    open: function () {
                        vm.payInfo.title = vm.$eval($attribute.payTitle);
                        vm.payInfo.amount = vm.$eval($attribute.payAmount);
                        vm.payInfo.payType = vm.$eval($attribute.payType);
                        // 对于order和cart必须有：agingTotalAmount(分期金额),deliveryFee(邮费)
                        // 对于repay必须有：repay_no(还款单号),amountInterest(服务费)
                        var payParams = vm.$eval($attribute.payParams);
                        vm.payInfo.payParams = payParams;

                        // promotion
                        vm.promotionObject.init();
                        vm.rateObject.init();
                        vm.periodsObject.init();


                        if (vm.payInfo.payType === 'repay') {
                            httpRequest.getReq(QUERY_PART_PAY_RULE, {repay_no: payParams.repay_no})
                                .then(function (d) {
                                    vm.payLimit = d;
                                });

                            vm.payInfo.isVisible = true;
                            vm.partRepay.active = false;

                            vm.couponRepayObject.init(vm.payInfo.amount, payParams.amountInterest);
                        } else if (vm.payInfo.payType === 'order' || vm.payInfo.payType === 'cart') {
                            vm.payInfo.isVisible = true;

                            vm.couponObject.init(vm.payInfo.amount, true);
                        }
                    },
                    close: function () {
                        vm.payInfo.isVisible = false;
                        vm.agingObject.closeDialog();
                    },
                    goBack: function () {
                        utils.customDialog('提醒', '亲，确认推出本次支付？？', '继续支付,确认离开', function (btnIndex) {
                            if (btnIndex == 2) {
                                vm.payInfo.isVisible = false;
                                vm.agingObject.closeDialog();
                            }
                        });
                    }
                };

                vm.couponObject = {
                    showCoupon: false,
                    activity: null,
                    init: function (amount, isFullPay) {

                        vm.couponObject.showCoupon = false;
                        vm.couponObject.activity = null;

                        httpRequest.getReq(GET_ACTIVITY_FOR_PAY, {
                            payAmount: amount,
                            isFullPay: isFullPay
                        }).then(function (d) {
                            if (d && d.activity) {
                                vm.couponObject.showCoupon = true;
                                vm.couponObject.activity = d.activity;
                            } else {
                                vm.couponObject.showCoupon = false;
                                vm.couponObject.activity = null;
                            }
                        });
                    }
                };

                vm.couponRepayObject = {
                    showCoupon: false,
                    activity: null,
                    couponList: null,

                    isVisible: false,

                    useCoupon: function (item) {
                        console.log(item)
                        vm.couponRepayObject.activity = item;

                        vm.couponRepayObject.closeDialog();
                    },

                    checkSelected: function (item) {
                        if (vm.couponRepayObject.activity && item.couponId == vm.couponRepayObject.activity.couponId) {
                            return true;
                        }
                        return false;
                    },

                    openDialog: function () {
                        vm.couponRepayObject.isVisible = true;
                    },

                    closeDialog: function () {
                        vm.couponRepayObject.isVisible = false;
                    },

                    init: function (amount, serviceFee) {

                        vm.couponRepayObject.showCoupon = false;
                        vm.couponRepayObject.activity = null;
                        vm.couponRepayObject.couponList = null;

                        var initParams = vm.$eval($attribute.payParams);
                        var initIdx = initParams.item.currPeroid;
                        var scheduleId = initParams.item.repaymentScheduleList[initIdx].id;
                        httpRequest.getReq(GET_ACTIVITY_FOR_REPAY, {
                            payAmount: amount,
                            serviceFee: serviceFee,
                            scheduleId: scheduleId
                        }).then(function (d) {
                            if (d && d.items && d.items.length > 0) {
                                vm.couponRepayObject.showCoupon = true;
                                vm.couponRepayObject.activity = d.items[0];
                                vm.couponRepayObject.couponList = d.items;
                            } else {
                                vm.couponRepayObject.showCoupon = false;
                                vm.couponRepayObject.activity = null;
                                vm.couponRepayObject.couponList = null;
                            }
                        });
                    }
                };

                var paySuccessFn = vm.$eval($attribute.paySuccessFn),
                    payFailFn = vm.$eval($attribute.payFailFn);

                vm.payPassword = {
                    isVisible: false,
                    password: null,
                    payPasswordFn: null,
                    openDialog: function (payPasswordFn) {
                        vm.payPassword.password = null;
                        vm.payPassword.payPasswordFn = payPasswordFn;
                        httpRequest.getReq(IS_SET_PAY_PASSWORD)
                            .then(function (d) {
                                hideLoading();
                                if (d) {
                                    vm.payPassword.isVisible = true;
                                } else {
                                    utils.customDialog('提醒', '亲，您未设置支付密码，请设置', '设置,关闭', function (idx) {
                                        if (idx == 1) {
                                            vm.setPayPassword.openDialog();
                                        }
                                    });
                                }
                            }, function (d) {
                                hideLoading();
                                utils.error(d.msg);
                            });
                    },
                    closeDialog: function () {
                        vm.payPassword.isVisible = false;
                    },
                    dialogSubmit: function () {
                        if (checkPayPassword(vm.payPassword.password) && vm.payPassword.payPasswordFn) {
                            vm.payPassword.payPasswordFn();
                        }
                    },
                    gotoForgetPayPassword: function () {
                        vm.payPassword.closeDialog();
                        vm.forgetPayPassword.openDialog();
                    }
                };

                function checkPayPassword(payPassword) {
                    if (!(/^\d{6}$/).test(payPassword)) {
                        utils.error("输入有误，支付密码为6位数字");
                        return false;
                    }
                    return true;
                }

                vm.gotoProductDetail = gotoProductDetail;

                function gotoProductDetail(productId, promotionId, promotionType) {
                    var url = utils.getUrlWithParams('/product/detail', {
                        productId: productId,
                        promotionId: promotionId,
                        promotionType: promotionType
                    });
                    utils.gotoUrl(url);
                }

                vm.paySuccess = {
                    openDialog: function (text) {
                        if (paySuccessFn) {
                            paySuccessFn();
                        } else {
                            var payParams = vm.$eval($attribute.payParams);
                            var successParams = {
                                billNo: vm.bill_no,
                                text: text || "订单支付成功",
                                money: vm.payInfo.amount,
                                payType: vm.payInfo.payType,
                                orderId: payParams.shareOrderId
                            };
                            if (payParams.shareOrderId) {
                                successParams.orderId = payParams.shareOrderId;
                            }
                            if (payParams.repay_no) {
                                successParams.scheduleNo = payParams.repay_no;
                            }
                            var url = utils.getUrlWithParams('/product/paysuccess', successParams);
                            utils.gotoUrl(url);
                        }
                    }
                };


                // 分期部分
                vm.reloadForAging = reloadForAging;
                function reloadForAging(fn) {

                    var firstPayRadio = vm.rateObject.selected;

                    var payType = vm.$eval($attribute.payType),
                        payParams = vm.$eval($attribute.payParams);

                    var orderNosArr = payParams.orderNos.split(',');

                    var calAgingUrl = PAY_URL[payType]["calAging"];

                    if (payType === 'order' || payType === 'cart') {
                        httpRequest.getReq(calAgingUrl, null, {
                            type: 'POST',
                            data: {
                                orderNos: orderNosArr,
                                firstPayRadio: (firstPayRadio === null) ? 0 : firstPayRadio
                            }
                        }).then(function (d) {
                            if (d) {

                                vm.periodsObject.data = d;
                                vm.periodsObject.period = d.periodArray;
                                vm.periodsObject.payAccount = d.everyPayAmountArray;

                                vm.promotionObject.canAgingByAmount = d.canAging;
                                vm.promotionObject.errMessageByAmount = null;

                                if (vm.periodsObject.selected === null) {
                                    vm.periodsObject.selected = d.periodArray[0];
                                }

                                vm.rateObject.rate = d.firstPayRadio.sort(function (a, b) {
                                    return a - b;
                                });

                                if (vm.rateObject.selected === null) {
                                    vm.rateObject.selected = vm.rateObject.rate[0];
                                }

                                vm.couponObject.init(d.firstPayAmount, false);
                            }

                            fn && fn();

                        }, function (d) {
                            vm.promotionObject.canAgingByAmount = false;
                            vm.promotionObject.errMessageByAmount = d.msg;
                            vm.calErrorCode = d.code;
                            fn && fn();
                        });
                    }

                }

                vm.getPayAmount = getPayAmount;
                vm.isZeroFirstPay = false; // 零首付不使用优惠券
                function getPayAmount() {
                    var payParams = vm.$eval($attribute.payParams);
                    var amount = 0;
                    if (vm.promotionObject.type === 'sale') {
                        amount = vm.payInfo.amount;
                        vm.isZeroFirstPay = false;
                    } else if (vm.promotionObject.type === 'aging') {
                        if (vm.periodsObject.data) {
                            amount = vm.periodsObject.data.firstPayAmount + payParams.deliveryFee;
                        } else {
                            amount = vm.payInfo.amount;
                        }
                        vm.isZeroFirstPay = (amount === 0);
                    }

                    if (vm.couponObject.showCoupon) {
                        amount -= vm.couponObject.activity.discountCash;
                    }

                    return Math.max(0, amount);
                }


                vm.promotionObject = {
                    type: 'sale', // sale, aging,
                    canAging: true,
                    needSign: false,
                    canAgingByAmount: true,
                    errMessageByAmount: null,

                    init: function () {
                        vm.promotionObject.type = 'sale';
                        vm.promotionObject.canAgingByAmount = true;
                        vm.promotionObject.errMessageByAmount = null;
                    },
                    chooseType: function (type) {
                        if (type === 'aging') {
                            reloadForAging(function () {
                                if (vm.promotionObject.canAging && vm.promotionObject.canAgingByAmount) {
                                    vm.promotionObject.type = type;
                                    vm.agingObject.openDialog();
                                } else {
                                    console.log(vm.promotionObject)
                                    if (vm.promotionObject.errCode == 'no') {
                                        if (vm.calErrorCode == 614 || vm.calErrorCode == 2042) {
                                            utils.error(vm.promotionObject.errMessageByAmount);
                                        } else {
                                            utils.customDialog('亲，您未完成认证', '你的分期额度不足或您的认证未申请或暂未通过，当前无可用额度哦。请在APP中【我的认证】页查看当前认证状态。', '先逛逛,去下载', function (btnIdx) {
                                                if (btnIdx == 2) {
                                                    utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                                                }
                                            });
                                        }

                                    } else if (vm.promotionObject.needSign) {
                                        utils.customDialog('亲，您未签署分期合同', '首次分期购物需要签署分期合同！', '先逛逛,去签署', function (btnIdx) {
                                            if (btnIdx == 2) {
                                                showLoading("正在生成合同...");
                                                httpRequest.getReq(SIGN_CONTRACT).then(function (d) {
                                                    if (d) {
                                                        payOrderContract(d);
                                                    }
                                                });
                                            }
                                        });
                                    } else if (!vm.promotionObject.canAgingByAmount) {
                                        var msg = vm.promotionObject.errMessageByAmount || '亲，由于您的订单不符合分期要求暂时无法分期，您仍可以选择全款付购买自己喜爱的宝贝！';
                                        if (vm.calErrorCode == '700') {

                                            utils.customDialog('提醒', msg, '去更新', function () {
                                                utils.gotoUrl("/auth/main");
                                            }); // 毕业贷认证
                                        } else {
                                            utils.error(msg); // 分期不足
                                        }
                                    }

                                    vm.agingObject.closeDialog();
                                }
                            });
                        } else if (type === 'sale') {
                            vm.promotionObject.type = type;
                            vm.agingObject.closeDialog();
                            vm.couponObject.init(vm.payInfo.amount, true);
                        }
                    }
                };

                vm.agingObject = {
                    isVisible: false,
                    openDialog: function () {
                        vm.agingObject.isVisible = true;
                    },
                    closeDialog: function () {
                        vm.agingObject.isVisible = false;
                    }
                };

                vm.rateObject = {

                    rate: [],

                    selected: null,

                    init: function () {
                        vm.rateObject.rate = [];
                        vm.rateObject.selected = null;
                    },

                    select: function (pr) {
                        vm.rateObject.selected = pr;
                        reloadForAging();
                    },

                    isSelect: function (pr) {
                        if (pr == vm.rateObject.selected) {
                            return true;
                        }
                        return false;
                    },

                    getSelectText: function () {
                        if (vm.rateObject.selected != null) {
                            if (vm.rateObject.selected == 0) {
                                return "零首付";
                            } else {
                                return "首付" + (vm.rateObject.selected * 100) + "%";
                            }
                        }
                        return null;
                    }

                };

                vm.periodsObject = {

                    data: null,

                    period: [],

                    payAccount: [],

                    selected: null,

                    init: function () {
                        vm.periodsObject.data = null;
                        vm.periodsObject.period = [];
                        vm.periodsObject.payAccount = [];
                        vm.periodsObject.selected = null;
                    },

                    select: function (ap) {
                        vm.periodsObject.selected = ap;
                    },

                    isSelect: function (ap) {
                        if (ap == vm.periodsObject.selected) {
                            return true;
                        }
                        return false;
                    },

                    getSelectAccount: function () {
                        for (var i = 0; i < vm.periodsObject.period.length; i++) {
                            if (vm.periodsObject.period[i] == vm.periodsObject.selected) {
                                return vm.periodsObject.payAccount[i];
                            }
                        }
                        return null;
                    }

                };

                function showLoading(text) {
                    $loadingOverlay.show(text);
                    $timeout(function () {
                        $loadingOverlay.hide();
                    }, 15000);
                }

                function hideLoading() {
                    $loadingOverlay.hide();
                    //vm.$apply("");
                }

                function paySuccessResp(payNo, channel) {
                    vm.payInfo.close();
                    httpRequest.getReq(PAY_RESP_URL, null, {
                        type: 'POST',
                        data: {
                            'pay_no': payNo,
                            'channel': channel,
                            'status': 'success'
                        }
                    });
                }

                function getPayType() {
                    return vm.$eval($attribute.payType);
                }

                function payOrderContract(signUrl) {

                    hideLoading();

                    signUrl = encodeURI(utils.htmlDecode(signUrl));

                    var payParams = vm.$eval($attribute.payParams);

                    if (navigator.appupdate && navigator.appupdate.openUrlInner && navigator.appupdate.closeUrlInner) {
                        navigator.appupdate.openUrlInner('分期购物合同',
                            signUrl,
                            constant.APP_HOME_URL + payParams.agingBackUrl,
                            "亲，是否取消签署分期购物合同，如果合同未签署将无法申请分期购物？");
                    }
                }

                function payOrderAging(orderNosArr, payOrderFn) {

                    if (vm.periodsObject.data && vm.periodsObject.data.signUrl) {
                        payOrderContract(vm.periodsObject.data.signUrl);
                    } else {
                        vm.payPassword.openDialog(function () {
                            payOrderAgingWithPassword(orderNosArr, payOrderFn);
                        });
                    }

                }

                function createPayPassword(password) {
                    var ifo = settingCache.get("__ifo");

                    if (ifo) {
                        var encrypt = new jsencrypt();
                        encrypt.setPublicKey(ifo);
                        return "S#" + encrypt.encrypt(password);
                    }

                    return null;
                }

                function payOrderAgingWithPassword(orderNosArr, payOrderFn) {

                    showLoading("正在完成支付，请稍后...");

                    var params = {
                        source: 'mobile',
                        sourceFuncType: '',
                        firstPayRadio: vm.rateObject.selected,
                        period: vm.periodsObject.selected,
                        passwd: createPayPassword(vm.payPassword.password),
                        orderNos: orderNosArr
                    };

                    httpRequest.getReq(CREATE_AGING_ORDER, null, {
                        type: 'POST',
                        data: params,
                        timeout: 30000
                    }).then(function (d) {
                        // 判断是否签署合同
                        if (d.signUrl) {
                            payOrderContract(d.signUrl);
                        } else {
                            if (d.agingApplay.applyNo) {
                                vm.bill_no = d.agingApplay.applyNo;
                            }
                            payOrderFn && payOrderFn(d);
                        }
                    }, function (d) {
                        hideLoading();

                        payFailFn && payFailFn();

                        utils.error("创建支付失败：" + d.msg);

                    });
                }

                // 1.支付宝支付
                function useAlipay(loadingText) {

                    loadingText = loadingText || "正在打开支付宝...";

                    showLoading('<i>' + loadingText + '</i>');

                    var payType = vm.$eval($attribute.payType),
                        url = PAY_URL[payType]["alipay"],
                        payParams = vm.$eval($attribute.payParams);

                    if (payType == 'repay') {

                        var params = {
                            repay_no: payParams.repay_no
                        };

                        if (vm.couponRepayObject.showCoupon && !vm.partRepay.active) {
                            params.user_coupon_id = vm.couponRepayObject.activity.id;
                        }

                        if (vm.partRepay.active) {
                            url = ALIPAY_PART_REPAY;
                            params.repay_amount = vm.partRepay.partAmount;

                            // 判断部分还款
                            if (!vm.partRepay.checkAmount()) {
                                hideLoading();
                                return false;
                            }
                        }

                        payAlipayRepay(url, params);

                    } else if (payType == 'order' || payType == 'cart') {

                        var orderNos, orderNosArr = [];

                        if (payParams && payParams.orderNos) {
                            orderNos = payParams.orderNos;
                            orderNosArr = orderNos.split(",");
                        }

                        if (vm.promotionObject.type == 'sale') {
                            payAlipayOrder(url, {
                                order_nos: orderNos
                            });
                        } else if (vm.promotionObject.type == 'aging') {
                            payOrderAging(orderNosArr, function (d) {
                                url = ALIPAY_PART_PAY;
                                payAlipayOrder(url, {
                                    bill_no: d.agingApplay.applyNo
                                });
                            });
                        }
                    }
                }


                function payAlipayOrder(url, params) {
                    httpRequest.getReq(url, params).then(function (d) {

                        if (d.paidByPreferential) {
                            hideLoading();
                            vm.paySuccess.openDialog("支付成功");
                        } else {
                            payAlipay(d.payAmount, d.payNo, d.notifyUrl);
                        }

                    }, function (d) {
                        hideLoading();
                        if (d.msg) {
                            utils.error("创建支付失败：" + d.msg, payFailFn);
                        } else {
                            utils.error("创建支付失败, 请重试", payFailFn);
                        }

                    });
                }

                function payAlipayRepay(url, payParams) {
                    httpRequest.getReq(url, payParams).then(function (d) {
                        payAlipay(d.payAmount, d.payNo, d.notifyUrl);
                    }, function (d) {
                        hideLoading();
                        if (d.msg) {
                            utils.error("创建支付失败：" + d.msg, payFailFn);
                        } else {
                            utils.error("创建支付失败, 请重试", payFailFn);
                        }

                    });
                }

                function payAlipay(amount, payNo, _notifyUrl) {
                    var notifyUrl = constant.ALIPAY_NOTIFY_URL;
                    if (_notifyUrl) {
                        notifyUrl = _notifyUrl;
                    }

                    var title = utils.isEmpty(vm.payInfo.title) ? '平台购物' : vm.payInfo.title;

                    if (navigator.alipay) {

                        navigator.alipay.pay({
                            "seller": constant.ALIPAY_SELLER,
                            "subject": title + "[零零期商城]",
                            "body": title,
                            "price": amount + "", // d.amount
                            "tradeNo": payNo,
                            "timeout": "30m",
                            "notifyUrl": notifyUrl
                        }, function (msgCode) {
                            hideLoading();
                            msgCode = msgCode + "";
                            if (msgCode == "9000") {
                                paySuccessResp(payNo, 'alipay');
                                vm.paySuccess.openDialog(ALIPAY_CODE[msgCode]);
                            } else {
                                utils.alert(ALIPAY_CODE[msgCode], payFailFn);
                            }
                        }, function (msg) {
                            hideLoading();
                            utils.error("订单支付失败：" + msg, payFailFn);
                        });

                    } else {
                        hideLoading();
                        utils.customDialog("APP下载",
                            "亲，十分抱歉的通知您，通过移动网站的支付通道暂时关闭，您可以下载零零期APP完成支付！",
                            "安装零零期,关闭",
                            function (idx) {
                                if (idx === 1) {
                                    window.location.href = constant.APP_DOWNLOAD_URL;
                                }
                            });
                    }
                }

                // 2.微信支付
                function useWeixin() {

                    showLoading('<i>正在打开微信支付...</i>');

                    var payType = vm.$eval($attribute.payType),
                        url = PAY_URL[payType]["weixin"],
                        payParams = vm.$eval($attribute.payParams);

                    if (payType == 'repay') {

                        var params = {
                            repay_no: payParams.repay_no
                        };

                        if (vm.couponRepayObject.showCoupon && !vm.partRepay.active) {
                            params.user_coupon_id = vm.couponRepayObject.activity.id;
                        }

                        if (vm.partRepay.active) {
                            url = WEIXIN_PART_REPAY;
                            params.repay_amount = vm.partRepay.partAmount;

                            // 判断部分还款
                            if (!vm.partRepay.checkAmount()) {
                                hideLoading();
                                return false;
                            }
                        }

                        payWeixinRepay(url, params);

                    } else if (payType == 'order' || payType == 'cart') {
                        var orderNos, orderNosArr = [];

                        if (payParams && payParams.orderNos) {
                            orderNos = payParams.orderNos;
                            orderNosArr = orderNos.split(",");
                        }

                        if (vm.promotionObject.type == 'sale') {
                            payWeixinOrder(url, {
                                order_nos: orderNos
                            });
                        } else if (vm.promotionObject.type == 'aging') {
                            payOrderAging(orderNosArr, function (d) {
                                url = WEIXIN_PART_PAY;
                                payWeixinOrder(url, {
                                    bill_no: d.agingApplay.applyNo
                                });
                            });
                        }

                    }
                }

                function payWeixinRepay(url, payParams) {
                    httpRequest.getReq(url, payParams).then(function (d) {
                        payWeixin(d.appOrderRequest);
                    }, function (d) {
                        hideLoading();
                        if (d.msg) {
                            utils.error("创建支付失败：" + d.msg, payFailFn);
                        } else {
                            utils.error("创建支付失败, 请重试", payFailFn);
                        }

                    });
                }

                function payWeixinOrder(url, params) {
                    httpRequest.getReq(url, params).then(function (d) {

                        if (d.paidByPreferential) {
                            hideLoading();
                            vm.paySuccess.openDialog("支付成功");
                        } else {
                            payWeixin(d.appOrderRequest);
                        }

                    }, function (d) {
                        hideLoading();
                        if (d.msg) {
                            utils.error("创建支付失败：" + d.msg, payFailFn);
                        } else {
                            utils.error("创建支付失败, 请重试", payFailFn);
                        }

                    });
                }


                function payWeixin(d) {
                    if (navigator.wechat) {
                        navigator.wechat.sendPaymentRequest({
                            "mch_id": WEIXIN_SELLER,
                            "prepay_id": d.prepayid,
                            "nonce": d.noncestr,
                            "timestamp": d.timestamp,
                            "sign": d.sign
                        }, function () {
                            hideLoading();
                            paySuccessResp(d.outTradeNo, 'webchat_app_pay');
                            vm.paySuccess.openDialog(WEIXIN_CODE["0"]);
                        }, function (msg) {
                            hideLoading();
                            utils.error("订单支付失败：" + msg, payFailFn);
                        });
                    } else {
                        hideLoading();
                        utils.customDialog("APP下载",
                            "亲，十分抱歉的通知您，通过移动网站的支付通道暂时关闭，您可以下载零零期APP完成支付！",
                            "安装零零期,关闭",
                            function (idx) {
                                if (idx === 1) {
                                    window.location.href = constant.APP_DOWNLOAD_URL;
                                }
                            });
                    }
                }

                // 3.银行卡支付
                function useCard() {
                    showLoading('<i>正在生成银行支付...</i>');

                    var payType = vm.$eval($attribute.payType),
                        url = PAY_URL[payType]["card"],
                        payParams = vm.$eval($attribute.payParams);

                    if (payType == 'repay') {

                        var params = {
                            repay_no: payParams.repay_no
                        };

                        if (vm.couponRepayObject.showCoupon && !vm.partRepay.active) {
                            params.user_coupon_id = vm.couponRepayObject.activity.id;
                        }

                        if (vm.partRepay.active) {
                            url = CARD_PART_REPAY;
                            params.repay_amount = vm.partRepay.partAmount;

                            // 判断部分还款
                            if (!vm.partRepay.checkAmount()) {
                                hideLoading();
                                return false;
                            }
                        }

                        payCardRepay(url, params);

                    } else if (payType == 'order' || payType == 'cart') {
                        var orderNos, orderNosArr = [];

                        if (payParams && payParams.orderNos) {
                            orderNos = payParams.orderNos;
                            orderNosArr = orderNos.split(",");
                        }

                        if (vm.promotionObject.type == 'sale') {
                            vm.payPassword.openDialog(function () {
                                payCardOrder(url, {
                                    order_nos: orderNos,
                                    pay_password: window.encodeURIComponent(createPayPassword(vm.payPassword.password))
                                });
                            });
                        } else if (vm.promotionObject.type == 'aging') {
                            payOrderAging(orderNosArr, function (d) {
                                url = CARD_PART_PAY;
                                payCardOrder(url, {
                                    bill_no: d.agingApplay.applyNo
                                });
                            });
                        }

                    }
                }

                function payCardRepay(url, params) {
                    var d = utils.getUrlWithParams(url, params);
                    var backParams = {
                        payType: 'repay'
                    };
                    var backUrl = constant.APP_HOME_URL + utils.getUrlWithParams("/profile/pay/result", backParams);
                    payCard(d, backUrl);
                }

                function payCardOrder(url, params) {
                    var d = utils.getUrlWithParams(url, params);
                    var backParams = {
                        payType: 'order'
                    };
                    var backUrl = constant.APP_HOME_URL + utils.getUrlWithParams("/profile/pay/result", backParams);
                    payCard(d, backUrl);
                }


                function payCard(d, backUrl) {
                    var url = d;
                    if (navigator.appupdate && navigator.appupdate.openUrlInner) {
                        navigator.appupdate.openUrlInner('支付', url, backUrl, "亲，是否确认取消支付？");
                    }
                }


                // 4.京东支付
                function useJD() {
                    var locationHref = window.location.href;
                    var href = locationHref.split('html#')[1];
                    showLoading('<i>正在生成京东支付...</i>');

                    var payType = vm.$eval($attribute.payType),
                        url = PAY_URL[payType]["jd"],
                        payParams = vm.$eval($attribute.payParams);

                    if (payType == 'repay') {
                        var params = {
                            repay_no: payParams.repay_no,
                            custom_return_url: encodeURIComponent('https://m.007fenqi.com/app/family/wxm/index.html#/product/paysuccess')
                        };

                        if (vm.couponRepayObject.showCoupon && !vm.partRepay.active) {
                            params.user_coupon_id = vm.couponRepayObject.activity.id;
                        }

                        if (vm.partRepay.active) {
                            url = JD_PART_REPAY;
                            params.repay_amount = vm.partRepay.partAmount;

                            // 判断部分还款
                            if (!vm.partRepay.checkAmount()) {
                                hideLoading();
                                return false;
                            }
                        }

                        payJDRepay(url, params);

                    } else if (payType == 'order' || payType == 'cart') {
                        var orderNos, orderNosArr = [];
                        if (payParams && payParams.orderNos) {
                            orderNos = payParams.orderNos;
                            orderNosArr = orderNos.split(",");
                        }

                        if (vm.promotionObject.type == 'sale') {
                            payJDOrder(url, {
                                order_nos: orderNos,
                                custom_return_url: encodeURIComponent('https://m.007fenqi.com/app/family/wxm/index.html#/product/paysuccess')
                            });
                        } else if (vm.promotionObject.type == 'aging') {
                            payOrderAging(orderNosArr, function (d) {
                                url = JD_PART_PAY;
                                payJDOrder(url, {
                                    bill_no: d.agingApplay.applyNo,
                                    custom_return_url: encodeURIComponent('https://m.007fenqi.com/app/family/wxm/index.html#/product/paysuccess')
                                });
                            });
                        }

                    }
                }

                function payJDRepay(url, params) {
                    var d = utils.getUrlWithParams(url, params);
                    var backParams = {
                        payType: 'repay'
                    };
                    var backUrl = constant.APP_HOME_URL + utils.getUrlWithParams("/profile/pay/result", backParams);
                    payJD(d, backUrl);
                }

                function payJDOrder(url, params) {
                    var d = utils.getUrlWithParams(url, params);
                    var backParams = {
                        payType: 'order'
                    };
                    var backUrl = constant.APP_HOME_URL + utils.getUrlWithParams("/profile/pay/result", backParams);
                    payJD(d, backUrl);
                }


                function payJD(d, backUrl) {
                    var url = d;
                    if (utils.isMM() && window.WEIXIN_READY) {
                        window.location.href = url;
                    } else if (navigator.appupdate && navigator.appupdate.openUrlInner) {
                        navigator.appupdate.openUrlInner('支付', url, backUrl, "亲，是否确认取消支付？");
                    }
                }


                function init() {
                    httpRequest.getReq(CHECK_USER_AGING_OR_LOAN)
                        .then(function (d) {
                            console.log(1);
                            console.log(d);
                            console.log(1);
                            vm.promotionObject.canAging = d;
                            vm.promotionObject.errCode = 'no';
                        });
                    httpRequest.getReq(CHECK_NEED_SIGN_CONTRACT).then(function (d) {
                        if (d) {
                            vm.promotionObject.canAging = false;
                            vm.promotionObject.needSign = true;
                        }
                    });

                    if (utils.isMM()) {
                        vm.canUse = false;
                    }
                }

                init();
            }
        };
    }

})
;
