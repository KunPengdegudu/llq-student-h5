/**
 * profile my order all controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileMyOrderAllCtrl', ProfileMyOrderAll);


    ProfileMyOrderAll.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ProfileMyOrderAll($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
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

        vm.isOtherType = isOtherType;
        vm.isRechargeType = isRechargeType;
        vm.isCartType = isCartType;

        vm.gotoProduct = function (product) {
            var url = utils.getUrlWithParams("/product/detail", {
                productId: product.productId,
                promotionType: 'aging'
            });
            utils.gotoUrl(url);
        };

//白条分享
        vm.shareFn = shareFn;

        function shareFn(type) {
            if (type == 'friend') {
                vm.allowShareItems[1].fn();
            } else {
                vm.allowShareItems[0].fn();
            }
        }

        vm.remindSeller = remindSeller;
        function remindSeller(item) {
            httpRequest.getReq(urlHelper.getUrl('remindSellerSendGoods'), {orderId: item.id}).then(function (d) {
                utils.alert('提醒卖家发送消息成功');
            }, function (d) {
                utils.error(d.msg);
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


        function isOtherType(item) {
            if (item.type == 'blank_note' || isRechargeType(item) || isCartType(item)) {
                return false;
            }
            return true;
        }

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

        function isCartType(item) {
            if (item.orderDetails) {
                return true;
            }
            return false;
        }

        function isRechargeType(item) {
            if (item.virtualOrderDTO && (item.virtualOrderDTO.virtualType == 'of_mobile' || item.virtualOrderDTO.virtualType == 'ou_game_online')) {
                return true;
            }
            return false;
        }

        function flush() {
            location.reload();
        }

        vm.selectStatus = false;

        //评价
        vm.gotoAssess = function (item) {
            var url = utils.getUrlWithParams("/profile/orderAssess", {
                orderId: item.id
            });
            utils.gotoUrl(url);
        };

        vm.reasonList = [];
        vm.cancelBlanknoteReason = [];
        //选择取消订单或白条的原因
        vm.reasonDialog = {
            isVisible: false,
            reasonKey: null,
            orderId: null,
            selected: false,
            //isSelecteds:[false,false,false,false],

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


        //订单取消原因   （调接口）

        vm.getReason = getReason;

        function getReason() {
            httpRequest.getReq(urlHelper.getUrl('cancelReason')).then(function (d) {
                vm.cancelCartreasonList = d.items;
            }, function (d) {

            })
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

        //取消白条的原因    （调接口）
        vm.getCancelBlanknoteReason = getCancelBlanknoteReason;

        function getCancelBlanknoteReason() {
            httpRequest.getReq(urlHelper.getUrl('cancelBlanknoteReason')).then(function (d) {
                vm.cancelBlanknoteReason = d.items;
            }, function (d) {
                //alert("调用取消白条接口失败");
            })
        }


        //取消白条或订单
        function cancelOrder(item) {
            vm.reasonDialog.orderId = item.id;
            if (item.type == 'blank_note') {
                vm.reasonList = vm.cancelBlanknoteReason;
                if (vm.cancelBlanknoteReason.length == 0) {
                    vm.commonCancel();
                } else {
                    vm.reasonDialog.openDialog(item);
                }
            } else {
                vm.reasonList = vm.cancelCartreasonList;
                if (vm.cancelCartreasonList.length == 0) {
                    vm.commonCancel();
                } else {
                    vm.reasonDialog.openDialog(item);
                }
            }
        }


        //确认框点击“确定”，实现取消白条或订单
        vm.commonCancel = function () {
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
        };

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
                vm.payDialog.params.agingBackUrl = "/profile/myorder/orderall";
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

        function repayOrder(item) {
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


        vm.cardContent = {
            isVisible: false,
            cardJsonList: null,
            openDialog: function (item) {
                httpRequest.getReq(urlHelper.getUrl('pickEntityCard'), {orderId: item.id}).then(function (d) {
                    vm.cardContent.cardJsonList = d.items[0].cardList;
                    vm.cardContent.isVisible = true;
                }, function (d) {
                    utils.error('无法提卡，' + d.msg);
                });


            },
            closeDialog: function () {
                vm.cardContent.cardJsonList = null;
                vm.cardContent.isVisible = false;
            }
        };

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
                limit: 10
            };

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
                                console.log(items[i].cardJson);
                                items[i].cardJson = JSON.parse(items[i].cardJson);
                                console.log(i);
                                console.log(items[i].cardJson);
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

        vm.getReason();
        vm.getCancelBlanknoteReason();
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
