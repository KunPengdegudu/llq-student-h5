/**
 * stage main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/stage/module',
    'jq',
    'screens/stage/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('StageMainCtrl', StageMain);

    ////////
    StageMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'settingCache',
        'httpRequest',
        'stageUrlHelper',
        'CONSTANT_UTILS'
    ];
    function StageMain($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        var _resetState = $stateParams.resetState,
            _categoryId = $stateParams.categoryId,
            _brandId = $stateParams.brandId,
            _productName = $stateParams.productName;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                headerType: "aging",
                hasBack: true,
                centerAttrs: {
                    inputValue: _productName
                },
                isShow: true
            }, $location);
        }

        vm.promotionType = "aging";
        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.filterParams = {};

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        vm.search = search;

        vm.gotoProductDetail = gotoProductDetail;

        vm.orderby = {
            orderType: "default", // default, filter, search
            clickDefault: function () {
                if (vm.orderby.orderType != "default") {
                    vm.orderby.orderType = "default";
                    vm.filterDialog.dialogClose();
                    flushPage();
                }
            },
            clickFilter: function () {
                vm.filterDialog.dialogOpen();
                vm.orderby.orderType = "filter";
            },
            clickPrice: function () {
                vm.priceDialog.dialogOpen();
                vm.orderby.orderType = 'price';
            }
        };

        vm.filterDialog = {
            isVisible: false,
            categoryList: null,
            selectedCategoryId: null,
            selectedBrandId: null,
            brandList: null,

            dialogBeforeHide: function () {
                jq("body").children("data-header-bar").css("z-index", null);
                jq("body").find(".aging-wrapper").css("z-index", null);
                return true;
            },
            dialogOpen: function () {
                vm.priceDialog.isVisible = false;
                if (vm.filterDialog.isVisible) {
                    vm.filterDialog.dialogClose();
                } else {
                    vm.filterDialog.isVisible = true;
                    jq("body").children("data-header-bar").css("z-index", 570);
                    jq("body").find(".aging-wrapper").css("z-index", 570);
                }
            },
            dialogClose: function () {
                vm.filterDialog.isVisible = false;
                jq("body").children("data-header-bar").css("z-index", null);
                jq("body").find(".aging-wrapper").css("z-index", null);
            },
            clickCategory: function (id) {
                vm.filterParams.categoryId = id;
                vm.filterDialog.selectedCategoryId = id;
                var params = {
                    categoryId: id
                };
                if (utils.isAppleStore()) {
                    params.source = "appstore" + utils.getAppVersion();
                }
                httpRequest.getReq(urlHelper.getUrl('searchBrandListByCategory'), params, {
                    ignoreLogin: true
                }).then(function (d) {
                    vm.filterDialog.brandList = d.items;
                });
            },
            clickBrand: function (id) {
                vm.filterParams.brandId = id;
                vm.filterDialog.selectedBrandId = id;
                vm.filterDialog.dialogClose();
                flushPage();
            }
        };

        var winSize = {
            width: jq(window).width(),
            height: jq(window).height()
        };

        vm.flyObject = {
            imgUrl: null,
            start: {
                left: winSize.width - 60,
                top: 20,
                width: 50,
                height: 50
            },
            end: {
                left: winSize.width - 40,
                top: 20,
                width: 16,
                height: 16
            },
            vertexRtop: winSize.height
        };
        vm.priceDialog = {
            isVisible: false,
            beginPrice: null,
            endPrice: null,
            params: null,
            priceName: '价格',
            order: null,
            dialogOpen: function () {
                vm.filterDialog.isVisible = false;
                if (vm.priceDialog.isVisible) {
                    vm.priceDialog.dialogClose();
                } else {
                    vm.priceDialog.isVisible = true;
                    jq("body").children("data-header-bar").css("z-index", 570);
                    jq("body").find(".aging-wrapper").css("z-index", 570);
                }
            },
            dialogBeforeHide: function () {
                jq("body").children("data-header-bar").css("z-index", null);
                jq("body").find(".aging-wrapper").css("z-index", null);
                return true;
            },
            choosePrice: function () {
                vm.priceDialog.order = null;
                if (vm.priceDialog.endPrice && vm.priceDialog.endPrice < vm.priceDialog.beginPrice) {
                    var middlePrice = vm.priceDialog.beginPrice;
                    vm.priceDialog.beginPrice = vm.priceDialog.endPrice;
                    vm.priceDialog.endPrice = middlePrice;
                }
                if (vm.priceDialog.endPrice || vm.priceDialog.endPrice===0) {
                    var endPrice = vm.priceDialog.endPrice;

                } else {
                    var endPrice = '';

                }
                if (vm.priceDialog.beginPrice || vm.priceDialog.beginPrice===0) {
                    var beginPrice = vm.priceDialog.beginPrice;

                } else {
                    var beginPrice = '';

                }
                vm.priceDialog.priceName = beginPrice + '--' + endPrice;
                var params = vm.priceDialog.params;
                params.endPrice = vm.priceDialog.endPrice;
                params.beginPrice = vm.priceDialog.beginPrice;
                vm.priceDialog.dialogClose();
                flushPage()

            },
            chooseOrder: function (order) {
                vm.priceDialog.beginPrice = null;
                vm.priceDialog.endPrice = null;
                vm.priceDialog.order = order;
                if (order == 'desc') {
                    vm.priceDialog.priceName = '价格由高到低';
                } else {
                    vm.priceDialog.priceName = '价格由低到高'
                }
                vm.priceDialog.dialogClose();
                flushPage();
            },
            dialogClose: function () {
                vm.priceDialog.isVisible = false;
                jq("body").children("data-header-bar").css("z-index", null);
                jq("body").find(".aging-wrapper").css("z-index", null);
            }

        };
        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('#/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            location.replace(url);
        }

        function flushPage() {
            reload();
            vm.$emit('reload');
        }

        /**
         * Screen reload
         */
        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        function setState() {
            var _state = {
                orderType: vm.orderby.orderType,
                categoryId: vm.filterParams.categoryId,
                brandId: vm.filterParams.brandId,
                name: vm.filterParams.name
            };

            settingCache.set("__stage_state", _state);
        }

        function getState() {
            var _state = settingCache.get("__stage_state");
            if (_state) {
                vm.orderby.orderType = (_state.orderType) ? (_state.orderType) : "default";

                if (_state.categoryId) {
                    vm.filterParams.categoryId = _state.categoryId;
                    vm.filterDialog.selectedCategoryId = _state.categoryId;
                }

                if (_state.brandId) {
                    vm.filterParams.brandId = _state.brandId;
                    vm.filterDialog.selectedBrandId = _state.brandId;
                }

                if (_state.name) {
                    vm.filterParams.name = _state.name;
                }
            }
        }

        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();
            var params = {
                promotionType: vm.promotionType,
                offset: pageIndex,
                limit: 10
            };

            if (!utils.isEmpty(vm.filterParams.name)) {
                params.name = vm.filterParams.name;
            }

            //
            if (vm.orderby.orderType == "filter") {
                params.categoryId = vm.filterParams.categoryId;
                params.brandId = vm.filterParams.brandId;
            }

            if (vm.orderby.orderType == 'price') {
                if (vm.filterParams.name) {
                    params.name = vm.filterParams.name;
                }
                if (vm.filterParams.categoryId) {
                    params.categoryId = vm.filterParams.categoryId;
                }
                if (vm.filterParams.brandId) {
                    params.brandId = vm.filterParams.brandId;
                }
            }
            // save state
            setState();

            if (utils.isAppleStore()) {
                params.source = "appstore" + utils.getAppVersion();
            }
            if (vm.priceDialog.beginPrice) {
                params.beginPrice = vm.priceDialog.beginPrice;
            }
            if (vm.priceDialog.endPrice) {
                params.endPrice = vm.priceDialog.endPrice;
            }
            if (vm.priceDialog.order) {
                params.sort = 'proSkuPrice';
                params.order = vm.priceDialog.order;
            }
            vm.priceDialog.params = params;
            httpRequest.getReq(urlHelper.getUrl('listPagedProductInfoFromSearch'), null, {
                ignoreLogin: true,
                type: 'POST',
                isForm: true,
                data: params
            }).then(function (d) {
                pageIndex++;
                var items = d.items;

                if (items && items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        items[i].needTip = false;
                        if (items[i].mainProImgUrl) {
                            items[i].mainProImgUrl = utils.htmlDecode(items[i].mainProImgUrl);
                        }
                        if(items[i].productId == 15529 || items[i].productId == 15751 || items[i].productId == 14495 || items[i].productId == 15536 || items[i].productId == 15526 || items[i].productId == 4358 || items[i].productId == 1868 || items[i].productId == 4723 || items[i].productId == 9452 || items[i].productId == 4719 || items[i].productId == 12476 || items[i].productId == 11639){
                            items[i].needTip = true;
                        }
                    }
                }

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

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        function search() {
            var ms = jq("#llq-aging-search"),
                val = ms.val();
            vm.filterParams = vm.filterParams || {};
            vm.filterParams.name = val;
            flushPage();
        }

        function destory() {
        }

        vm.goCart = function (item, event) {

            vm.flyObject.imgUrl = item.mainProImgUrl;
            vm.flyObject.start.top = event.clientY - 20;


            httpRequest.getReq(urlHelper.getUrl('cartAdd'), null, {
                type: 'POST',
                data: {
                    productId: item.productId,
                    productSkuId: item.productSkuId,
                    quantity: 1
                }
            }).then(function (d) {
                utils.carProductNum();
                vm.playFly();
            }, function (err) {
                utils.error(err.msg || "加入购物车出现错误");
            });

        };


        function init() {

            utils.checkAndUpdate();


            if (_productName) {
                vm.filterParams.name = _productName;
            }
            // 定位类目
            else if (_categoryId || _brandId) {
                vm.orderby.orderType = "filter";

                if (_categoryId) {
                    vm.filterParams.categoryId = _categoryId;
                    vm.filterDialog.selectedCategoryId = _categoryId;
                }

                if (_brandId) {
                    vm.filterParams.brandId = _brandId;
                    vm.filterDialog.selectedBrandId = _brandId;
                }
            }
            // 恢复状态
            else if (_resetState) {
                getState();
            }


            httpRequest.getReq(urlHelper.getUrl('listAllGategory'), null, {
                ignoreLogin: true
            }).then(function (d) {
                vm.filterDialog.categoryList = d.items;
            });

            // destroy
            vm.$on("$destroy", destory);
        }

        init();
    }

});