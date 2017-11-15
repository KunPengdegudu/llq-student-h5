/**
 * profile my order all controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'jq',
    'screens/profile/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('quotaPromotionCtrl', quotaPromotion);

    ////////
    quotaPromotion.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$loadingOverlay',
        '$q',
        '$window',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    function quotaPromotion($scope, $rootScope, $location, $loadingOverlay, $q, $window, httpRequest, urlHelper, constant, utils) {
        var vm = $scope;
        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "提额",
                isShow: true
            }, $location);
        }

        vm.pageInfo = {
            carouselIndex: 0,
            imgSize: {
                width: 640,
                height: 320
            },
            styles: {
                height: "90%"
            },
            slides: [{
                id: 's1',
                url: '/blanknote/main',
                img: "../../assets/imgs/banner/banner1.png",
                title: "支付宝",
                price: '9000'
            }]
        };

        vm.gotoProduct = function (productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            if (productId) {
                utils.gotoUrl(url);
            }
        };

        vm.fun = function(slide){
            console.log(slide)
        }
        vm.gotoActive  =function (){
            utils.gotoUrl('/activity/aQuota')
        }
        vm.gotoApp = function() {
            utils.customDialog('亲，您未完成认证', '您的认证未申请或暂未通过，当前无可用额度哦。请在APP中【我的认证】页查看当前认证状态。', '我知道了,去下载', function (btnIdx) {
                if (btnIdx == 2) {
                    utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                }
            });
        }
        function carouselLoad() {
            httpRequest.getReq(urlHelper.getUrl('getAdvancedCertProductList'), null, {
                ignoreLogin: true
            }).then(function (d) {
                vm.slides = [];
                if (d.items) {
                    for (var i = 0; i < d.items.length; i++) {
                        var s = d.items[i];
                        vm.slides.push({
                            id: 's' + s.id,
                            img: utils.htmlDecode(s.icoUrl),
                            title: s.title
                        });
                    }
                }
            }, function () {
                console.log(2)
            });


        }

        vm.carouseClick = function (url) {

        }

        function init() {
            carouselLoad();
        }

        init()
    }

});