/**
 * Created by fionaqin on 2017/8/24.
 */
define([
    'screens/groupBuying/module',
    'jq',
    'qrcode',
    'screens/groupBuying/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ForeshowCtrl', Foreshow);


    Foreshow.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$state',
        '$stateParams',
        '$q',
        '$window',
        '$interval',
        'settingCache',
        'httpRequest',
        'groupBuyingUrlHelper',
        'CONSTANT_UTILS',
        'CONSTANT_STYLE_URL_PREFIX'
    ];
    function Foreshow($rootScope, $scope, $location, $state, $stateParams, $q, $window, $interval, settingCache, httpRequest, urlHelper, utils, urlPrefix) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "明日上新",
                isShow: true
            }, $location);
        }

        var pageIndex = 1;

        // vm.isAbnormal = false;
        vm.nextPtProductList = [];
        vm.canLoad = true;
        vm.isShow = true;


        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        /**
         * Screen reload
         */
        function reload() {
            // vm.isAbnormal = false;
            vm.nextPtProductList = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        //分页
        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();

            httpRequest.getReq(urlHelper.getUrl('getNextPtProductList'),null,{
                type: 'POST',
                data: {
                    pageNo: pageIndex,
                    pageSize: 10
                },
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;

                var nextPtProductList = d ? d.items : [];
                nextPtProductList.forEach(function (item, idx) {
                    if (item.exemptionPostage) {
                        item.exemptionPostageText = "包邮";
                    }else{
                        item.exemptionPostageText = "不包邮";
                    }

                });
                vm.nextPtProductList = vm.nextPtProductList.concat(nextPtProductList);

                if (vm.nextPtProductList.length === 0) {
                    vm.isShow = false;
                }

                if (nextPtProductList && nextPtProductList.length === 0) {
                    vm.canLoad = false;
                }

                dtd.resolve();
            }, function (err) {
                vm.isShow = false;
                dtd.reject();
            });
            return dtd.promise;

        }

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (!vm.nextPtProductList || vm.nextPtProductList.length === 0) {
                return ' ';
            }
        }

        vm.isDialogShow = false;   //控制轮播
        vm.noticeAnimate = {
            timer: null,
            len: 0,
            idx: 0,
            style: {
                "margin-top": "0px"
            }
        };

        vm.gotoProductDetails = gotoProductDetails;
        function gotoProductDetails(ptProductId, productId) {
            var url = utils.getUrlWithParams('/groupBuying/product', {
                'ptProductId': ptProductId,
                'productId': productId
            });
            utils.gotoUrl(url);
        }

        vm.gotoGrouponDetails = gotoGrouponDetails;
        function gotoGrouponDetails(item) {
            var url = utils.getUrlWithParams('/groupBuying/details', {
                tuanId: item.id,
                status: "unchange"
            });
            utils.gotoUrl(url);
        }

        function startNoticeAnimate(len) {
            if (vm.noticeAnimate.timer) {
                $interval.cancel(vm.noticeAnimate.timer);
            }

            vm.noticeAnimate.len = len;
            vm.noticeAnimate.timer = $interval(changeNoticeStyle, 4000);

            function changeNoticeStyle() {
                vm.noticeAnimate.idx = (vm.noticeAnimate.idx + 1) % vm.noticeAnimate.len;
                vm.noticeAnimate.style["margin-top"] = (vm.noticeAnimate.idx * (-30)) + "px";
            }
        }

        //轮播
        function getBroadcast() {
            httpRequest.getReq(urlHelper.getUrl('getForeshowInfos'), null,{
                ignoreLogin: true
            }).then(function (d) {
                vm.currTime = d.currTime;
                if (d && d.ptTuanCarouselSimpleVOList && d.ptTuanCarouselSimpleVOList.length > 0) {
                    vm.isDialogShow = true;
                    vm.noticeLists = d.ptTuanCarouselSimpleVOList;

                    vm.noticeLists.forEach(function (item, idx) {
                        item.phoneNumber = item.phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                        if(vm.currTime && item.createTime){
                            item.timeDiff = vm.currTime - item.createTime;

                            item.timeDiff = item.timeDiff - 1000;
                            item.dropDown = timeFormat(item.timeDiff);
                        }else{
                            item.dropDown = "0" + "秒";
                        }
                    });
                    startNoticeAnimate(d.ptTuanCarouselSimpleVOList.length);
                }
            }, function (err) {
                vm.isDialogShow = false;
            });
        }

        //时间格式处理
        function timeFormat(time) {
            if (time && time > 0) {
                var thisTime = parseInt(time);
                if (typeof (thisTime) == 'number') {
                    var s, m, h;
                    s = (parseInt(time / 1000)) % 60;
                    m = (parseInt(time / 1000 / 60)) % 60;
                    h = parseInt(time / 1000 / 60 / 60);

                    if(h>0){
                        return h + "小时";
                    }
                    if(m>0){
                        return m + "分钟";
                    }
                    if(s>0){
                        return s + '秒';
                    }
                }
            }
        }



        function init() {
            getBroadcast();
        }

        init();

    }
});