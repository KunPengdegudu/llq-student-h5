/**
 * profile my order sale controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileMyOrderSaleCtrl', ProfileMyOrderSale);

    ////////
    ProfileMyOrderSale.$inject = [
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
    function ProfileMyOrderSale($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
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

        vm.cardContent = {
            isVisible: false,
            cardJsonList: null,
            openDialog: function (item) {
                httpRequest.getReq(urlHelper.getUrl('pickEntityCard'),{orderId:item.id}).then(function(d){
                    vm.cardContent.cardJsonList=d.items[0].cardList;
                    vm.cardContent.isVisible = true;
                },function(d){
                    utils.error('无法提卡，'+d.msg);
                });


            },
            closeDialog: function () {
                vm.cardContent.cardJsonList = null;
                vm.cardContent.isVisible = false;
            }
        };

        function isCartType(item) {
            if (item.orderDetails) {
                return true;
            }
            return false;
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


        function flush() {
            location.reload();
        }

        vm.reasonList=[];
        //选择取消订单的原因
        vm.reasonDialog = {
            isVisible: false,
            reasonKey:null,
            orderId:null,
            selected:false,
            isSelecteds:[false,false,false,false],
            newSelecteds:[],

            openDialog: function (item) {
                vm.reasonDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.reasonDialog.isVisible = false;
            },
            submitReason: function () {
                for(var i=0;i<vm.reasonDialog.isSelecteds.length;i++){
                    if(vm.reasonDialog.isSelecteds[i]==true){
                        // console.log(i);   //被选中的下标
                        vm.reasonDialog.newSelecteds.push(vm.reasonList[i].reasonKey);  //追加数据到数组
                    }
                }
                if(!vm.reasonDialog.reasonKey){
                    utils.alert("请选择取消订单的原因");
                    return false;
                }

                var params = {
                    order_id:vm.reasonDialog.orderId ,
                    reasonKey:vm.reasonDialog.reasonKey
                };
                httpRequest.getReq(urlHelper.getUrl('cancelOrder'), params)
                    .then(function (d) {
                        utils.alert("取消订单成功", flush);


                    }, function (d) {
                        utils.error("取消订单失败：" + d.msg);
                    });
            },
            chooseReason: function (item) {
                vm.reasonDialog.reasonKey=item;
                vm.reasonDialog.selected = true;
            },

            //原因多选
            isChoose:function(index,item){
                vm.reasonDialog.reasonKey=item;
                vm.reasonDialog.selected = true;
                //console.log(index);
                if(vm.reasonDialog.isSelecteds[index]){
                    vm.reasonDialog.isSelecteds[index] = false;
                }else{
                    vm.reasonDialog.isSelecteds[index] = true;
                }
            }
        };

        vm.remindSeller=remindSeller;
        function remindSeller(item){
            httpRequest.getReq(urlHelper.getUrl('remindSellerSendGoods'),{orderId:item.id}).then(function(d){
                utils.alert('提醒卖家发送消息成功');
            },function(d){
                utils.error(d.msg);
            })
        }

        //订单取消原因   （调接口）
        vm.getReason = getReason;

        function getReason() {
            httpRequest.getReq(urlHelper.getUrl('cancelReason')).then(function (d) {
                vm.reasonList = d.items;
            }, function (d) {

            })
        }



        //取消订单
        function cancelOrder(item) {
            vm.reasonDialog.orderId=item.id;
            if(vm.reasonList.length==0){
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
            }else{
                vm.reasonDialog.openDialog(item);
            }

        }

        //跳转到评价页面
        vm.gotoEvaluateDetail = gotoEvaluateDetail;
        vm.gotoAddEvaluateDetail = gotoAddEvaluateDetail;

        function gotoEvaluateDetail(orderId) {
            var url = utils.getUrlWithParams('/profile/orderAssess', {
                orderId:orderId
            });
            utils.gotoUrl(url);
        }
        function gotoAddEvaluateDetail(orderId) {
            var url = utils.getUrlWithParams('/profile/orderAssess', {
                orderId:orderId,
                isAdd:true
            });
            utils.gotoUrl(url);
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
                vm.payDialog.params.agingBackUrl = "/profile/myorder/ordersale";
                vm.payInfo.open();
            }
        };

        vm.getSellerName = function (item) {
            var orderNo = "订单号：" + item.orderNo;

            if (item.type=='blank_note') {
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
                'goBack': "/profile/myorder/ordersale"
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
                if (d.trace && d.trace.traces && d.trace.traces.length>0) {
                    vm.traceDialog.hasTraceItems = true;
                }
                vm.traceDialog.openDialog();
            }, function() {
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
                type: 'sale'
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
