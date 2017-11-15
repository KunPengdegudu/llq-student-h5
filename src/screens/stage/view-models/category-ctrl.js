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

    module.controller('StageCategoryCtrl', StageCategory);

    ////////
    StageCategory.$inject = [
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
    function StageCategory($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                headerType: "aging",
                title: "分类",
                hasTitle: true,
                currentUrl: "/stage/category",
                centerAttrs: {
                    inputValue: ""
                },
                isShow: true
            }, $location);
        }
        vm.flashFlag = false;

        vm.categoryId = $stateParams.categoryId || settingCache.get("__stage_category_id");

        vm.categoryList = [];
        vm.brandList = [];

        vm.topBannerSrc = null;
        vm.topBannerHref = null;

        //选择分类
        vm.selectCategoryId = 0;

        vm.isSelectCategory = isSelectCategory;
        vm.selectCategory = selectCategory;

        vm.clickBrand = clickBrand;
        function clickBrand(id) {
            utils.gotoUrl('/stage/main?brandId=' + id);

        }

        vm.clickCategoryId = clickCategoryId;
        function clickCategoryId(id) {
            utils.gotoUrl('/stage/main?categoryId=' + id);

        }

        vm.gotoUrl = gotoUrl;
        function gotoUrl(href) {
            if (href) {
                utils.gotoUrl(href);
            }
        }

        function isSelectCategory(item) {
            if (vm.selectCategoryId == item.id) {
                return true;
            }
            return false;
        }

        function selectCategory(item) {
            vm.topBannerSrc = null;
            vm.topBannerHref = null;
            vm.selectCategoryId = item.id;

            settingCache.set("__stage_category_id", item.id);

            var params = {
                categoryId: item.id
            };
            if (utils.isAppleStore()) {
                params.source = "appstore" + utils.getAppVersion();
            }
            httpRequest.getReq(urlHelper.getUrl('newSearchBrandListByCategory'), params, {
                ignoreLogin: true
            }).then(function (d) {
                vm.flashFlag = !vm.flashFlag;
                vm.brandList = d.floorBrandList;
                vm.secondCategoryList = d.subList;
            });
            if (item.floorAdList && item.floorAdList.length > 0) {
                vm.topBannerSrc = item.floorAdList[0].imgUrl;
                if (item.floorAdList.href != '') {
                    vm.topBannerHref = utils.htmlDecode(item.floorAdList[0].href);
                }
            }
        }

        function destory() {
        }

        function init() {
            utils.checkAndUpdate();

            utils.carProductNum();

            httpRequest.getReq(urlHelper.getUrl('newListAllGategory'), null, {
                ignoreLogin: true
            }).then(function (d) {
                //vm.categoryList = d.items;

                for (var i = 0; i < d.items.length; i++) {
                    vm.categoryList.push(d.items[i]);
                    if (d.items[i].id == vm.categoryId) {
                        vm.selectList = d.items[i];
                    }
                }

                if (d.items && d.items.length > 0) {
                    selectCategory(vm.selectList || d.items[0]);
                }
            });

            // destroy
            vm.$on("$destroy", destory);

        }

        init();
    }

});