define([
    'screens/product/module',
    'jq',
    'screens/product/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProductPaySuccessCtrl', ProductPaySuccess);

    ////////
    ProductPaySuccess.$inject = [
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
    function ProductPaySuccess($scope, $rootScope, $stateParams, $location, $timeout, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope;

        var DO_QUERY_RECOMMEND_DATA_BY_USER = '/recommend/doQueryRecommandDataByUser.json';

        var _bill_no = $stateParams.billNo,
            _money = $stateParams.money,
            _payResult = $stateParams.payResult,
            _text = $stateParams.text ? $stateParams.text : '订单支付成功',
            _pay_type = $stateParams.payType,
            _order_id = $stateParams.orderId,
            _schedule_no = $stateParams.scheduleNo;

        if (_payResult == 'failed') {
            _text = '订单支付失败';
        }
        if (_payResult == 'wait_pay_result') {
            _text = '等待支付结果';
        }
        vm.rate = $stateParams.rate;
        vm.period = $stateParams.period;

        vm.payResult = _payResult;
        vm.count = parseInt($stateParams.count);
        vm.countLimit = 10;
        vm.remark = null;

        vm.showCashContent = false;

        vm.shareFn = shareFn;
        var currentUrl = utils.getUrlWithParams("/product/paysuccess", {
            billNo: $stateParams.billNo,
            money: $stateParams.money,
            text: $stateParams.text
        });

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: _text,
                currentUrl: currentUrl,
                isShow: true
            }, $location);
        }

        vm.getThemeUrl = 'getThemeResource';
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
        vm.paySuccess = {
            amount: _money,
            gotoEnter: function () {
                utils.gotoUrl('/enter/main');
            },
            gotoSuccess: function () {
                if (_pay_type == 'repay') {

                    if (_bill_no) {
                        var url = utils.getUrlWithParams('/profile/billdetail', {
                            'billNo': _bill_no
                        });
                        utils.gotoUrl(url);
                    } else {
                        utils.gotoUrl('/profile/mybill/billcurrent');
                    }

                } else {

                    if (_order_id) {
                        var url = utils.getUrlWithParams('/product/orderdetail', {
                            'order_id': _order_id,
                            'goBack': '/profile/myorder/orderall'
                        });
                        utils.gotoUrl(url);
                    } else {
                        utils.gotoUrl('/profile/myorder/orderall');
                    }

                }
            },
            getProduct: function () {
                httpRequest.getReq(DO_QUERY_RECOMMEND_DATA_BY_USER, {
                    limit: 10,
                    offset: 1
                }).then(function (d) {
                    var items = d.items;

                    if (items && items.length <= 1) {
                        vm.canLoad = false;
                    }

                    var item = jq.extend({
                        rows: []
                    });

                    for (var i = 0; i < items.length;) {
                        var row = [];
                        row.push(items[i++]);

                        if (i >= items.length + 1) {
                            break;
                        } else {
                            row.push(items[i++]);
                        }
                        item.rows.push(row);
                    }


                    vm.items = item.rows;
                })
            }
        };

        vm.gotoProductDetail = gotoProductDetail;

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            utils.gotoUrl(url);
        }

        vm.selectItem = null;

        vm.toggleAutoRepay = function (item) {

            vm.selectItem = item;

            var checked = vm.checkAutoRepay(item);

            if (checked) {
                // 取消
                repayCancelSign();
            } else {
                // 绑定
                vm.bankCardList.openDialog();
            }
        };
        vm.doApply = doApply;
        function doApply(url) {
            utils.gotoUrl(url);
        }
        vm.canSignAutoRepay = function (item) {

            if (!item) {
                return false;
            }

            var autoRepaySignStatus = item.autoRepaySignStatus;
            if (utils.isEmpty(autoRepaySignStatus) || autoRepaySignStatus === 'un_sign' || autoRepaySignStatus === 'sign_failed') {
                return true;
            }
            return false;
        };

        vm.checkAutoRepay = function (item) {
            return item && (item.autoRepaySignStatus === 'signed');
        };

        vm.selectedCardFn = function (item) {
            var selectItem = vm.selectItem;
            if (selectItem) {
                selectItem.userFundAccountId = item.userFundAccountId;
                repaySign();
            }
        };

        function repaySign() {
            var item = vm.selectItem;
            httpRequest.getReq(urlHelper.getUrl('repaySign'), {
                bill_no: _bill_no,
                userFundAccountId: item.userFundAccountId
            }).then(function (d) {
                item.autoRepaySignStatus = d.autoRepaySignStatus;
                item.autoRepayAccNo = d.autoRepayAccNo;
                utils.alert("亲，您的绑定代扣申请已经提交！");
            }, function (d) {
                if (d.msg) {
                    utils.error(d.msg);
                } else {
                    utils.error("绑定代扣功能失败，请重试！");
                }

            });
        }

        function repayCancelSign() {
            var item = vm.selectItem;
            utils.confirm("亲，是否要取消该账单的代扣功能？", function () {
                httpRequest.getReq(urlHelper.getUrl('repayCancelSign'), {
                    bill_no: _bill_no
                }).then(function (d) {
                    item.autoRepaySignStatus = "";
                    item.autoRepayAccNo = null;
                    utils.alert("亲，您的绑定代扣申请已经取消！");
                }, function (d) {
                    utils.error(d.msg || "取消代扣功能失败，请重试！");
                });
            });
        }
        vm.applyBot = function () {
            httpRequest.getReq(urlHelper.getUrl('isAutoRepay'))
                .then(function (d) {
                    vm.applyBotInfo = d;
                })
        }
        function init() {
            vm.paySuccess.getProduct();
            vm.applyBot();
            // 还款
            if (_bill_no) {
                httpRequest.getReq(urlHelper.getUrl('getBillDetail'), {
                    'billNo': _bill_no
                }).then(function (d) {
                    vm.selectItem = d;
                }, function (d) {

                });
            }

            if (_order_id) {
                httpRequest.getReq(urlHelper.getUrl('getUserProductCash'), {
                    'productOrderNo': _order_id
                }).then(function (d) {
                    if (d && d.cashApplyType) {
                        if (_payResult == 'failed') {
                            vm.showCashContent = false;
                        } else {
                            vm.showCashContent = true;
                        }
                    } else {
                        vm.showCashContent = false;
                    }
                })
            }

            // httpRequest.getReq(urlHelper.getUrl('getAvailableOne'),{},{ignoreLogin:true}).then(function(d){
            //     if (d&&d.id) {
            //         var param={};
            //         if(_order_id){
            //             param.orderId=_order_id;
            //             vm.getThemeUrl='getThemeResource'
            //         }
            //         if(_schedule_no){
            //             param.scheduleNo=_schedule_no;
            //             vm.getThemeUrl='getRepayThemeResource'
            //         }
            //         httpRequest.getReq(urlHelper.getUrl(vm.getThemeUrl),param,{ignoreLogin:true}).then(function(d){
            //             if(d.theme.shareRedEnvelopeTitle){
            //                 vm.share.envelopeTitle=d.theme.shareRedEnvelopeTitle;
            //             }
            //             vm.share.isVisible=true;
            //             vm.share.themeResourceId=d.id;
            //             vm.share.title=d.theme.title?d.theme.title:'零零期红包';
            //             vm.share.summary=d.theme.summary?d.theme.summary:'红包分享';
            //             vm.share.smallPicUrl=d.theme.smallPicUrl?d.theme.smallPicUrl:1;
            //         },function(d){
            //
            //         })
            //     }else{
            //         vm.share.isVisible=false;
            //     }
            // },function(d){
            //     vm.share.isVisible=false;
            // });

        }

        function shareFn(type) {
            if (type == 'friend') {
                vm.allowShareItems[1].fn();
            } else {
                vm.allowShareItems[0].fn();
            }
        }

        init();

    }

});
