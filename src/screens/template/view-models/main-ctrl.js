/**
 * template main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/template/module',
    'jq',
    'screens/template/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('templateMainCtrl', templateMain);

    ////////
    templateMain.$inject = [
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
    function templateMain($rootScope, $scope, $state, $location, $stateParams, $q, $window, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1,
            carouseHeight = 0;

        var widgetCode = $stateParams.widgetCode;

        var nodeId = $stateParams.nodeId;

        var name = $stateParams.name;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: name,
                isShow: true
            }, $location);
        }

        vm.templateList = null;
        vm.orderFactorId = '';
        vm.orderType = '';
        vm.ascendShow = false;
        vm.descendShow = false;
        vm.asc = 'asc';
        vm.desc = 'desc';
        vm.linkUrl = [];
        vm.flushPage = flushPage;

        vm.getNewGoodsSort = function (orderType) {
            vm.orderType = orderType;
            flushPage();
        };

        vm.gotoProductDetail = gotoProductDetail;

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('#/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            location.replace(url);
        }

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        function flushPage() {
            reload();
            vm.$emit('reload');
        }

        vm.gotoOperation = function () {
            utils.gotoUrl("/operation/christmas");
        };

        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
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

        function loadItems() {
            var dtd = $q.defer();
            var param = {};
            if (!vm.orderType) {
                param = {
                    offset: pageIndex,
                    limit: 10,
                    nodeId: nodeId,
                    widgetCode: widgetCode
                };
            } else {
                param = {
                    offset: pageIndex,
                    limit: 10,
                    widgetCode: widgetCode,
                    nodeId: nodeId,
                    orderType: vm.orderType,
                    orderFactorId: vm.orderFactorId
                }
            }
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), param, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;
                var items = d ? d.items : [];

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

        function getMsg() {
            if (!vm.items || vm.items.length === 0) {
                return ' ';
            }

        }

        vm.carouseClick = function (url) {
            if (url) {
                utils.gotoUrl(url);
            }
        };

        vm.hasSortBtn = false;

        function init() {

            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), {
                widgetCode: widgetCode
            }, {
                ignoreLogin: true
            }).then(function (d) {
                vm.templateList = d.nodeTree;
                if (d.orderFactor && d.orderFactor.length > 0) {
                    vm.orderType = d.orderFactor[0].orderType;
                    vm.orderFactorId = d.orderFactor[0].orderFactorId;
                    vm.hasSortBtn = true;
                } else {
                    vm.hasSortBtn = false;
                }

                var winWidth = jq($window).width();
                carouseHeight = vm.template.imgSize.height * winWidth / vm.template.imgSize.width;
                vm.template.styles.height = parseInt(carouseHeight) + "px";

                if (d.widgetViewInfo.bannerImgUrlList && d.widgetViewInfo.bannerImgUrlList.length > 0) {
                    vm.bannerImgUrlList = d.widgetViewInfo.bannerImgUrlList;
                }

                var slides = [];
                if (d.widgetViewInfo.bannerImgUrlList) {
                    for (var i = 0; i < vm.bannerImgUrlList.length; i++) {
                        var s = vm.bannerImgUrlList[i];
                        slides.push({
                            id: 's' + s.indexNum,
                            url: utils.htmlDecode(s.linkUrl),
                            img: utils.htmlDecode(s.imgUrl)
                        })
                    }

                }
                vm.template.slides = slides;

                if (vm.orderType == 'ASC' || vm.orderType == 'asc') {
                    vm.ascendShow = true;
                }
                if (vm.orderType == 'DESC' || vm.orderType == 'desc') {
                    vm.descendShow = true;
                }
                if (vm.orderType == 'AD' || vm.orderType == 'ad') {
                    vm.ascendShow = true;
                    vm.descendShow = true;
                }

            });

        }

        init();
    }

});