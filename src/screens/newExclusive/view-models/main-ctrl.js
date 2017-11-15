/**
 * newExclusive main controller
 * @create 2016/09/11
 * @author dxw
 */
define([
    'screens/newExclusive/module',
    'jq',
    'screens/newExclusive/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('newExclusiveMainCtrl', newExclusiveMain);

    ////////
    newExclusiveMain.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        '$loadingOverlay',
        '$timeout',
        'httpRequest',
        'newExclusiveUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function newExclusiveMain($rootScope, $scope, $state, $location, $stateParams, $q, $window, $loadingOverlay, $timeout, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            loadingTimer;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                isShowRightBtn: true,
                rightBtnType: "icon",
                rightBtnAttrs: {
                    icon: "icon-share",
                    fn: shareBtnFn
                },
                title: "新人专享",
                isShow: true
            }, $location);
        }

        vm.bannerImgSrc = 'queryBanners';

        vm.gotoProductDetail = gotoProductDetail;

        vm.rulesDialog = {
            isVisible: false,
            openDialog: function () {
                vm.rulesDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.rulesDialog.isVisible = false;
            }
        }

        function gotoProductDetail(productId, promotionId, promotionType) {

            if ($rootScope.loginStatus) {
                httpRequest.getReq(urlHelper.getUrl('checkFetchRequireU'), {
                    ignoreLogin: true
                }).then(function (d) {
                    if (d.basicCreditActive == false) {
                        utils.customDialog('亲，您未完成认证', '请先完成注册成为我们的会员！', '先逛逛,去注册', gotoAuthV1);
                    } else {
                        queryForBuy(productId, promotionId, promotionType);
                    }
                }, function (d) {
                    utils.error(d.msg || "服务器忙，请稍后进行购买")
                });
            } else {
                utils.confirm("亲，未登录状态下不能购买此物品,前去登录", function () {
                    utils.gotoUrl("/login");
                })
            }
        }

        function queryForBuy(productId, promotionId, promotionType) {
            httpRequest.getReq(urlHelper.getUrl('queryForBuy'), {
                'productId': productId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var url = utils.getUrlWithParams('#/product/detail', {
                    productId: productId,
                    promotionId: promotionId,
                    promotionType: promotionType
                });
                location.replace(url);
            }, function (d) {
                if (d.data == "notV2") {
                    utils.customDialog('提醒', d.msg, '先逛逛,去认证', gotoAuthV2);
                } else {
                    utils.alert(d.msg || "服务器忙，请稍后重试");
                }
            });
        }

        function gotoAuthV1(btnIdx) {
            if (btnIdx == 1) {
                utils.gotoUrl("/enter/main");
            } else if (btnIdx == 2) {
                utils.gotoUrl("/auth/main");
            }
        }

        function gotoAuthV2(btnIdx) {
            if (btnIdx == 1) {
                utils.gotoUrl("/enter/main");
            } else if (btnIdx == 2) {
                utils.gotoUrl("/auth/main");
            }
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

        function loadItems() {
            showLoading();
            httpRequest.getReq(urlHelper.getUrl('listPagedFreshManProductInfo'), {}, {
                ignoreLogin: true
            }).then(function (d) {
                vm.items = d.items;
                loaderComplete();
            }, function (d) {
                utils.error(d.msg || "服务器忙，请稍后重试");
                loaderComplete();
            });
        }

        vm.shareInfo = {
            title: constant.DEFAULT_SHARE_INFO.title,
            description: constant.DEFAULT_SHARE_INFO.description,
            thumb: constant.DEFAULT_SHARE_INFO.thumb,
            shareUrl: constant.DEFAULT_SHARE_INFO.baseUrl + utils.getUrlWithParams("/newExclusive/main", $state.params)
        };
        function shareBtnFn() {
            vm.shareInfo.title = $rootScope.navConfig.title;
            vm.shareInfo.thumb = "https://m.007fenqi.com/app/assets/imgs/active/newExclusive.jpg";
            vm.shareInfo.description = "零零期商城“开学季限时1元包邮抢”活动开始了，快去围观";
            if (vm.initPaymentInfoResult) {
                vm.shareInfo.title = vm.shareInfo.title + "，月供低至" + vm.initPaymentInfoResult.everyAmount + "元";
            }

            vm.shareObject.dialogOpen();
        }

        function init() {
            loadItems();
        }

        init();
    }

});