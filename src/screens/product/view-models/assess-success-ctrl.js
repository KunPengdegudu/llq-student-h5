define([
    'screens/product/module',
    'jq',
    'screens/product/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProductAssessSuccessCtrl', ProductAssessSuccess);

    ////////
    ProductAssessSuccess.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$location',
        '$timeout',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'productUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ProductAssessSuccess($scope, $rootScope, $state,$stateParams, $location, $timeout, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope;

        var DO_QUERY_RECOMMEND_DATA_BY_USER = '/recommend/doQueryRecommandDataByUser.json';


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "评论成功",
                isShow: true
            }, $location);
        }
        // vm.moneyTitle = (_pay_type==='repay')?"还款金额":"订单金额"

        //分享
        vm.shareBtnFn=shareBtnFn;
        function shareBtnFn() {
            if (vm.data && vm.data.productDTO) {
                vm.shareInfo.title = vm.data.productDTO.name;
                vm.shareInfo.thumb = vm.data.productDTO.proMainImgUrl + "@!300x300";
                if (vm.initPaymentInfoResult) {
                    vm.shareInfo.title = vm.shareInfo.title + "，月供低至" + vm.initPaymentInfoResult.everyAmount + "元";
                }
            }

            vm.shareObject.dialogOpen();
        }

     
        vm.shareInfo = {
            title: constant.DEFAULT_SHARE_INFO.title,
            description: constant.DEFAULT_SHARE_INFO.description,
            thumb: constant.DEFAULT_SHARE_INFO.thumb,
            shareUrl: constant.DEFAULT_SHARE_INFO.baseUrl + utils.getUrlWithParams("/product/detail", $state.params)
        };
        //评论成功
        vm.gotoMyAssess=function(){
            utils.gotoUrl('/profile/allAssess')
        };


        vm.goHome=goHome;
        function goHome(){
            utils.gotoUrl('/enter/main');
        }
        // vm.shareFn=shareFn;
        var currentUrl = utils.getUrlWithParams("/product/paysuccess", {
            billNo: $stateParams.billNo,
            money: $stateParams.money,
            text: $stateParams.text
        });
        

        vm.getThemeUrl='getThemeResource';
        vm.share={
            isVisible:false,
            envelopeTitle:'分享给好友领取现金',
            themeResourceId:null,
            title:null,
            summary:null,
            smallPicUrl:null,
            openDialog:function(){
                vm.share.isVisible=true;
            },
            closeDialog:function(){
                vm.share.isVisible=false;
            }
        };
        // vm.allowShareItems = [{
        //     img: "../../assets/imgs/share/weixin.png",
        //     text: "微信好友",
        //     allow: !!(navigator.wechat && navigator.wechat.share),
        //     fn: function () {
        //         var Wechat = navigator.wechat;
        //         if (Wechat) {
        //             Wechat.isInstalled(function (installed) {
        //                 if (installed) {
        //
        //                     var param = {};
        //
        //                     param.scene = Wechat.Scene.SESSION;
        //
        //                     param.message = {
        //                         title: vm.share.title,
        //                         description: vm.share.summary,
        //                         thumb: vm.share.smallPicUrl,
        //                         media: {
        //                             type: Wechat.Type.WEBPAGE,
        //                             webpageUrl: 'http://show.007fenqi.com/app/share/index.html?state='+ vm.share.themeResourceId
        //                         }
        //                     };
        //
        //                     Wechat.share(param, function () {
        //                     }, function (reason) {
        //                         utils.alert("分享失败：" + reason);
        //                     });
        //
        //                 } else {
        //                     utils.alert("亲，您没有安装微信App，请安装后再进行分享。");
        //                 }
        //             });
        //         }
        //     }
        // }, {
        //     img: "../../assets/imgs/share/timeline.png",
        //     text: "微信朋友圈",
        //     allow: !!(navigator.wechat && navigator.wechat.share),
        //     fn: function () {
        //         var Wechat = navigator.wechat;
        //         if (Wechat) {
        //             Wechat.isInstalled(function (installed) {
        //                 if (installed) {
        //
        //                     var param = {};
        //
        //                     param.scene = Wechat.Scene.TIMELINE;
        //
        //                     param.message = {
        //                         title: vm.share.title,
        //                         description: vm.share.summary,
        //                         thumb: vm.share.smallPicUrl,
        //                         media: {
        //                             type: Wechat.Type.WEBPAGE,
        //                             webpageUrl: 'http://show.007fenqi.com/app/share/index.html?state='+ vm.share.themeResourceId
        //                         }
        //                     };
        //
        //                     Wechat.share(param, function () {
        //                     }, function (reason) {
        //                         utils.alert("分享失败：" + reason);
        //                     });
        //
        //                 } else {
        //                     utils.alert("亲，您没有安装微信App，请安装后再进行分享。");
        //                 }
        //             });
        //         }
        //     }
        // }];


        vm.gotoProductDetail = gotoProductDetail;

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            utils.gotoUrl(url);
        }



        function init() {
            httpRequest.getReq(DO_QUERY_RECOMMEND_DATA_BY_USER, {
                limit: 10,
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


                vm.items = item.rows;
            })
        }

        init();

    }

});
