/**
 * order detail main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/product/module',
    'jq',
    'screens/product/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProductOrderDetailCtrl', ProductOrderDetail)
        .filter("deliveryType", function () {
            return function (d, deliveryPrice) {
                var rtn = d;
                if (d !== undefined && d !== null) {
                    switch (d) {
                        case "take_their" :
                            rtn = '自提：0元';
                            break;
                        case "visit" :
                            rtn = '送货上门：0元';
                            break;
                        case "express" :
                            rtn = '快递：' + deliveryPrice + '元';
                            break;
                    }
                }
                return rtn;
            }
        })
        .filter("deliveryTypeName", function () {
            return function (d) {
                var rtn = d;
                if (d !== undefined && d !== null) {
                    switch (d) {
                        case "take_their" :
                            rtn = '自提';
                            break;
                        case "visit" :
                            rtn = '送货上门';
                            break;
                        case "express" :
                            rtn = '快递';
                            break;
                    }
                }
                return rtn;
            }
        });

    ////////
    ProductOrderDetail.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$location',
        '$q',
        'httpRequest',
        'productUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProductOrderDetail($rootScope, $scope, $stateParams, $location, $q, httpRequest, urlHelper, utils) {
        var vm = $scope;

        var _orderId = $stateParams.order_id,
            _goBack = $stateParams.goBack;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: _goBack
                },
                title: "订单详情",
                isShow: true
            }, $location);
        }

        vm.requestParam = {};
        vm.isAbnormal = false;

        vm.data = {};

        vm.showFlag = {
            bySelf: false,
            byAddr: false
        };

        //vm.id_no = "";
        vm.address = {};

        vm.gotoProduct = function (product) {
            var url = utils.getUrlWithParams("/product/detail", {
                productId: product.productId,
                promotionType: 'aging'
            });
            utils.gotoUrl(url);
        };

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

        vm.reload = reload;

        vm.showContentType = null;

        vm.isOtherType = isOtherType;
        vm.isRechargeType = isRechargeType;
        vm.isBlankNote = isBlankNote;

        vm.getFullAddress = function (item) {
            var addr = "";

            if(!vm.address){
                return '';
            }
            if (item.provinceName) {
                addr += item.provinceName;
            }

            if (item.cityName) {
                addr += item.cityName;
            }

            if (item.areaName) {
                addr += item.areaName;
            }

            if (item.address) {
                addr += item.address;
            }

            return addr;
        };

        function isBlankNote(showContentType) {
            return (showContentType == 'blank_note');
        }

        function isOtherType(showContentType) {
            if (isBlankNote(showContentType) || isRechargeType(showContentType)) {
                return false;
            }
            return true;
        }

        function isRechargeType(showContentType) {
            if (showContentType == 'of_mobile' || showContentType == 'ou_game_online') {
                return true;
            }
            return false;
        }

        function initDeliveryType(d) {
            if (d.deliveryType == 'take_their') {
                vm.showFlag.bySelf = true;
                vm.showFlag.byAddr = false;

                // 身份证号码
                //httpRequest.getReq(urlHelper.getUrl('getUserInfo'))
                //    .then(function (d) {
                //        vm.id_no = d.idNo;
                //    });
            } else {
                vm.showFlag.bySelf = false;
                vm.showFlag.byAddr = true;

                vm.address = d.shippingAddress;
            }

        }

        function initType(d) {

            vm.showContentType = d.type;
            if (d.virtualOrderDTO) {
                vm.showContentType = d.virtualOrderDTO.virtualType;
            }

        }

        function showTraceFn(status) {
            if (status == "wait_delivery"
                || status == "confirm_delivery"
                || status == "finished"
                || status == "aging_ing") {
                return true;
            }
            return false;
        }

        vm.traceDialog = {
            isVisible: false,
            openDialog: function () {
                vm.traceDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.traceDialog.isVisible = false;
            }
        };
        vm.cardJson = null;
        vm.traceInfo = {};
        vm.showTrace = false;
        vm.hasTraceItems = false;

        function reload() {
            vm.requestParam = $stateParams;
            httpRequest.getReq(urlHelper.getUrl('getOrder'), {
                order_id: vm.requestParam.order_id
            }).then(function (d) {
                vm.data = d;
                initDeliveryType(d);
                initType(d);

                if (d.canShare == true) {
                    httpRequest.getReq(urlHelper.getUrl('getAvailableOne'), null, {ignoreLogin: true}).then(function (d) {
                        if (d && d.id) {
                           var ctTime=new Date(vm.data.createTime);
                            if(ctTime<d.beginTime || ctTime>d.endTime){
                                vm.data.canShare=false;
                            }
                        }else{
                            vm.data.canShare=false;
                        }
                    }, function (d) {
                        vm.share.isVisible = false;
                    })
                }
                if (showTraceFn(d.status) && d.deliveryType == 'express') {
                    vm.showTrace = true;
                    httpRequest.getReq(urlHelper.getUrl('trace'), {
                        orderId: d.id
                    }).then(function (d) {
                        vm.traceInfo = d;

                        if (d && d.trace && d.trace.traces && d.trace.traces.length > 0) {
                            vm.hasTraceItems = true;
                        }
                    });
                }
                if (vm.data.entityCard == true && vm.data.entityCardInfo) {
                    vm.cardJson = utils.htmlDecode(vm.data.entityCardInfo);
                    vm.cardJson = JSON.parse(vm.cardJson);
                }
            });

        }

        vm.cardContent = {
            isVisible: false,
            cardJsonList: null,
            openDialog: function (item) {
                if (vm.cardJson) {
                    vm.cardContent.cardJsonList = vm.cardJson.cardList;
                    vm.cardContent.isVisible = true;
                }
                else {
                    httpRequest.getReq(urlHelper.getUrl('pickEntityCard'), {orderId: item.id}).then(function (d) {
                        vm.cardContent.cardJsonList = d.items[0].cardList;
                        vm.cardContent.isVisible = true;
                    }, function (d) {
                        utils.error('抱歉，无法提卡，' + d.msg);
                    })
                }

            },
            closeDialog: function () {
                vm.cardContent.cardJsonList = null;
                vm.cardContent.isVisible = false;
            }
        };

        vm.share = {
            isVisible: false,
            themeResourceId: null,
            envelopeTitle:'分享给好友领取现金',
            title: null,
            summary: null,
            smallPicUrl:null,
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
        vm.shareRed = shareRed;
        function shareRed() {
            httpRequest.getReq(urlHelper.getUrl('getThemeResource'), {orderId: _orderId}, {ignoreLogin: true}).then(function (d) {
                vm.share.themeResourceId = d.id;
                if(d.theme.shareRedEnvelopeTitle){
                    vm.share.envelopeTitle=d.theme.shareRedEnvelopeTitle
                }
                vm.share.title = d.theme.title ? d.theme.title : '零零期红包';
                vm.share.summary = d.theme.summary ? d.theme.summary : '红包分享';
                vm.share.smallPicUrl=d.theme.smallPicUrl?d.theme.smallPicUrl:1;
                vm.share.openDialog();
            }, function (d) {
            })
        }


        vm.shareFn = shareFn;
        function shareFn(type) {
            if (type == 'friend') {
                vm.allowShareItems[1].fn();
            } else {
                vm.allowShareItems[0].fn();
            }
        }

        function init() {
            vm.requestParam = $stateParams;
            var unWatch = vm.$watch('requestParam', reload, true);
            vm.$on('$destroy', function () {
                unWatch();
            });
        }

        init();
    }

});