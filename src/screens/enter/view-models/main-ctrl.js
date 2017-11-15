/**
 * enter main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/enter/module',
    'jq',
    'qrcode',
    'screens/enter/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('EnterMainCtrl', Enter);

    ////////
    Enter.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        '$window',
        '$loadingOverlay',
        '$timeout',
        '$interval',
        'httpRequest',
        'settingCache',
        'enterUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function Enter($rootScope, $scope, $location, $q, $window, $loadingOverlay, $timeout, $interval, httpRequest, settingCache, urlHelper, constant, utils) {
        var vm = $scope,
            carouseHeight = 0,
            loadingTimer,
            lastHeaderAlpha = 0,
            pageIndex = 0,
            pageInfo = [{
                type: 'carousel',
                url: "queryBanners",
                cls: 'page-no-gap',
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
                    img: "../../assets/imgs/banner/banner1.png"
                }],
                load: carouselLoad
            }, {
                type: 'nav',
                cls: 'page-no-gap',
                num: 5,
                styles: {
                    height: "85px"
                },
                itemStyles: {
                    width: "20%"
                },
                url: 'queryMenuIcon',
                load: navLoad
            }, {
                type: 'notice',
                cls: 'page-no-gap page-notice',
                load: noticeLoad
            }, {
                type: 'banner',
                cls: 'page-no-gap',
                url: "queryActivity",
                imgSize: {
                    width: 640,
                    height: 130
                },
                styles: {
                    height: "1px"
                },
                load: bannerLoad
            }, {
                type: 'block3',
                moreUrl: '/sale/main?promotionType=aging&promotionId=45',
                promotionType: 'aging',
                promotionId: 45,
                url: 'listPagedProductInfoFromSearch',
                load: saleLoad
            }, {
                type: 'block3_main',
                cls: 'page-no-gap',
                url: 'queryAdMain',
                load: mainLoad
            }, {
                type: 'today_floor',
                cls: 'page-no-gap',
                url: 'doQueryWidgets',
                load: todayLoad
            }, {
                type: 'block3_floor',
                cls: 'page-no-gap',
                url: 'listAllGategory',
                load: floorLoad
            }, {
                type: 'block2_guess',
                cls: 'page-no-gap',
                url1: 'listPagedProductInfoFromSearch',
                url2: 'doQueryRecommandDataByUser',
                load: guessLoad
            }
            ];

        var TEMPLATE_MAP = {
            'nav': 'screens/enter/views/nav-tpl.html',
            'notice': 'screens/enter/views/notice-tpl.html',
            'carousel': 'screens/enter/views/carouse-tpl.html',
            'block3': 'screens/enter/views/block3-tpl.html',
            'block3_aging': 'screens/enter/views/block3-aging-tpl.html',
            'block3_main': 'screens/enter/views/block3-main-tpl.html',
            'today_floor': 'screens/enter/views/today-tpl.html',
            'block3_floor': 'screens/enter/views/block3-floor-tpl.html',
            'block2_guess': 'screens/enter/views/block2-guess-tpl.html',
            'banner': 'screens/enter/views/banner-tpl.html'
        };

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                headerType: 'homepage',
                leftBtnAttrs: {
                    fn: inviteFriends
                }
            }, $location);
        }

        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.loaderComplete = loaderComplete;
        vm.getMsg = getMsg;

        vm.gotoMore = gotoMore;
        vm.gotoNav = gotoNav;

        vm.gotoProductDetail = gotoProductDetail;

        vm.carouseClick = carouseClick;

        vm.guessIndex = 1;

        vm.getTemplate = getTemplate;

        vm.scrollToTop = scrollToTop;

        // vm.saleTimeShow = {
        //     showCountDown: false,
        //     hint: '',
        //     time: 0,
        //     saleTimer: null,
        //     text: ["00", "00", "00"]
        // };

        function getTemplate(type) {
            return TEMPLATE_MAP[type];
        }


        // share
        vm.qrCodeDialog = {
            isVisible: false,
            openDialog: function () {
                vm.qrCodeDialog.isVisible = true;
            }
        };
        vm.shareUrl = "http://www.007fenqi.com/w/common/register_redirect_page.html";
        vm.share = share;

        function shareWeixin(type) {
            var Wechat = navigator.wechat;

            if (Wechat) {
                Wechat.isInstalled(function (installed) {
                    if (installed) {

                        var param = {};

                        switch (type) {
                            case "weixin":
                                param.scene = Wechat.Scene.SESSION;
                                break;
                            case "timeline":
                                param.scene = Wechat.Scene.TIMELINE;
                                break;
                            default:
                                break;
                        }

                        param.message = {
                            title: constant.DEFAULT_SHARE_INFO.title,
                            description: constant.DEFAULT_SHARE_INFO.description,
                            thumb: constant.DEFAULT_SHARE_INFO.thumb,
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: vm.shareUrl
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

        function share(type) {
            switch (type) {
                case "weixin":
                case "timeline":
                    shareWeixin(type);
                    break;
                default:
                    break;
            }
        }

        function inviteFriends() {
            document.getElementById("qrcode").innerHTML = "";
            httpRequest.getReq(urlHelper.getUrl('getSpreeSpreadUrl'))
                .then(function (d) {
                    var qr_code = new qrcode(document.getElementById("qrcode"), {
                        width: 150,
                        height: 150
                    });
                    vm.shareUrl = utils.htmlDecode(d, true);
                    qr_code.makeCode(vm.shareUrl);
                    vm.qrCodeDialog.openDialog();
                });
        }

        function gotoMore(url) {
            utils.gotoUrl(url);
        }

        function gotoNav(url) {
            utils.gotoUrl(url);
        }

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            utils.gotoUrl(url);
        }

        vm.gotoTemplate = function (widgetCode, name) {

            httpRequest.getReq(urlHelper.getUrl("doQueryWidetNodetree"), {
                widgetCode: widgetCode
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var nodeId = d.nodeTree[0].nodeId;
                var templateUrl = '';
                if (d.widgetViewInfo && d.widgetViewInfo.tempalteType) {
                    if (d.widgetViewInfo.tempalteType == 'list_no_banner') {
                        templateUrl = utils.getUrlWithParams('/template/commonStyle', {
                            widgetCode: widgetCode,
                            name: name,
                            nodeId: nodeId
                        });
                    }
                    if (d.widgetViewInfo.tempalteType == 'list_with_banner') {
                        templateUrl = utils.getUrlWithParams('/template/main', {
                            widgetCode: widgetCode,
                            name: name,
                            nodeId: nodeId
                        });
                    }
                    if (d.widgetViewInfo.tempalteType == 'floor_with_banner') {
                        templateUrl = utils.getUrlWithParams('/template/floorStyle', {
                            widgetCode: widgetCode,
                            name: name
                        });
                    }
                    utils.gotoUrl(templateUrl);
                }


            });

        };

        // Page Load

        function getFloor(item) {
            var params = {};
            if (item.categoryId) {
                params = {
                    promotionType: 'aging',
                    categoryId: item.categoryId,
                    offset: 1,
                    limit: 5
                }
            }
            if (utils.isAppleStore()) {
                params.source = "appstore" + utils.getAppVersion();
            }
            httpRequest.getReq(urlHelper.getUrl("listPagedHotProductInfo"), params, {
                ignoreLogin: true
            }).then(function (d) {
                item.blocks = d.items;
                // check
                if (item.blocks && item.blocks.length > 0) {
                    for (var i = 0; i < item.blocks.length; i++) {
                        item.blocks[i] = checkProductInfo(item.blocks[i]);
                    }
                }
            });
        }

        function todayLoad(info, dtd) {

            pageIndex++;

            if (pageIndex >= pageInfo.length) {
                vm.canLoad = false;
            }

            httpRequest.getReq(urlHelper.getUrl(info.url), {
                type: 'promotion_area'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var item = jq.extend({}, info);

                item.items = d.items;

                for (var i = 0; i < d.items.length; i++) {
                    if (i < 3) {
                        vm.itemStyle = {
                            borderBottom: "none"
                        }
                    }
                    if (i >= 3) {
                        vm.itemStyle = {
                            borderTop: "none"
                        }
                    }
                }
                if (item.items && item.items.length > 0) {
                    vm.items = vm.items.concat([item]);
                }
                dtd.resolve(true);
            }, function () {
                dtd.resolve(true);
            });
        }

        function floorLoad(info, dtd) {

            pageIndex++;
            if (pageIndex >= pageInfo.length) {
                vm.canLoad = false;
            }

            httpRequest.getReq(urlHelper.getUrl(info.url), null, {
                ignoreLogin: true
            }).then(function (d) {
                for (var i = 0; i < d.items.length; i++) {
                    if (d.items[i].floor == 'true') {
                        var item = {
                            type: info.type,
                            title: d.items[i].name,
                            cls: info.cls,
                            titleCls: 'cate_' + d.items[i].id,
                            categoryId: d.items[i].id,
                            moreUrl: '/stage/category?categoryId=' + d.items[i].id
                        };
                        vm.items = vm.items.concat([item]);

                        getFloor(item);
                    }
                }

                dtd.resolve();
            }, function () {
                dtd.resolve();
            });
        }


        function fixed(num) {
            if (num < 10) {
                return "0" + num;
            }
            return "" + num;
        }

        function saleLoad(info, dtd) {

            pageIndex++;

            if (pageIndex >= pageInfo.length) {
                vm.canLoad = false;
            }

            httpRequest.getReq(urlHelper.getUrl(info.url), {
                promotionId: info.promotionId,
                promotionType: info.promotionType,
                offset: 1,
                limit: 10
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var item = info;
                item.items = d.items;

                if (item.items && item.items.length > 0) {
                    for (var i = 0; i < item.items.length; i++) {
                        if (item.items[i].mainProImgUrl) {
                            item.items[i].mainProImgUrl = utils.htmlDecode(item.items[i].mainProImgUrl);
                        }
                    }

                    var itemWidth = jq($window).width() / 3.5;

                    item.wrapperStyles = {
                        "width": itemWidth * item.items.length + "px"
                    };

                    item.itemStyles = {
                        "width": itemWidth + "px"
                    };

                }

                vm.items = vm.items.concat([item]);

                dtd.resolve();
            }, function () {
                dtd.resolve();
            });
        }

        function checkProductInfo(info) {
            if (info && info.mainProImgUrl) {
                info.mainProImgUrl = utils.htmlDecode(info.mainProImgUrl);
            }
            return info;
        }

        function guessLoad(info, dtd) {

            var params = {};
            var url = info.url2;
            params = {
                promotionType: "aging",
                offset: vm.guessIndex,
                limit: 20
            };

            if (utils.isAppleStore()) {
                params.source = "appstore" + utils.getAppVersion();
            }

            httpRequest.getReq(urlHelper.getUrl(url), null, {
                ignoreLogin: true,
                type: 'POST',
                isForm: true,
                data: params
            }).then(function (d) {

                if (vm.guessIndex > 10) {
                    pageIndex++;
                }

                var item = jq.extend({
                    rows: [],
                    guessIndex: vm.guessIndex

                }, info);

                vm.guessIndex++;

                for (var i = 0; i < d.items.length;) {
                    var row = [];
                    row.push(checkProductInfo(d.items[i++]));

                    if (i >= d.items.length) {
                        break;
                    } else {
                        row.push(checkProductInfo(d.items[i++]));
                    }
                    item.rows.push(row);
                }

                if (item.rows.length > 0) {
                    vm.items = vm.items.concat([item]);
                }

                if (pageIndex >= pageInfo.length) {
                    vm.canLoad = false;
                }
                dtd.resolve();
            }, function () {
                pageIndex++;
                if (pageIndex >= pageInfo.length) {
                    vm.canLoad = false;
                }
                dtd.resolve();
            });
        }

        function noneLoad(info, dtd) {
            pageIndex++;
            if (pageIndex >= pageInfo.length) {
                vm.canLoad = false;
            }

            var item = jq.extend({}, info);

            vm.items = vm.items.concat([item]);

            dtd.resolve();
        }

        vm.gotoOperation = function () {
            utils.gotoUrl("/operation/christmas");
        }

        vm.noticeAnimate = {
            timer: null,
            len: 0,
            idx: 0,
            style: {
                "margin-top": "0px"
            }
        };

        vm.noticeDialog = {
            title: null,
            content: null,
            isVisible: false,
            onClick: function (notice) {
                if (!utils.isEmpty(notice.linkUrl)) {
                    utils.gotoUrl(notice.linkUrl);
                } else if (!utils.isEmpty(notice.linkContent)) {
                    vm.noticeDialog.openDialog(notice);
                }
            },
            goBack: function () {
                vm.noticeDialog.isVisible = false;
            },
            openDialog: function (notice) {
                vm.noticeDialog.title = notice.content;
                vm.noticeDialog.content = notice.linkContent;

                vm.noticeDialog.isVisible = true;
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
                vm.noticeAnimate.style["margin-top"] = (vm.noticeAnimate.idx * (-24)) + "px";
            }
        }

        //notice Load
        function noticeLoad(info, dtd) {

            pageIndex++;
            if (pageIndex >= pageInfo.length) {
                vm.canLoad = false;
            }

            httpRequest.getReq(urlHelper.getUrl('listSysNotices'), {
                'positionType': 'index'
            }, {
                ignoreLogin: true
            }).then(function (d) {

                var item = jq.extend({}, info);

                item.isShow = false;

                if (d && d.items && d.items.length > 0) {
                    item.isShow = true;
                    item.noticeList = d.items;
                    startNoticeAnimate(d.items.length);
                }

                vm.items = vm.items.concat([item]);

                dtd.resolve();
            }, function () {
                dtd.resolve();
            });
        }

        function navLoad(info, dtd) {

            if (info.url) {

                pageIndex++;
                if (pageIndex >= pageInfo.length) {
                    vm.canLoad = false;
                }
                httpRequest.getReq(urlHelper.getUrl(info.url), null, {
                    ignoreLogin: true
                }).then(function (d) {

                    utils.getGlobalConfig(function (config) {
                        if (d.items && d.items.length > 0) {
                            var btns = [],
                                btns2 = [];

                            var btnItem1 = d.items.slice(0, 5),
                                btnItem2 = d.items.slice(5);

                            for (var i = 0; i < btnItem1.length; i++) {
                                btns.push({
                                    'img': utils.htmlDecode(btnItem1[i].imgUrl),
                                    'text': btnItem1[i].keyword,
                                    'url': utils.htmlDecode(btnItem1[i].href)
                                })
                            }
                            for (var j = 0; j < btnItem2.length; j++) {
                                btns2.push({
                                    'img': btnItem2[j].imgUrl,
                                    'text': btnItem2[j].keyword,
                                    'url': btnItem2[j].href
                                })
                            }
                        }
                        var item = jq.extend({}, info, {
                            btns: btns,
                            btns2: btns2
                        });

                        vm.items = vm.items.concat([item]);

                    });

                    dtd.resolve();
                }, function (d) {
                    dtd.resolve();
                });
            }

        }

        function mainLoad(info, dtd) {

            pageIndex++;

            if (pageIndex >= pageInfo.length) {
                vm.canLoad = false;
            }

            if (info.url) {
                httpRequest.getReq(urlHelper.getUrl(info.url), null, {
                    ignoreLogin: true
                }).then(function (d) {


                    if (d.items && d.items.length > 0) {
                        var s = d.items;
                        for (var i = 0; i < s.length; i++) {
                            s[i].href = utils.htmlDecode(s[i].href);
                            s[i].imgUrl = utils.htmlDecode(s[i].imgUrl);
                        }

                        var item = jq.extend({}, info);
                        item.items = s;
                        vm.items = vm.items.concat([item]);

                    }
                    dtd.resolve(true);
                }, function () {
                    dtd.resolve(true);
                });
            }
        }

        function bannerLoad(info, dtd) {
            if (info.url) {

                pageIndex++;

                if (pageIndex >= pageInfo.length) {
                    vm.canLoad = false;
                }

                httpRequest.getReq(urlHelper.getUrl(info.url), null, {
                    ignoreLogin: true
                }).then(function (d) {


                    if (d.items && d.items.length > 0) {
                        var deviceType = (jq.os.ios) ? 'ios' : 'android';
                        for (var i = 0; i < d.items.length; i++) {
                            var b = d.items[i];
                            if (b.sideColor == deviceType) {
                                var item = jq.extend({}, info, {
                                    href: utils.htmlDecode(b.href),
                                    bannerSrc: utils.htmlDecode(b.imgUrl)
                                });

                                if (!utils.isEmpty(b.size)) {
                                    var s = b.size.split(",");
                                    if (s[0]) {
                                        item.imgSize.width = parseInt(s[0]);
                                    }
                                    if (s[1]) {
                                        item.imgSize.height = parseInt(s[1]);
                                    }
                                }

                                var h = item.imgSize.height * jq($window).width() / item.imgSize.width;
                                item.styles.height = parseInt(h) + "px";

                                vm.items = vm.items.concat([item]);
                                break;
                            }
                        }
                    }


                    dtd.resolve(true);
                }, function () {
                    dtd.resolve(true);
                });
            }
        }

        function carouselLoad(info, dtd) {
            if (info.url) {

                var winWidth = jq($window).width();
                carouseHeight = info.imgSize.height * winWidth / info.imgSize.width;
                info.styles.height = parseInt(carouseHeight) + "px";

                pageIndex++;
                if (pageIndex >= pageInfo.length) {
                    vm.canLoad = false;
                }

                httpRequest.getReq(urlHelper.getUrl(info.url), null, {
                    ignoreLogin: true
                }).then(function (d) {


                    var slides = [];

                    if (d.items) {
                        for (var i = 0; i < d.items.length; i++) {
                            var s = d.items[i];
                            slides.push({
                                id: 's' + s.id,
                                url: utils.htmlDecode(s.href),
                                img: utils.htmlDecode(s.imgUrl)
                            });
                        }
                    }

                    var item = jq.extend({}, info, {
                        slides: slides
                    });

                    vm.items = vm.items.concat([item]);
                    dtd.resolve();
                }, function () {
                    vm.items = vm.items.concat([info]);
                    dtd.resolve();
                });
            }
        }

        function carouseClick(url) {
            if (url) {
                utils.gotoUrl(url);
            }
        }

        /**
         * Screen reload
         */
        function reload() {
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 0;
            vm.guessIndex = 1;
        }

        /**
         * Destory func triggered by $destory
         */
        function destory() {
            var holder = jq("#enterPage");
            holder.unbind();

            var win = jq($window);
            win.unbind('keyup');

        }

        function loaderComplete() {
            $loadingOverlay.hide();

            if (loadingTimer) {
                $timeout.cancel(loadingTimer);
                loadingTimer = null;
            }
        }

        function showLoading() {
            var template = "<div class='ui-loading'><img class='ui-loading-img' src='../../assets/imgs/base/loading.gif' /><div class='ui-loading-text'>拼命加载中...</div></div></div>";
            $loadingOverlay.show(template);
            loadingTimer = $timeout(function () {
                $loadingOverlay.hide();
            }, 10000);
        }

        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {

            var dtd = $q.defer();

            if (pageIndex >= pageInfo.length) {
                vm.canLoad = false;
            } else {
                var info = pageInfo[pageIndex];

                if (info.load) {
                    info.load(info, dtd);
                }
            }

            return dtd.promise;
        }

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        function scrollToTop() {
            var holder = jq("#enterPage");

            var timeout = $interval(scrollToTopFn, 15),
                top = Math.max(0, holder.scrollTop());

            function scrollToTopFn() {
                top = top - 200;
                holder.scrollTop(Math.max(0, top));

                if (top < 0) {
                    $interval.cancel(timeout);
                }
            }
        }

        function initScroll() {
            var holder = jq("#enterPage");
            holder.scroll(bodyScrollFn);

            function bodyScrollFn(evt) {
                var top = Math.max(0, holder.scrollTop());

                // bottom to top show
                var toTop = jq("#bottom-to-top");
                if (top > 500) {
                    toTop.show();
                } else {
                    toTop.hide();
                }

                var alpha = top / (carouseHeight - 40);
                alpha = Math.min(alpha, 0.95);

                var header = jq("#homePageHeaderBar");

                setAlpha(alpha);

                function setAlpha(alpha) {
                    alpha = Math.max(0, Math.min(alpha, 0.95));

                    var fontColor = "#fff";
                    if (alpha > 0.2) {
                        fontColor = "rgba(51,51,51," + alpha + ")";
                    }

                    header.css({
                        "background-color": "rgba(255,255,255," + alpha + ")",
                        "border-bottom": "1px solid rgba(230,230,230," + alpha + ")"
                    });

                    header.find(".ui-header-bar-left-icon").css("color", fontColor);
                    header.find(".ui-header-bar-text").css("color", fontColor);
                    header.find(".ui-header-bar-right-icon").css("color", fontColor);

                    lastHeaderAlpha = alpha;
                }
            }

        }

        function initFlags() {
            utils.flushFlags();
        }

        vm.cashDialog = {
            isVisible: false,
            openDialog: function () {
                vm.cashDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.cashDialog.isVisible = false;
            }
        };

        function init() {

            var hasEnterActive = utils.checkCacheTime("_enter_active", 86400);
            if (!hasEnterActive) {
                vm.cashDialog.openDialog();
                utils.cacheTime("_enter_active");
            }

            showLoading();

            utils.checkAndUpdate();

            utils.rateApp();

            initScroll();

            initFlags();

            // destroy
            vm.$on("$destroy", destory);

            httpRequest.getReq(urlHelper.getUrl('main'), null, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.name) {
                    settingCache.set('__req_info_user_have_name', true);
                } else {
                    settingCache.set('__req_info_user_have_name', false);
                }
            });

        }

        init();

    }

})
;
