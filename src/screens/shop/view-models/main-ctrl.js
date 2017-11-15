define([
    'screens/shop/module',
    'jq',
    'screens/shop/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('shopMainCtrl', shopMain);

    ////////
    shopMain.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$window',
        '$stateParams',
        '$location',
        '$timeout',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'shopUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function shopMain($scope, $rootScope, $state, $window, $stateParams, $location, $timeout, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1,
            _shopId = $stateParams.shopId;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                showTextTitle: false,
                leftBtnType: "back",
                title: $stateParams.shopName,
                isShow: true
            }, $location);
        }

        vm.pageIndex = 0;
        vm.pageInfo = {
            carouselIndex: 0,
            imgSize: {
                width: 710,
                height: 300
            },
            styles: {
                height: "1px"
            },
            slides: [
                //{
                //    id: 's1',
                //    url: '/blanknote/main',
                //    img: "../../assets/imgs/banner/banner1.png"
                //}, {
                //    id: 's2',
                //    url: '/blanknote/main',
                //    img: "../../assets/imgs/banner/banner1.png"
                //}, {
                //    id: 's3',
                //    url: '/blanknote/main',
                //    img: "../../assets/imgs/banner/banner1.png"
                //}
            ]
        };
        function carouselLoad(items) {

            var winWidth = jq($window).width() - 10;
            var carouseHeight = vm.pageInfo.imgSize.height * winWidth / vm.pageInfo.imgSize.width;
            vm.pageInfo.styles.height = parseInt(carouseHeight) + "px";


            var slides = [];

            if (items) {
                for (var i = 0; i < items.length; i++) {
                    var s = items[i];
                    slides.push({
                        id: 's' + s.id,
                        url: utils.htmlDecode(s.url),
                        img: utils.htmlDecode(s.bannerImgUrl)
                    });
                }
            }

            vm.pageInfo.slides = slides
        }

        vm.carouseClick = function (url) {
            if (url) {
                utils.gotoUrl(url);
            }
        }

        vm.isAbnormal = false;
        vm.canLoad = true;
        vm.gotoProductDetail = gotoProductDetail;
        vm.shopId = $stateParams.shopId;
        vm.items = [];

        vm.loadItems = loadItems;
        vm.reload = reload;
        vm.getMsg = getMsg;

        vm.itemRows = [];

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            utils.gotoUrl(url);
        }


        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;

        }


        function loadItems() {
            var dtd = $q.defer();
            var param = {
                shopId: vm.shopId,
                offset: pageIndex,
                limit: 10
            };
            httpRequest.getReq(urlHelper.getUrl('listPagedProductInfoFromSearch'), param, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;

                var items = jq.extend({
                    rows: []
                });

                var itemRows = [];

                for (var i = 0; i < d.items.length;) {
                    var row = [];
                    row.push(d.items[i++]);

                    if (i >= d.items.length + 1) {
                        break;
                    } else {
                        row.push(d.items[i++]);
                    }
                    items.rows.push(row);
                }

                itemRows = itemRows.concat(items.rows);
                vm.itemRows = vm.itemRows.concat(itemRows);

                if (d.items && d.items.length <= 1) {
                    vm.canLoad = false;
                }

                vm.items = vm.items.concat(vm.itemRows);

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
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        vm.labelList = [];
        function shopInfo() {
            httpRequest.getReq(urlHelper.getUrl('shopInfo'), {
                shopId: _shopId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                vm.shop = d;
                if (d.shopBannerDOList && d.shopBannerDOList.length > 0) {
                    carouselLoad(d.shopBannerDOList);
                }

                if (d && d.label) {
                    vm.labelList = d.label.split(',');
                }
            })
        }

        function init() {
            shopInfo();
        }

        init();
    }

});
