/**
 * car main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/product/module',
    'jq',
    'screens/product/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProductCarCtrl', ProductCarCtrl);

    ////////
    ProductCarCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$location',
        '$q',
        '$timeout',
        'httpRequest',
        'productUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProductCarCtrl($rootScope, $scope, $stateParams, $location, $q, $timeout, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1,
            loadingTimer;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "购物车",
                isShow: true,
                isShowRightBtn: true,
                rightBtnType: "text",
                rightBtnAttrs: {
                    text: "编辑",
                    fn: editCart
                }
            }, $location);
        }

        vm.cartGroups = [];

        vm.isAllSelected = false;
        vm.toggleAllSelected = toggleAllSelected;
        vm.toggleShopSelected = toggleShopSelected;
        vm.toggleProductSelected = toggleProductSelected;

        vm.deleteInvalid = deleteInvalid;
        vm.deleteSelected = deleteSelected;

        vm.isIos = jq.os.ios ? true : false;

        vm.count = 0;
        vm.allMoney = 0;

        vm.canBuy = false;

        vm.status = "normal"; // normal, edit

        vm.pageStatus = "loading"; // loading, empty, notEmpty

        vm.gotoCategory = function () {
            utils.gotoUrl("/stage/category");
        };

        vm.gotoProduct = function (product) {
            var url = utils.getUrlWithParams("/product/detail", {
                productId: product.productId,
                promotionType: 'aging'
            });
            utils.gotoUrl(url);
        };

        vm.countFn = {
            canMin: function (product) {
                return (product.quantity > 1);
            },
            canMax: function (product) {
                return (product.quantity < 10);
            },
            minusCount: function (product) {
                if (vm.countFn.canMin(product)) {
                    product.quantity--;
                    countMoney();

                    updateProductCount(product);
                }
            },
            addCount: function (product) {
                if (vm.countFn.canMax(product)) {
                    product.quantity++;
                    countMoney();

                    updateProductCount(product);
                }
            }
        };

        vm.gotoAddProduct = function () {
            utils.gotoUrl("/stage/category");
        };

        function deleteInvalid() {
            httpRequest.getReq(urlHelper.getUrl('cartDeleteInvalid'), null, {
                type: 'POST'
            }).then(function (d) {
                utils.alert("移除失效商品成功。");
                reload();
            }, function (e) {
                utils.error("移除失效商品失败。");
            });
        }

        function getSelectedCartIds() {
            var cartIds = [];

            for (var i = 0; i < vm.cartGroups.length; i++) {
                var group = vm.cartGroups[i];

                for (var j = 0; j < group.carts.length; j++) {
                    if (group.carts[j].isSelected) {
                        cartIds.push(group.carts[j].cartId);
                    }
                }
            }

            return cartIds;
        }

        function deleteSelected() {

            var cartIds = getSelectedCartIds();

            if (cartIds && cartIds.length > 0) {
                httpRequest.getReq(urlHelper.getUrl('cartDeleteMore'), null, {
                    type: 'POST',
                    data: {
                        cartIds: cartIds
                    }
                }).then(function (d) {
                    reload();
                }, function (e) {
                    utils.error("删除选中商品失败。");
                });
            } else {
                utils.alert("请至少选择一件商品，再进行删除。");
            }

        }

        function editCart() {
            vm.status = (vm.status === 'normal') ? 'edit' : 'normal';

            if ($rootScope.navConfig && $rootScope.navConfig.rightBtnAttrs) {
                $rootScope.navConfig.rightBtnAttrs.text = (vm.status === 'normal') ? '编辑' : '完成';
            }

        }

        function updateProductCount(product) {
            httpRequest.getReq(urlHelper.getUrl('cartUpdateCount'), null, {
                type: 'POST',
                data: {
                    cartId: product.cartId,
                    quantity: product.quantity
                }
            });
        }

        function toggleAllSelected() {
            var select = !vm.isAllSelected;

            vm.isAllSelected = select;

            for (var i = 0; i < vm.cartGroups.length; i++) {
                var group = vm.cartGroups[i];
                group.isSelected = select;

                for (var j = 0; j < group.carts.length; j++) {
                    var product = group.carts[j];
                    product.isSelected = select;
                }
            }

            countMoney();
        }

        function checkAllSelected() {
            var select = true;
            for (var i = 0; i < vm.cartGroups.length; i++) {
                if (!vm.cartGroups[i].isSelected) {
                    select = false;
                    break;
                }
            }
            vm.isAllSelected = select;
        }

        function checkShipSelected(group) {
            var select = true;
            for (var i = 0; i < group.carts.length; i++) {
                if (!group.carts[i].isSelected) {
                    select = false;
                    break;
                }
            }
            group.isSelected = select;
        }

        function toggleShopSelected(group) {
            var select = !group.isSelected;
            group.isSelected = select;
            if (group && group.carts) {
                for (var i = 0; i < group.carts.length; i++) {
                    group.carts[i].isSelected = select;
                }
            }
            checkAllSelected();

            countMoney();
        }

        function toggleProductSelected(product, group) {
            product.isSelected = !product.isSelected;
            checkShipSelected(group);
            checkAllSelected();

            countMoney();
        }

        function countMoney() {

            var count = 0;
            var allMoney = 0;

            for (var i = 0; i < vm.cartGroups.length; i++) {
                var group = vm.cartGroups[i];

                for (var j = 0; j < group.carts.length; j++) {
                    var product = group.carts[j];
                    if (product.isSelected) {
                        count++;
                        allMoney += product.currPrice * product.quantity;
                    }
                }
            }

            vm.count = count;
            vm.allMoney = allMoney;

            checkButtonStatus();
        }

        function checkButtonStatus() {
            if (vm.count == 0) {
                vm.canBuy = true;
            } else {
                vm.canBuy = false;
            }
        }

        function getSelectedShopItems() {

            var shopItems = [];

            for (var i = 0; i < vm.cartGroups.length; i++) {
                var group = vm.cartGroups[i];
                var cartIds = [];
                var deliveryAddressIds = [];

                for (var j = 0; j < group.carts.length; j++) {
                    if (group.carts[j].isSelected) {
                        cartIds.push(group.carts[j].cartId);
                        deliveryAddressIds.push(group.carts[j].deliveryAddressId);
                    }
                }

                if (cartIds.length > 0) {
                    shopItems.push({
                        shopId: group.shop.id,
                        cartIds: cartIds,
                        deliveryAddressIds: deliveryAddressIds
                    });
                }
            }

            return shopItems;
        }

        vm.submitOrder = function () {
            var shopItems = getSelectedShopItems();
            utils.gotoUrl(utils.getUrlWithParams("/product/carconfirm", {
                shopItemsStr: JSON.stringify(shopItems)
            }));
        };

        function reload() {
            httpRequest.getReq(urlHelper.getUrl('cart'))
                .then(function (d) {
                    if (d && d.cartGroups) {
                        vm.cartGroups = d.cartGroups;
                    }

                    if (vm.cartGroups && vm.cartGroups.length > 0) {
                        vm.pageStatus = 'notEmpty';
                    } else {
                        vm.pageStatus = 'empty';
                        loadItems();
                    }
                });
        }

        vm.gotoProductDetail = gotoProductDetail;

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            utils.gotoUrl(url);
        }

        vm.items = [];
        function loadItems() {
            httpRequest.getReq(urlHelper.getUrl("doQueryRecommandDataByUser"), {
                limit: 40,
                offset: 1
            }).then(function (d) {
                var items = d.items;

                if (items && items.length <= 1) {
                    vm.canLoad = false;
                }

                var item = jq.extend({
                    rows: []
                });

                for (var i = 0; i < items.length;) {
                    var row = [];
                    row.push(items[i++]);

                    if (i >= items.length + 1) {
                        break;
                    } else {
                        row.push(items[i++]);
                    }
                    item.rows.push(row);
                }

                vm.items = vm.items.concat(item.rows);

            });
        }

        function init() {
            vm.requestParam = $stateParams;
            var unWatch = vm.$watch('requestParam', reload, true),
                unCountWatch = vm.$watch('count', checkButtonStatus, true);

            vm.$on('$destroy', function () {
                unWatch();
                unCountWatch();
            });
        }

        init();
    }

});
