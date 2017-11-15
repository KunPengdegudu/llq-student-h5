/**
 * activity 901 controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/activity/module',
    'jq',
    'qrcode',
    'screens/activity/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ActivityaQuotaCtrl', ActivityaQuota);

    ////////
    ActivityaQuota.$inject = [
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
        'activityUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ActivityaQuota($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            timer;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '提额活动',
                isShow: true
            }, $location);
        }

        vm.gotoProduct = gotoProduct;
        function gotoProduct(item) {
            var url = null;
            if (item) {
                url = utils.getUrlWithParams('/product/detail', {
                    productId: item.productId
                })
            }
            if (url) {
                utils.gotoUrl(url);
            }
        }

        function getUlStyle() {
            var windowWidth = jq($window).width();
            var ulHeight = (windowWidth - 40) * 440 / 670;
            vm.contentWrapper = {
                'height': (ulHeight - 30) + 'px'
            };

            vm.lastHNumber = parseInt(ulHeight / 30) - 2;

            vm.noticeAnimate = {
                timer: null,
                len: 0,
                idx: 0,
                style: {
                    "margin-top": "0px"
                }
            };
        }

        function startNoticeAnimate(len) {
            if (vm.noticeAnimate.timer) {
                $interval.cancel(vm.noticeAnimate.timer);
            }

            vm.noticeAnimate.len = len;
            vm.noticeAnimate.timer = $interval(changeNoticeStyle, 2000);

            function changeNoticeStyle() {
                vm.noticeAnimate.idx = (vm.noticeAnimate.idx + 1) % vm.noticeAnimate.len;
                vm.noticeAnimate.style["margin-top"] = (vm.noticeAnimate.idx * (-30)) + "px";
            }
        }


        //初始题额信息函数
        function findProductsByPromotion() {
            httpRequest.getReq(urlHelper.getUrl('findProductsByPromotion'), {
                promotionId: 273
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items.length > 0) {
                    vm.productList = d.items;

                    for (var i = 0; i < d.items.length; i++) {
                        var proImgList = [];
                        for (var j = 0; j < d.items[i].proImgList.length; j++) {
                            if (d.items[i].proImgList[j].type == 'sub') {
                                proImgList.push(d.items[i].proImgList[j]);
                            }
                        }

                        vm.productList[i].imgList = proImgList.slice(0, 3);
                        //vm.productList[i].name = utils.htmlDecode(d.items[i].name);
                        if (i % 3 == 0) {
                            vm.productList[i].productTitleSrc = '../../../app/assets/imgs/active_quota/activity_subscript.png';
                            vm.productList[i].productTitleIcon = '../../../app/assets/imgs/active_quota/activity_icon1.png';
                            vm.productList[i].productStyle = {
                                backgroundColor: '#ffcc33'
                            };
                        }
                        if (i % 3 == 1) {
                            vm.productList[i].productTitleSrc = '../../../app/assets/imgs/active_quota/activity_subscript2.png';
                            vm.productList[i].productTitleIcon = '../../../app/assets/imgs/active_quota/activity_icon2.png';
                            vm.productList[i].productStyle = {
                                backgroundColor: '#8e8ecc'
                            };
                        }
                        if (i % 3 == 2) {
                            vm.productList[i].productTitleSrc = '../../../app/assets/imgs/active_quota/activity_subscript3.png';
                            vm.productList[i].productTitleIcon = '../../../app/assets/imgs/active_quota/activity_icon3.png';
                            vm.productList[i].productStyle = {
                                backgroundColor: '#d8a3b2'
                            };
                        }

                    }
                }
            }, function (err) {
                utils.error(err.msg || '服务器忙，请稍后再试');
            })
        }

        vm.userShowCount = 0;
        function countProOrderByPromotion() {
            httpRequest.getReq(urlHelper.getUrl('countProOrderByPromotion'), {
                promotionId: 273
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d) {
                    vm.userShowCount = d;
                }
            })
        }

        function findProOrderByPromotion() {
            httpRequest.getReq(urlHelper.getUrl('findProOrderByPromotion'), {
                promotionId: 273
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items.length > 0) {
                    vm.userShowList = d.items;
                    for (var i = 0; i < d.items.length; i++) {
                        vm.userShowList[i].productName = utils.htmlDecode(d.items[i].productName)
                    }
                    if (vm.userShowList.length > vm.lastHNumber) {
                        var animateNo = vm.userShowList.length - vm.lastHNumber;
                        startNoticeAnimate(animateNo)
                    }
                }
            })
        }

        function init() {
            findProductsByPromotion();
            countProOrderByPromotion();
            findProOrderByPromotion();
            getUlStyle();
        }

        init();


    }

});