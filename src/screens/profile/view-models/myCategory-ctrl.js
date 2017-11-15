/**
 * profile my controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'jq',
    'screens/profile/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProfileMyCategoryCtrl', ProfileMyCategory);

    ////////
    ProfileMyCategory.$inject = [
        '$rootScope',
        '$scope',
        '$q',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS', '$stateParams'
    ];
    function ProfileMyCategory($rootScope, $scope, $q, httpRequest, $location, urlHelper, utils, $stateParams) {

        var vm = $scope,
            pageIndex = 1;
        var type = $stateParams.type ? $stateParams.type : 'all';
        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "我的订单",
                isShow: true
            }, $location);
        }

        vm.reasonList = [];

        //待付款、待发货、待收货、分期中
        vm.clipboard = {
            canCopy: navigator.appupdate && navigator.appupdate.setClipboard,
            hasCopy: false,
            setClipboard: function (text) {
                if (navigator.appupdate && navigator.appupdate.setClipboard) {
                    navigator.appupdate.setClipboard(text, function (data) {
                        vm.clipboard.hasCopy = true;
                        utils.alert("已复制到剪切板");
                    });
                }
            }
        };

        vm.statusList = [
            {name: '全部', type: 'all'},
            {name: '待付款', type: 'wait_pay'},
            {name: '待发货', type: 'waiting_deliver_goods'},
            {name: '待收货', type: 'wait_delivery'},
            {name: '待评价', type: 'waiting_evaluate'}
        ];


        //跳转到评价页面
        vm.gotoEvaluateDetail = gotoEvaluateDetail;
        vm.gotoAddEvaluateDetail = gotoAddEvaluateDetail;

        function gotoEvaluateDetail(orderId) {
            var url = utils.getUrlWithParams('/profile/orderAssess', {
                orderId: orderId
            });
            utils.gotoUrl(url);
        }

        function gotoAddEvaluateDetail(orderId) {
            var url = utils.getUrlWithParams('/profile/orderAssess', {
                orderId: orderId,
                isAdd: true
            });
            utils.gotoUrl(url);
        }

        vm.selectStatus = false;


        //选择取消订单的原因
        vm.reasonDialog = {
            isVisible: false,
            reasonKey: null,
            orderId: null,
            selected: false,

            openDialog: function (item) {
                vm.reasonDialog.isVisible = true;

            },
            closeDialog: function () {
                vm.reasonDialog.isVisible = false;
            },
            submitReason: function () {
                if (!vm.reasonDialog.reasonKey) {
                    utils.alert("请选择取消订单的原因");
                    return false;
                }
                var params = {
                    order_id: vm.reasonDialog.orderId,
                    reasonKey: vm.reasonDialog.reasonKey
                };
                httpRequest.getReq(urlHelper.getUrl('cancelOrder'), params)
                    .then(function (d) {
                        utils.alert("取消订单成功", flush);


                    }, function (d) {
                        utils.error("取消订单失败：" + d.msg);
                    });
            },
            chooseReason: function (item) {
                vm.reasonDialog.reasonKey = item;
                vm.reasonDialog.selected = true;
            }
        };


        //订单取消原因   （调接口）
        vm.getReason = getReason;

        function getReason() {
            httpRequest.getReq(urlHelper.getUrl('cancelReason')).then(function (d) {
                vm.reasonList = d.items;
            }, function (d) {

            })
        }


        vm.haveRedTheme = false;
        function getRedTheme() {
            httpRequest.getReq(urlHelper.getUrl('getAvailableOne'), null, {ignoreLogin: true}).then(function (d) {
                if (d && d.id) {
                    vm.haveRedTheme = true;
                }
            }, function (d) {

            })
        }

        vm.status = {
            type: type ? type : null,
            clickStatus: function (type) {
                vm.status.type = type;
                vm.flushPage();
            }
        };
        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;
        vm.flushPage = flushPage;

        vm.cancelOrder = cancelOrder;
        vm.payOrder = payOrder;
        vm.repayOrder = repayOrder;
        vm.confirmOrder = confirmOrder;
        vm.confirmDeliveryOrder = confirmDeliveryOrder;


        vm.isOtherType = isOtherType;
        vm.isRechargeType = isRechargeType;
        vm.isCartType = isCartType;
        vm.showOrder = showOrder;

        vm.gotoProductGrey = gotoProductGrey;

        function gotoProductGrey() {
            httpRequest.getReq(urlHelper.getUrl('getCashProduct'))
                .then(function (d) {
                    if (d && d.items.length > 0) {
                        var url = utils.getUrlWithParams('/product/detail', {
                            'productId': d.items[0].product.id
                        })
                        utils.gotoUrl(url);
                    }
                })
        }


        vm.chooseReason = function (reason) {


        };

        vm.remindSeller = remindSeller;
        function remindSeller(item) {
            httpRequest.getReq(urlHelper.getUrl('remindSellerSendGoods'), {orderId: item.id}).then(function (d) {
                utils.alert('提醒卖家发送消息成功');
            }, function (d) {
                utils.error(d.msg);
            })
        }

        vm.cardContent = {
            isVisible: false,
            cardJsonList: null,
            openDialog: function (item) {
                httpRequest.getReq(urlHelper.getUrl('pickEntityCard'), {orderId: item.id}).then(function (d) {
                    vm.cardContent.cardJsonList = d.items[0].cardList;
                    vm.cardContent.isVisible = true;
                }, function (d) {
                    utils.error('抱歉，无法提卡，' + d.msg);
                })
            },
            closeDialog: function () {
                vm.cardContent.cardJsonList = null;
                vm.cardContent.isVisible = false;
            }
        };

        function flushPage() {
            reload();
            vm.$emit('reload');
        }

        function isOtherType(item) {
            if (item.type == 'blank_note' || isRechargeType(item) || isCartType(item)) {
                return false;
            }
            return true;
        }

        function isRechargeType(item) {
            if (item.virtualOrderDTO && (item.virtualOrderDTO.virtualType == 'of_mobile' || item.virtualOrderDTO.virtualType == 'ou_game_online')) {
                return true;
            }
            return false;
        }

        function isCartType(item) {
            if (item.orderDetails) {
                return true;
            }
            return false;
        }

        function flush() {
            location.reload();
        }

        function cancelOrder(item) {
            vm.reasonDialog.orderId = item.id;
            if (vm.reasonList.length == 0) {
                utils.confirm("亲，真的要取消订单么？", function (buttonIndex) {
                    if (buttonIndex == 2) {
                        var params = {
                            order_id: item.id
                        };
                        httpRequest.getReq(urlHelper.getUrl('cancelOrder'), params)
                            .then(function (d) {
                                utils.alert("取消订单成功", flush);
                            }, function (d) {
                                utils.error("取消订单失败：" + d.msg);
                            });
                    }
                });
            } else {
                vm.reasonDialog.openDialog(item);
            }

        }

        vm.payDialog = {
            item: null,
            params: {
                orderNos: null,
                agingTotalAmount: null,
                deliveryFee: null,
                agingBackUrl: null
            },
            openDialog: function (item) {
                vm.payDialog.item = item;
                vm.payDialog.params.orderNos = item.orderNo;
                vm.payDialog.params.agingTotalAmount = item.payAmount;
                vm.payDialog.params.deliveryFee = item.deliveryFee;

                var currentUrl = utils.getUrlWithParams("/profile/myCategory", {
                    type: $stateParams.type
                });
                vm.payDialog.params.agingBackUrl = currentUrl;
                vm.payInfo.open();
            }
        };

        vm.getSellerName = function (item) {
            var orderNo = "订单号：" + item.orderNo;

            if (item.type == 'blank_note') {
                return orderNo;
            } else {
                return item.sellerName || orderNo;
            }
        };

        function payOrder(item) {
            vm.payDialog.openDialog(item);
        }

        function repayOrder() {
            var url = '/profile/mybill/billcurrent';

            if (utils.checkLogin($rootScope, $location, null, url)) {
                utils.gotoUrl(url);
            }
        }

        function confirmOrder(item) {
            utils.confirm("亲，是否确认购买么？", function (buttonIndex) {
                if (buttonIndex == 2) {
                    var params = {
                        order_id: item.id
                    };
                    httpRequest.getReq(urlHelper.getUrl('confirmOrder'), params)
                        .then(function (d) {
                            utils.alert("确认订单成功", flush);
                        }, function (d) {
                            utils.error("确认订单失败：" + d.msg);
                        });
                }
            });
        }

        function confirmDeliveryOrder(item) {
            utils.confirm("亲，是否确认收到货物么？", function (buttonIndex) {
                if (buttonIndex == 2) {
                    var params = {
                        order_id: item.id
                    };
                    httpRequest.getReq(urlHelper.getUrl('confirmOrderDelivery'), params)
                        .then(function (d) {
                            utils.alert("确认收货成功", flush);
                        }, function (d) {
                            utils.error("确认收货失败：" + d.msg);
                        });
                }
            });
        }

        function showOrder(item) {
            var url = utils.getUrlWithParams('/product/orderdetail', {
                'order_id': item.id,
                'goBack': "/profile/myCategory?type=" + vm.status.type
            });

            if (utils.checkLogin($rootScope, $location, null, url)) {
                utils.gotoUrl(url);
            }

        }


        vm.showTrace = showTrace;
        vm.canTrace = canTrace;

        vm.traceDialog = {
            isVisible: false,
            hasTraceItems: false,
            traceInfo: {},
            logisticsInfoList: [],
            logisticsInfoShowList: [],
            selectTrace: function (item) {
                for (var i = 0; i < vm.traceDialog.logisticsInfoList.length; i++) {
                    vm.traceDialog.logisticsInfoList[i].selected = false;
                }
                item.selected = true;
            },
            openDialog: function () {
                vm.traceDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.traceDialog.isVisible = false;
                vm.traceDialog.logisticsInfoList = [];
            }
        };

        function showTraceFn(status) {
            if (status == "wait_delivery"
                || status == "confirm_delivery"
                || status == "finished"
                || status == "aging_ing"
                || status == "distribution_completed") {
                return true;
            }
            return false;
        }

        function canTrace(item) {
            if (showTraceFn(item.status) && item.deliveryType == 'express') {
                return true;
            }
            return false;
        }

        function showTrace(item) {
            vm.traceDialog.hasTraceItems = false;
            vm.traceDialog.traceInfo = {};
            vm.traceDialog.logisticsInfoList = item.logisticsList;
            vm.traceDialog.openDialog();
            vm.isMultiPackageDelivery = item.isMultiPackageDelivery
            vm.isPartDelivered = item.isPartDelivered

            var productUsedList = [];
            for (var i = 0; i < item.logisticsList.length; i++) {
                var itemLogistics = item.logisticsList[i];
                itemLogistics.countNumber = 0;
                var orderList = [];
                if (vm.isMultiPackageDelivery) {
                    orderList = itemLogistics.orderDetails;
                } else {
                    orderList = item.orderDetails;
                }
                if (orderList && orderList.length > 0) {
                    for (var j = 0; j < orderList.length; j++) {
                        var itemOrderDetails = orderList[j];
                        for (var k = 0; k < item.orderDetails.length; k++) {
                            if (itemOrderDetails.id == item.orderDetails[k].id) {
                                productUsedList.push(item.orderDetails[k].id);
                            }
                        }
                        itemLogistics.countNumber += orderList[j].productCount;
                    }
                    vm.hasLogistics = true;
                } else {
                    vm.traceCompany = itemLogistics.expressCompanyName;
                    vm.hasLogistics = false;
                }
            }


            if (vm.isPartDelivered) {
                var notUseProductList = [];
                notUseProductList = notUseProductList.concat(item.orderDetails);
                for (var i = 0; i < notUseProductList.length; i++) {
                    for (var j = 0; j < productUsedList.length; j++) {
                        if (notUseProductList[i].id == productUsedList[j]) {
                            notUseProductList.splice(i, 1);
                        }
                    }
                }
                var addParams = {
                    countNumber: 0,
                    orderDetails: [{
                        orderStatusDesc: '等待快递公司揽件',
                        productPic: notUseProductList[0].productPic
                    }],
                    packageName: '包裹' + (item.logisticsList.length + 1),
                    isAddType: true,
                };
                for (var i = 0; i < notUseProductList.length; i++) {
                    addParams.countNumber += notUseProductList[i].productCount;
                }
                var addList = [];
                addList = addList.concat(item.logisticsList);
                addList.push(addParams);
                vm.traceDialog.logisticsInfoList = addList;
            }

            for (var i = 0; i < vm.traceDialog.logisticsInfoList.length; i++) {
                vm.traceDialog.logisticsInfoList[i].selected = false;
            }
            vm.traceDialog.logisticsInfoList[0].selected = true;

        }

        vm.shareFn = shareFn;

        function shareFn(type) {
            if (type == 'friend') {
                vm.allowShareItems[1].fn();
            } else {
                vm.allowShareItems[0].fn();
            }
        }

        vm.haveRedTheme = false;
        function getRedTheme() {
            httpRequest.getReq(urlHelper.getUrl('getAvailableOne'), null, {ignoreLogin: true}).then(function (d) {
                if (d && d.id) {
                    vm.haveRedTheme = true;
                    vm.redBeginTime = d.beginTime;
                    vm.redEndTime = d.endTime;
                }
            }, function (d) {

            })
        }

        vm.allowShareItems = [{
            img: "../../assets/imgs/share/weixin.png",
            text: "微信好友",
            allow: !!(navigator.wechat && navigator.wechat.share),
            fn: function () {
                var Wechat = navigator.wechat;
                if (Wechat) {
                    Wechat.isInstalled(function (installed) {
                        if (installed) {

                            var param = {};

                            param.scene = Wechat.Scene.SESSION;

                            param.message = {
                                title: vm.share.title,
                                description: vm.share.summary,
                                thumb: vm.share.smallPicUrl,
                                media: {
                                    type: Wechat.Type.WEBPAGE,
                                    webpageUrl: 'https://show.007fenqi.com/app/share/index.html?state=' + vm.share.themeResourceId
                                }
                            };

                            Wechat.share(param, function () {
                            }, function (reason) {
                                utils.alert("分享失败：" + reason);
                            });

                        } else {
                            utils.alert("亲，您没有安装微信App，请安装后再进行分享。");
                        }
                    });
                }
            }
        }, {
            img: "../../assets/imgs/share/timeline.png",
            text: "微信朋友圈",
            allow: !!(navigator.wechat && navigator.wechat.share),
            fn: function () {
                var Wechat = navigator.wechat;
                if (Wechat) {
                    Wechat.isInstalled(function (installed) {
                        if (installed) {

                            var param = {};

                            param.scene = Wechat.Scene.TIMELINE;

                            param.message = {
                                title: vm.share.title,
                                description: vm.share.summary,
                                thumb: vm.share.smallPicUrl,
                                media: {
                                    type: Wechat.Type.WEBPAGE,
                                    webpageUrl: 'https://show.007fenqi.com/app/share/index.html?state=' + vm.share.themeResourceId
                                }
                            };

                            Wechat.share(param, function () {
                            }, function (reason) {
                                utils.alert("分享失败：" + reason);
                            });

                        } else {
                            utils.alert("亲，您没有安装微信App，请安装后再进行分享。");
                        }
                    });
                }
            }
        }];

        vm.shareBlankRed = shareBlankRed;
        function shareBlankRed(orderId) {
            httpRequest.getReq(urlHelper.getUrl('getAvailableOne'), {}, {ignoreLogin: true}).then(function (d) {
                if (d.id) {
                    var param = {orderId: orderId};
                    httpRequest.getReq(urlHelper.getUrl('getThemeResource'), param, {ignoreLogin: true}).then(function (d) {
                        if (d.theme.shareRedEnvelopeTitle) {
                            vm.share.envelopeTitle = d.theme.shareRedEnvelopeTitle;
                        }
                        vm.share.isVisible = true;
                        vm.share.themeResourceId = d.id;
                        vm.share.title = d.theme.title ? d.theme.title : '零零期红包';
                        vm.share.summary = d.theme.summary ? d.theme.summary : '红包分享';
                        vm.share.smallPicUrl = d.theme.smallPicUrl ? d.theme.smallPicUrl : 1;
                    }, function (d) {

                    })
                } else {
                    utils.error('抱歉，暂无红包');
                    vm.share.isVisible = false;
                }
            }, function (d) {
                vm.share.isVisible = false;
            });
        }

        vm.share = {
            isVisible: false,
            envelopeTitle: '分享给好友领取现金',
            themeResourceId: null,
            title: null,
            summary: null,
            smallPicUrl: null,
            openDialog: function () {
                vm.share.isVisible = true;
            },
            closeDialog: function () {
                vm.share.isVisible = false;
            }
        };


        /**
         * Screen reload
         */
        function reload() {
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
                offset: pageIndex,
                limit: 10,
                status: vm.status.type
            };
            if (vm.status.type == 'all') {
                params.status = null;
            }

            httpRequest.getReq(urlHelper.getUrl('getOrderList'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d.items;
                    if (items && items.length > 0) {
                        for (var i = 0; i < items.length; i++) {

                            items[i].showContentType = items[i].type;
                            if (items[i].virtualOrderDTO) {
                                items[i].showContentType = items[i].virtualOrderDTO.virtualType;
                            }

                            if (items[i].showContentType == "blank_note") {
                                continue;
                            }
                            if (items[i].entityCard == true && items[i].entityCardInfo) {
                                items[i].cardJson = utils.htmlDecode(items[i].entityCardInfo);
                                items[i].cardJson = JSON.parse(items[i].cardJson);
                            }

                        }
                    }
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

        getReason();
        getRedTheme();
        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }
    }

});


