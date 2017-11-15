/**
 * profile my team area manager controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileMyOrderCashCtrl', ProfileMyOrderCash);

    ////////
    ProfileMyOrderCash.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileMyOrderCash($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        vm.cancelOrder = cancelOrder;
        vm.payOrder = payOrder;
        vm.repayOrder = repayOrder;
        vm.confirmOrder = confirmOrder;
        vm.confirmDeliveryOrder = confirmDeliveryOrder;
        vm.showOrder = showOrder;

        vm.gotoProductGrey = gotoProductGrey;

        vm.gotoProduct = function (product) {
            var url = utils.getUrlWithParams("/product/detail", {
                productId: product.productId,
                promotionType: 'aging'
            });
            utils.gotoUrl(url);
        };

        function flush() {
            location.reload();
        }

        vm.shareFn = shareFn;

        function shareFn(type) {
            if (type == 'friend') {
                vm.allowShareItems[1].fn();
            } else {
                vm.allowShareItems[0].fn();
            }
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

        vm.reasonList = [];
        vm.cancelBlanknoteReason = [];
        //选择取消白条的原因
        vm.reasonDialog = {
            isVisible: false,
            reasonKey: null,
            //reasonKey:[],
            orderId: null,
            selected: false,
            // isSelecteds:[false,false,false,false,false],

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
            //原因多选
            // isChoose:function(index){
            //     console.log(index);
            //     if(vm.reasonDialog.isSelecteds[index]){
            //         vm.reasonDialog.isSelecteds[index] = false;
            //     }else{
            //         vm.reasonDialog.isSelecteds[index] = true;
            //     }
            // }
        };

        //取消白条的原因    （调接口）
        vm.getCancelBlanknoteReason = getCancelBlanknoteReason;

        function getCancelBlanknoteReason() {
            httpRequest.getReq(urlHelper.getUrl('cancelBlanknoteReason')).then(function (d) {
                vm.cancelBlanknoteReason = d.items;
            }), function (d) {
                //alert("调用取消白条接口失败");
            }
        }

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

        vm.haveRedTheme = false;
        function getRedTheme() {
            httpRequest.getReq(urlHelper.getUrl('getAvailableOne'), null, {ignoreLogin: true}).then(function (d) {
                if (d && d.id) {
                    vm.haveRedTheme = true;
                }
            }, function (d) {

            })
        }


        //取消白条
        function cancelOrder(item) {
            vm.reasonDialog.orderId = item.id;
            vm.reasonList = vm.cancelBlanknoteReason;
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
                vm.payDialog.params.agingBackUrl = "/profile/myorder/ordercash";
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
                'goBack': "/profile/myorder/orderall"
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
            openDialog: function () {
                vm.traceDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.traceDialog.isVisible = false;
            }
        };

        function showTraceFn(status) {
            if (status == "wait_delivery"
                || status == "confirm_delivery"
                || status == "finished"
                || status == "aging_ing") {
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

            httpRequest.getReq(urlHelper.getUrl('trace'), {
                orderId: item.id
            }).then(function (d) {
                vm.traceDialog.traceInfo = d;
                if (d.trace && d.trace.traces && d.trace.traces.length > 0) {
                    vm.traceDialog.hasTraceItems = true;
                }
                vm.traceDialog.openDialog();
            }, function () {
                vm.traceDialog.openDialog();
            });

        }


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
                type: 'blank_note'
            };

            httpRequest.getReq(urlHelper.getUrl('getOrderList'), params)
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

        getCancelBlanknoteReason();
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