/**
 * activity 901 controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/activeCenter/module',
    'jq',
    'qrcode',
    'screens/activeCenter/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('activeCenterCouponCtrl', activeCenterCoupon);

    ////////
    activeCenterCoupon.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'activeMainUrlHelper',
        'CONSTANT_UTILS'
    ];
    function activeCenterCoupon($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            reactNative = window.reactNativeInject,
            timeNode = parseInt(new Date(Date.parse('2017-08-15 18:30:00'.replace(/-/g, "/"))).getTime());     //零零期app  fromLLQApp

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "整点抢券",
                isShow: true
            }, $location);
        }

        //if (reactNative && reactNative == "fromLLQApp") {
        //    $rootScope.navConfig.isShow = false;
        //    vm.activeCenter = {
        //        'position': 'absolute',
        //        'top': 0
        //    }
        //}


        function doQueryWidetNodetree() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), {
                widgetCode: 'WX012'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.nodeTree.length > 0) {
                    d.nodeTree.forEach(function (item, idx) {
                        doQueryData(item)
                    })
                }
            })
        }

        vm.productAreaList = [];
        function doQueryData(node) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                widgetCode: 'WX012',
                nodeId: node.nodeId,
                limit: 10,
                offset: 1
            }, {
                ignoreLogin: true
            }).then(function (d) {
                node.templateGoodsList = [];
                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        item.name = utils.htmlDecode(item.name);
                        if (item.mainProImgUrl) {
                            item.mainProImgUrl = utils.htmlDecode(item.mainProImgUrl);
                        }
                        node.templateGoodsList.push(item);
                    });
                }
                vm.productAreaList.push(node);
            });
        }

        vm.sysTemTime = null;
        function getTimeForNow() {
            httpRequest.getReq(urlHelper.getUrl('getTimestamp'), null, {
                ignoreLogin: true
            }).then(function (d) {
                getTimeNode(d);
                vm.sysTemTime = d;
                if (d >= timeNode) {
                    vm.showTimeDown = false;
                    vm.inActive = true;
                }
            })
        }

        vm.showTimeDown = true;

        vm.inActive = false;
        function getTimeNode(systemTime) {
            var times = [{
                startTime: '2017-08-15 12:00:00',
                endTime: '2017-08-15 12:15:00',
                title: '12:00'
            }, {
                startTime: '2017-08-15 14:00:00',
                endTime: '2017-08-15 14:15:00',
                title: '14:00'
            }, {
                startTime: '2017-08-15 16:00:00',
                endTime: '2017-08-15 16:15:00',
                title: '16:00'
            }, {
                startTime: '2017-08-15 18:00:00',
                endTime: '2017-08-15 18:15:00',
                title: '18:00'
            }];

            for (var i = 0; i < times.length; i++) {
                var item = times[i], countDown = 0;
                item.startTimeStamp = parseInt(new Date(Date.parse(item.startTime.replace(/-/g, "/"))).getTime());
                item.endTimeStamp = parseInt(new Date(Date.parse(item.endTime.replace(/-/g, "/"))).getTime());

                if (systemTime > item.startTimeStamp && systemTime < item.endTimeStamp) {
                    vm.inActive = true;
                }

                if (systemTime < item.startTimeStamp) {
                    vm.showTitle = item.title;
                    countDown = parseInt((item.startTimeStamp - systemTime) / 1000);

                    $interval(function () {
                        if (typeof (countDown) == 'number') {
                            countDown--;
                            hourglass(countDown);
                        }

                    }, 1000);
                    break;
                }
            }
        }

        function hourglass(seconds) {
            var s, m, minutes, h;
            s = parseInt(seconds % 60);
            minutes = parseInt((seconds - s) / 60);
            m = parseInt(minutes % 60);
            h = parseInt((minutes - m) / 60);

            vm.showHour = (h > 9) ? h : ('0' + h);
            vm.showMinute = (m > 9) ? m : ('0' + m);
            vm.showSecond = (s > 9) ? s : ('0' + s);
        };


        function getCouponList() {
            vm.couponArea = [{
                title: '手机券专区',
                time: '使用时间:8.16-8.17',
                btnText: "逛一逛手机",
                isShow: true,
                fn: function () {
                    gotoUrl('/activeCenter/goods')
                },
                couponRows: [{
                    title: '自营店手机专用券',
                    tag: null,
                    couponList: [{
                        amount: 100,
                        id: 462,
                        type: "shop_coupon",
                        ruleDescList: ['购物满4000元可用']
                    }, {
                        amount: 50,
                        id: 463,
                        type: "shop_coupon",
                        ruleDescList: ['购物满2000元可用']
                    }, {
                        amount: 20,
                        id: 464,
                        type: "shop_coupon",
                        ruleDescList: ['购物满1000元可用']
                    }]
                }, {
                    title: '全场手机通用券',
                    tag: '818sjyh',
                    couponList: []
                }]
            }, {
                title: '美妆券专区',
                time: '使用时间:8.17-8.18',
                btnText: "逛一逛美妆",
                isShow: true,
                fn: function () {
                    gotoUrl('/activeCenter/kaola')
                },
                couponRows: [{
                    title: '网易考拉美妆专用券',
                    tag: '818klmz',
                    couponList: []
                }, {
                    title: '全场美妆通用券',
                    tag: '818mzyh',
                    couponList: []
                }]
            }, {
                title: "数码券专区",
                time: '使用时间:8.17-8.18',
                btnText: '逛一逛数码',
                isShow: true,
                fn: function () {
                    gotoUrl('/activeCenter/jd')
                },
                couponRows: [{
                    title: '网易考拉数码专用券',
                    tag: '818klsm',
                    couponList: []
                }, {
                    title: '京东数码通用券',
                    tag: '818jdsm',
                    couponList: []
                }]
            }, {
                title: "全场通用券专区",
                time: '抢券时间:8.18-8.20',
                btnText: '逛一逛全场',
                isShow: false,
                fn: function () {
                    gotoUrl('/activeCenter/main?name=818扒光节')
                },
                couponRows: [{
                    title: '优惠券',
                    tag: '818qcyh',
                    couponList: []
                }, {
                    title: '购物免息券',
                    tag: '818qcmx',
                    couponList: []
                }]
            }];
            vm.couponArea.forEach(function (item, idx) {
                item.couponRows.forEach(function (itemCoupon, index) {
                    if (itemCoupon.tag) {
                        httpRequest.getReq(urlHelper.getUrl('availableList'), {
                            tag: itemCoupon.tag
                        }, {
                            ignoreLogin: true
                        }).then(function (d) {
                            itemCoupon.couponList = d.items;
                        })
                    }
                });
                var allCouponTime = parseInt(new Date(Date.parse('2017-08-18 00:00:00'.replace(/-/g, "/"))).getTime());
                if (idx == 3) {
                    if (vm.sysTemTime && vm.sysTemTime > allCouponTime) {
                        item.isShow = true;
                    }
                }
            })
        }

        function gotoUrl(url) {
            if (url) {
                utils.gotoUrl(url);
            }
        }

        vm.getRed = getRed;
        function getRed(item) {
            if (vm.inActive) {
                httpRequest.getReq(urlHelper.getUrl("couponReceive"), {
                    'couponId': item.id,
                    'couponType': item.type
                }).then(function (d) {

                    utils.customDialog('温馨提示', '您已领取成功，前往查看', '前往查看,取消', function (buttonIndex) {
                        if (buttonIndex == 1) {
                            gotoRed(item)
                        }
                    });
                }, function (d) {
                    utils.alert(d.msg || '领取失败')
                })
            } else {
                utils.alert('活动暂未开始，请耐心等候');
            }

        }

        vm.gotoRed = gotoRed;
        function gotoRed(item) {
            var url = '';
            if (item && item.couponType == 'shop_coupon') {
                url = '/profile/coupon/notUsed';
            } else {
                url = '/profile/red/notUsed'
            }
            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage(url);
            } else {
                //$window.location.href = windowLocation + url;
                utils.gotoUrl(url);
            }
        }

        vm.gotoProductDetail = gotoProductDetail;
        function gotoProductDetail(item) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: item.productId,
                promotionId: item.promotionId,
                promotionType: item.promotionType
            });

            if (window.reactnativeInject && window.reactnativeInject == "fromLLQApp") {
                window.postMessage(url);
            } else {
                //$window.location.href = windowLocation + url;
                utils.gotoUrl(url);
            }
        }

        //返回到顶部
        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        };
        function init() {
            getTimeForNow();
            doQueryWidetNodetree();
            getCouponList();
        }

        init();
    }
});