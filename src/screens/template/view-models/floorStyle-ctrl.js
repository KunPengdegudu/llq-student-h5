/**
 * template FloorStyle controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/template/module',
    'jq',
    'screens/template/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('templateFloorStyleCtrl', templateFloorStyle);

    ////////
    templateFloorStyle.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'httpRequest',
        'templateUrlHelper',
        'CONSTANT_UTILS'
    ];
    function templateFloorStyle($rootScope, $scope, $state, $location, $stateParams, $q, $window, httpRequest, urlHelper, utils) {
        var vm = $scope,
            carouseHeight = 0;

        var widgetCode = $stateParams.widgetCode;

        var name = $stateParams.name;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "零零期分期",
                isShow: true
            }, $location);
        }

        $rootScope.navConfig.title = name;
        vm.templateList = null;
        vm.orderFactorId = '';
        vm.orderType = '';

        vm.gotoProductDetail = gotoProductDetail;

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('#/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            location.replace(url);
        }

        vm.gotoOperation = function () {
            utils.gotoUrl("/operation/christmas");
        };

        vm.carouseClickcarouseClick = function (url) {
            if (url) {
                utils.gotoUrl(url);
            }
        };

        function getGoodsList(node) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                widgetCode: widgetCode,
                nodeId: node.nodeId,
                limit: 6,
                offset: 1
            }, {
                ignoreLogin: true
            }).then(function (d) {
                node.templateGoodsList = d.items;

            });
        }

        vm.template = {
            carouselIndex: 0,
            imgSize: {
                width: 640,
                height: 320
            },
            styles: {
                height: "1px"
            },
            slides: []
        };

        vm.gotoMore = gotoMore;
        function gotoMore(item) {
            var url = utils.getUrlWithParams('/template/productList', {
                nodeId: item.nodeId,
                widgetCode: widgetCode,
                name: item.nodeName
            });
            utils.gotoUrl(url);
        }

        function init() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), {
                widgetCode: widgetCode
            }, {
                ignoreLogin: true
            }).then(function (d) {

                vm.nodeTreeList = d.nodeTree;

                if (d.widgetViewInfo.bannerImgUrlList && d.widgetViewInfo.bannerImgUrlList.length > 0) {
                    vm.bannerImgUrlList = d.widgetViewInfo.bannerImgUrlList;
                }
                if (d.widgetViewInfo.bannerImgUrlList.length > 0 && d.widgetViewInfo.bannerImgUrlList[0].linkUrl) {
                    vm.linkUrl = d.widgetViewInfo.bannerImgUrlList[0].linkUrl;
                }

                for (var i = 0; i < vm.nodeTreeList.length; i++) {
                    var node = vm.nodeTreeList[i];
                    getGoodsList(node);
                }

                var winWidth = jq($window).width();
                carouseHeight = vm.template.imgSize.height * winWidth / vm.template.imgSize.width;
                vm.template.styles.height = parseInt(carouseHeight) + "px";

                if (d.widgetViewInfo.bannerImgUrlList && d.widgetViewInfo.bannerImgUrlList.length > 0) {
                    vm.bannerImgUrlList = d.widgetViewInfo.bannerImgUrlList;
                }

                var slides = [];
                if (d.widgetViewInfo.bannerImgUrlList) {
                    for (var i = 0; i < d.widgetViewInfo.bannerImgUrlList.length; i++) {
                        var s = vm.bannerImgUrlList[i];
                        slides.push({
                            id: 's' + s.indexNum,
                            url: utils.htmlDecode(s.linkUrl),
                            img: utils.htmlDecode(s.imgUrl)
                        })
                    }

                }
                vm.template.slides = slides;

            });
        }

        vm.carouseClick = function (url) {
            if (url) {
                utils.gotoUrl(url);
            }
        };

        init();
    }

});