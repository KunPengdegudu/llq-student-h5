/**
 * free main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/free/module',
    'jq',
    'screens/free/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('FreeMainCtrl', FreeMain);

    ////////
    FreeMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'settingCache',
        'httpRequest',
        'freeUrlHelper',
        'CONSTANT_UTILS'
    ];
    function FreeMain($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        var _resetState = $stateParams.resetState,
            _categoryId = $stateParams.categoryId,
            _brandId = $stateParams.brandId,
            _productName = $stateParams.productName;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "爽购专区",
                isShow: true
            }, $location);
        }

        vm.promotionType = "aging";
        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.filterParams = {};

        vm.promotionId = 40;
        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;
        vm.flushPage = flushPage;
        vm.gotoProductDetail = gotoProductDetail;


        vm.orderby = {
            orderType: "default", // default, filter
            clickDefault: function () {
                if (vm.orderby.orderType != "default") {
                    vm.orderby.orderType = "default";
                    vm.filterDialog.dialogClose();
                    vm.filterParams = {};
                    flushPage();
                }
            },
            clickFilter: function () {
                vm.filterDialog.dialogOpen();
                vm.orderby.orderType = "filter";
                vm.filterParams = {};
            }
        };

        vm.filterDialog = {
            isVisible: false,
            categoryList: null,
            selectedCategoryId: 1,
            selectedBrandId: null,
            brandList: null,

            dialogBeforeHide: function () {
                jq("body").children("data-header-bar").css("z-index", null);
                jq("body").find(".aging-wrapper").css("z-index", null);
                return true;
            },
            dialogOpen: function () {
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

                httpRequest.getReq(urlHelper.getUrl('searchBrandListByCategory'), params, {
                    ignoreLogin: true
                }).then(function (d) {
                    vm.filterDialog.brandList = d.items;
                });
            },
            clickBrand: function (id) {
                if (id == 'all') {
                } else {
                    vm.filterParams.brandId = id;
                    vm.filterDialog.selectedBrandId = id;
                }
                vm.filterDialog.dialogClose();
                flushPage();
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

            settingCache.set("__stage_free", _state);
        }

        function getState() {
            var _state = settingCache.get("__stage_free");
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


        function loadItems() {
            var dtd = $q.defer();
            var params = {
                promotionType: vm.promotionType,
                offset: pageIndex,
                limit: 10,
                promotionIds: [40, 41]
            };

            if (vm.orderby.orderType == "filter") {
                params.categoryId = vm.filterDialog.selectedCategoryId;
                params.brandId = vm.filterParams.brandId;
            }

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
                        if (items[i].mainProImgUrl) {
                            items[i].mainProImgUrl = utils.htmlDecode(items[i].mainProImgUrl);
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
            if (!utils.isEmpty(val)) {
                vm.orderby.orderType = "search";
                vm.filterParams = {};
                vm.filterParams.name = val;
                flushPage();
            }
        }

        function destory() {
        }

        function init() {

            utils.checkAndUpdate();

            vm.filterDialog.clickCategory(1);
            if (_productName) {
                vm.orderby.orderType = "search";
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