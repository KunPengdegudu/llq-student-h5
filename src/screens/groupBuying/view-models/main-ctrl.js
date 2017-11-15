/**
 * Created by fionaqin on 2017/8/23.
 */

define([
    'screens/groupBuying/module',
    'jq',
    'screens/groupBuying/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$timeout',
        '$interval',
        '$window',
        'httpRequest',
        '$location',
        'groupBuyingUrlHelper',
        'CONSTANT_UTILS'
    ];
    function MainCtrl($rootScope, $scope, $state, $stateParams, $timeout, $interval, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/enter/main"
                },
                title: "拼团购",
                isShow: true
            }, $location);
        }

        vm.ActiveGoodsTitles = [];
        vm.goodsList = [];
        vm.showBanner = true;
        vm.showBtn = true;
        vm.choiceness = true;    //是否是"精选"（精选 —— true，其它类目 —— null）
        vm.currTime = 0;

        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        }

        vm.gotoUrl = function (url) {
            if (url) {
                utils.gotoUrl(url);
            }
        };

        vm.pageInfo = {
            carouselIndex: 0,
            imgSize: {
                width: 640,
                height: 320
            },
            styles: {
                height: "1px"
            },
            slides: [{
                id: 's1',
                url: '/blanknote/main',
                img: "../../../app/assets/imgs/groupon/image_indexptg_banner.jpg"
            }]
        }

        vm.carouseClick = carouseClick;
        function carouseClick(url) {
            if (url) {
                utils.gotoUrl(url);
            }
        }

        function carouselLoad() {


            var winWidth = jq($window).width();
            var carouseHeight = vm.pageInfo.imgSize.height * winWidth / vm.pageInfo.imgSize.width;
            vm.pageInfo.styles.height = parseInt(carouseHeight) + "px";

            httpRequest.getReq(urlHelper.getUrl('selectBanner'), {
                pageSize: 10
            }, {
                ignoreLogin: true
            }).then(function (d) {


                var slides = [];

                if (d.items) {
                    for (var i = 0; i < d.items.length; i++) {
                        var s = d.items[i];
                        slides.push({
                            id: 's' + s.id,
                            url: utils.htmlDecode(s.url),
                            img: utils.htmlDecode(s.imgUrl)
                        });
                    }
                }
                vm.pageInfo.slides = slides;

            }, function () {
            });
        }

        //头部导航
        function getPtCategory() {
            httpRequest.getReq(urlHelper.getUrl('getPtCategory'), null, {
                ignoreLogin: true
            }).then(function (d) {

                var choicenessId = null;
                var categoryArr = [{
                    id: null,
                    name: "精选"
                }];

                if (d && d.length > 0) {
                    vm.ActiveGoodsTitles = categoryArr.concat(d);
                    choicenessId = vm.ActiveGoodsTitles[0].id;

                    vm.ActiveGoodsTitles.forEach(function (item, index) {
                        item.isActive = false;
                    });
                    if (vm.ActiveGoodsTitles.length > 0) {
                        vm.ActiveGoodsTitles[0].isActive = true;
                        vm.selectedNode = vm.ActiveGoodsTitles[0];
                    }

                    getChoicenessList(choicenessId, 'add');    //获取精选类目下的商品列表
                    var titleWidth = 80 * d.length;
                    if (parseInt(titleWidth) < parseInt(jq($window).width())) {
                        vm.goodsAreaTitle = {
                            width: 100 + "%"
                        }
                    } else {
                        vm.goodsAreaTitle = {
                            width: titleWidth + "px"
                        }
                    }
                }

            });
        }

        //点击
        vm.selectGoodsNodeId = function (categoryItem) {
            vm.ActiveGoodsTitles.forEach(function (item, idx) {
                item.isActive = false;
            });
            categoryItem.isActive = true;

            vm.goodsList = [];
            vm.selectedNode = categoryItem;

            getChoicenessList(vm.selectedNode.id, 'select');    //获取相应类目下的商品列表
        };


        //获取商品列表
        vm.getChoicenessList = getChoicenessList;
        function getChoicenessList(categoryId, type) {
            if (type == 'select') {
                pageIndex = 1;
                vm.goodsList = [];
            }

            if (!categoryId) {
                vm.showBanner = true;
                vm.choiceness = true;
            } else {
                vm.showBanner = false;
                vm.choiceness = null;
            }

            httpRequest.getReq(urlHelper.getUrl('getPtProductList'), null, {
                type: 'POST',
                data: {
                    pageNo: pageIndex,
                    pageSize: 10,
                    categoryId: categoryId,
                    choiceness: vm.choiceness
                },
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;
                var itemRows = d ? d.items : [];
                itemRows.forEach(function (item, idx) {
                    if (item.exemptionPostage) {
                        item.exemptionPostageText = "包邮";
                    } else {
                        item.exemptionPostageText = "不包邮";
                    }

                    item.isBtnActive = false;

                    if (item.stock <= 0) {
                        item.tuanStatus = "拼光了";
                        item.isBtnActive = false;
                    } else {
                        item.tuanStatus = "立即开团";
                        item.isBtnActive = true;
                    }
                });

                vm.goodsList = vm.goodsList.concat(itemRows);
                if (d.items.length <= 10) {
                    vm.showBtn = false;
                } else {
                    vm.showBtn = true;
                }
            });
        }

        vm.isDialogShow = false;    //控制轮播图显示 or 隐藏
        vm.noticeAnimate = {
            timer: null,
            len: 0,
            idx: 0,
            style: {
                "margin-top": "0px"
            }
        };

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
            httpRequest.getReq(urlHelper.getUrl('getForeshowInfos'), null, {
                ignoreLogin: true
            }).then(function (d) {
                vm.currTime = d.currTime;
                if (d && d.ptTuanCarouselSimpleVOList && d.ptTuanCarouselSimpleVOList.length > 0) {
                    vm.isDialogShow = true;
                    vm.noticeLists = d.ptTuanCarouselSimpleVOList;

                    vm.noticeLists.forEach(function (item, idx) {
                        item.phoneNumber = item.phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                        if (vm.currTime && item.createTime) {
                            item.timeDiff = vm.currTime - item.createTime;
                            item.timeDiff = item.timeDiff - 1000;
                            item.dropDown = timeFormat(item.timeDiff);
                        } else {
                            item.dropDown = "0" + "秒";
                        }
                    })
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

                    if (h > 0) {
                        return h + "小时";
                    }
                    if (m > 0) {
                        return m + "分钟";
                    }
                    if (s > 0) {
                        return s + '秒';
                    }
                }
            }
        }

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

        function init() {
            carouselLoad();
            getPtCategory();
            getBroadcast();
        }

        init();
    }

});
