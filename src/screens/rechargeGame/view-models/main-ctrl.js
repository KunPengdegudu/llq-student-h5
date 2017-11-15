/**
 * rechargeGame main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/rechargeGame/module',
    'jq',
    'qrcode',
    'screens/rechargeGame/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('rechargeGameCtrl', rechargeGame);

    ////////
    rechargeGame.$inject = [
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
        'rechargeGameUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function rechargeGame($rootScope, $scope, $location, $q, $window, $loadingOverlay, $timeout, $interval, httpRequest, settingCache, urlHelper, constant, utils) {
        var vm = $scope,
            carouseHeight = 0,
            loadingTimer,
            lastHeaderAlpha = 0,
            pageIndex = 0,
            pageInfo = [{
                type: 'carousel',
                url: "queryBannerLoopPics",
                cls: 'page-no-gap',
                carouselIndex: 0,
                imgSize: {
                    width: 640,
                    height: 320
                },
                styles: {
                    height: "320px"
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
                num: 4,
                styles: {
                    height: "80px"
                },
                itemStyles: {
                    width: "25%"
                },
                url: 'queryVirtualCategories',
                load: navLoad
            }, {
                type: 'block',
                cls: 'page-no-gap',
                num: 4,
                styles: {
                    height: "1px"
                },
                itemStyles: {
                    width: "25%"
                },
                url: 'queryAllProdDesc',
                load: blockLoad
            }, {
                type: 'category',
                cls: 'page-no-gap',
                url: 'queryAllWidgetInfo',
                load: categoryLoad
            }];

        var TEMPLATE_MAP = {
            'carousel': 'screens/rechargeGame/views/carouse-tpl.html',
            'nav': 'screens/rechargeGame/views/nav-tpl.html',
            'block': 'screens/rechargeGame/views/block-tpl.html',
            'category': 'screens/rechargeGame/views/category-tpl.html'
        };


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "游戏会员",
                isShow: true
            }, $location);
        }

        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.loaderComplete = loaderComplete;
        vm.getMsg = getMsg;

        vm.gotoNav = gotoNav;
        vm.gotoDetail = gotoDetail;
        vm.gotoWidget = gotoWidget;

        vm.carouseClick = carouseClick;

        vm.guessIndex = 1;

        vm.getTemplate = getTemplate;

        function getTemplate(type) {
            return TEMPLATE_MAP[type];
        }

        function gotoNav(item) {
            var url = utils.getUrlWithParams('/recharge/purchase', {
                'categoryId': item.id,
                'name': item.text
            });
            utils.gotoUrl(url);
        }

        function gotoDetail(item) {
            var prodId = item.prodId ? item.prodId : item.id;
            var url = utils.getUrlWithParams('/recharge/game/details', {
                'prodId': prodId
            });
            utils.gotoUrl(url);
        }

        function gotoWidget(item) {
            var url = utils.getUrlWithParams('/recharge/widget', {
                'widgetId': item.widgetId,
                'name': item.name
            });
            utils.gotoUrl(url);
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

                    if (d.items && d.items.length > 0) {
                        var btns = [];

                        var btnItem = d.items;

                        for (var i = 0; i < btnItem.length; i++) {
                            btns.push({
                                'img': utils.htmlDecode(btnItem[i].iconUrl),
                                'text': btnItem[i].name,
                                'id': btnItem[i].id
                            })
                        }
                    }
                    var item = jq.extend({}, info, {
                        btns: btns
                    });

                    vm.items = vm.items.concat([item]);

                    dtd.resolve();
                }, function (d) {
                    dtd.resolve();
                });
            }

        }

        function blockLoad(info, dtd) {

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
                            var winWidth = jq($window).width();
                            var h = 25 + (winWidth - 20) / info.num;
                            info.styles.height = parseInt(h) + "px";
                            var btns = [],
                                btns2 = [];

                            var btnItem1 = d.items.slice(0, 4),
                                btnItem2 = d.items.slice(4);

                            for (var i = 0; i < btnItem1.length; i++) {
                                btns.push({
                                    'img': utils.htmlDecode(btnItem1[i].imgUrl),
                                    'text': btnItem1[i].name,
                                    'prodId': btnItem1[i].id
                                });
                                if (i == 0) {
                                    btns.itemStyles = {
                                        'borderLeft': 'none'
                                    }
                                }
                            }
                            for (var j = 0; j < btnItem2.length; j++) {
                                btns2.push({
                                    'img': btnItem2[j].imgUrl,
                                    'text': btnItem2[j].name,
                                    'prodId': btnItem2[j].id
                                });
                                if (i == 0) {
                                    btns2.itemStyles = {
                                        'borderLeft': 'none'
                                    }
                                }
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

        function categoryLoad(info, dtd) {
            if (info.url) {
                pageIndex++;
                if (pageIndex >= pageInfo.length) {
                    vm.canLoad = false;
                }
                httpRequest.getReq(urlHelper.getUrl(info.url), null, {
                    ignoreLogin: true
                }).then(function (d) {
                    var category = d.items ? d.items : [];
                    var item = jq.extend({}, info, {
                        category: category
                    });
                    vm.items = vm.items.concat([item]);
                    dtd.resolve();
                }, function (d) {
                    vm.items = vm.items.concat([info]);
                    dtd.resolve();
                })
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
                                id: 's' + i,
                                url: utils.htmlDecode(s.linkUrl),
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

        function init() {

            showLoading();

        }

        init();

    }

})
;
