define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileOrderAssessCtrl', ProfileOrderAssessCtrl);


    ProfileOrderAssessCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS',
        'CONSTANT_STYLE_URL_PREFIX'
    ];
    function ProfileOrderAssessCtrl($rootScope, $scope, $state, $stateParams, $timeout, $window, httpRequest, $location, urlHelper, utils, urlPrefix) {
        var vm = $scope;

        var order_id = $stateParams.orderId,
            isAdd = $stateParams.isAdd ? true : false;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: isAdd ? '订单追评' : "订单评价",
                isShowLeftBtn: true,
                leftBtnType: "back",
                isShow: true
            }, $location);
        }

        vm.rightIndex = -1;

        vm.isAdd = isAdd;
        vm.orderDetails = [];
        vm.assessDetails = [];

        vm.assessPics = {
            parentIdx: null
        };

        vm.subEva = function () {
            if (isAdd) {
                vm.addEvaluate.submitAddEva();
            } else {
                vm.evaluateDialog.submitEva();
            }
        };

        // photo

        vm.idx = null;
        vm.item = null;
        vm.openPhotoDialog = function (parentIdx) {
            if(checkImgCount(parentIdx)){
                vm.pIdx = parentIdx;
                vm.cIdx = null;
                vm.photo.dialogOpen();
            }

            // vm.evaluateDialog.imgSrcs.push('http://img001.007fenqi.com/product/1441543303955_d2bd9ae0a68817349f0bf5ae639ff3f2.jpg')
        };

        vm.openPhotoDialogRest = function () {
            vm.photo.dialogOpen();
        };

        vm.deleteImg=deleteImg;

        function deleteImg(){

            if(isAdd){
                vm.addEvaluate.details[vm.pIdx].picUrls.splice(vm.cIdx,1);
            }else{
                vm.assessDetails[vm.pIdx].picUrls.splice(vm.cIdx,1);
            }
            vm.photoView.dialogClose();
        }

        function checkImgCount(pIdx){
            if(isAdd){
               if(vm.addEvaluate.details[pIdx].picUrls.length==5){
                   utils.alert('亲，最多上传五张图片哦');
                   return false;
               }
            }else{
                if(vm.assessDetails[pIdx].picUrls.length==5){
                    utils.alert('亲，最多上传五张图片哦');
                    return false;
                }
            }
            return true;
        }

        vm.getIdx=function(parentIdx){
            vm.pIdx=parentIdx;
        };

        vm.photoView = {
            power:'modify',
            isVisible: false,
            rightImg:null,
            dialogBeforeHide: function () {
                return true;
            },
            dialogOpen: function (power,img, childIdx) {
                vm.photoView.rightImg=img;
                vm.photoView.power=power;
                vm.cIdx = childIdx;
                vm.photoView.isVisible = true;
            },
            dialogClose: function () {
                vm.photoView.isVisible = false;
            }
        };
        vm.getPhotoUploadUrl = getPhotoUploadUrl;
        vm.onPhotoUploadSuccessFn = onPhotoUploadSuccessFn;

        function getPhotoUploadUrl(imgType, photo) {
            return urlPrefix + urlHelper.getUrl('imgUpload');
        }

        function onPhotoUploadSuccessFn(response, imgType, photo) {
            if (response.data && response.data.items && response.data.items[0]) {
                var item = response.data.items[0];
                var content = item.url;
                if (isAdd) {
                    if (vm.cIdx||vm.cIdx==0) {
                        vm.addEvaluate.details[vm.pIdx].picUrls[vm.cIdx] = content;
                    } else {
                        vm.addEvaluate.details[vm.pIdx].picUrls.push(content)
                    }
                } else {
                    if (vm.cIdx||vm.cIdx==0) {
                        vm.assessDetails[vm.pIdx].picUrls[vm.cIdx] = content;
                    } else {
                        vm.assessDetails[vm.pIdx].picUrls.push(content);
                    }
                }
                vm.photoView.dialogClose();
            }
        }


        //追加评论
        vm.addEvaluate = {
            details: [],
            finalDetails: [],
            detailsContent: {
                subOrderId: null,
                evaluate: null,
                picUrls: []
            },
            submitAddEva: function () {
                if (vm.addEvaluate.haveComment()) {
                    for (var i = 0; i < vm.addEvaluate.details.length; i++) {
                        if (vm.addEvaluate.details[i].evaluate) {
                            vm.addEvaluate.finalDetails.push(vm.addEvaluate.details[i]);
                        }
                    }
                    httpRequest.getReq(urlHelper.getUrl('additionalEvaluate'), null, {
                        type: 'POST',
                        data: {
                            orderId: order_id,
                            details: vm.addEvaluate.finalDetails
                        }
                    }).then(function (d) {
                        utils.gotoUrl('/profile/allAssess');
                    }, function (d) {
                        utils.error('抱歉，评价失败 '+d.msg);
                    })
                }
            },
            haveComment: function () {
                var count = 0;
                for (var i = 0; i < vm.addEvaluate.details.length; i++) {
                    if (vm.addEvaluate.details[i].picUrls.length > 0 && !vm.addEvaluate.details[i].evaluate) {
                        utils.alert('亲，请为上传的图片配上评论');
                        return false;
                    }
                    if (vm.addEvaluate.details[i].evaluate) {
                        count++;
                    }
                }
                if (count == 0) {
                    utils.alert('请填写至少一个商品的追加评论内容');
                    return false;
                } else {
                    return true;
                }

            }


        };

        vm.evaluateDialog = {
            selects1: [1, 2, 3, 4, 5],
            selects2: [1, 2, 3, 4, 5],
            selects3: [1, 2, 3, 4, 5],
            isAnonymity: true,
            imgSrcs: [
                'http://img001.007fenqi.com/product/1441543303955_d2bd9ae0a68817349f0bf5ae639ff3f2.jpg',
                'http://img001.007fenqi.com/product/%E9%85%B7%E6%B4%BEF23.jpg',
                'http://img001.007fenqi.com/product/%E8%8D%A3%E8%80%807%E9%93%B61.jpg'],
            isSelecteds1: function (index, parentIdx) {
                if (index <= vm.assessDetails[parentIdx].productDescScore) {
                    return true;
                } else {
                    return false;
                }
            },
            isSelecteds2: function (index) {
                if (index <= vm.rightIndex2) {
                    return true;
                } else {
                    return false;
                }
            },
            isSelecteds3: function (index) {
                if (index <= vm.rightIndex3) {
                    return true;
                } else {
                    return false;
                }
            },
            //是否匿名
            isCheck: function () {
                if (vm.evaluateDialog.isAnonymity) {
                    vm.evaluateDialog.isAnonymity = false;
                } else {
                    vm.evaluateDialog.isAnonymity = true;
                }

            },
            chooseDesc: function (index, parentIdx) {

                vm.assessDetails[parentIdx].productDescScore = index;
            },
            chooseService: function (index) {
                vm.rightIndex2 = index;
            },
            chooseSpeed: function (index) {
                vm.rightIndex3 = index;
            },

            //判断用户是否给卖家描述/发货速度/物流评分,并给出相应提示
            des: "请给卖家的",
            isChoose: function () {
                vm.rightIndex1 = 1;
                for (var i = 0; i < vm.assessDetails.length; i++) {
                    if (!vm.assessDetails[i].productDescScore) {
                        vm.rightIndex1 = null
                    }
                }
                if (vm.rightIndex1 && vm.rightIndex2 && vm.rightIndex3) {
                    return true;
                } else {
                    if (!vm.rightIndex1) {
                        vm.evaluateDialog.des += "卖家描述";
                    }
                    if (!vm.rightIndex2) {
                        if (!vm.rightIndex1) {
                            vm.evaluateDialog.des += '、'
                        }
                        vm.evaluateDialog.des += "卖家服务";
                    }
                    if (!vm.rightIndex3) {
                        if (!vm.rightIndex2 || !vm.rightIndex1) {
                            vm.evaluateDialog.des += '、';
                        }
                        vm.evaluateDialog.des += "发货速度";
                    }
                    vm.evaluateDialog.des += "评分";
                    utils.error(vm.evaluateDialog.des);
                    vm.evaluateDialog.des = "请给卖家的";
                    return false;
                }

            },

            //提交用户评价
            submitEva: function () {
                if (vm.evaluateDialog.isChoose()) {
                    var requestParam = {
                        orderId: order_id,  //订单号
                        anonymity: vm.evaluateDialog.isAnonymity,
                        sellerServiceScore: vm.rightIndex2,   //卖家服务分
                        logisticsServiceScore: vm.rightIndex3,  //物流服务分
                        //isAnonymity:true,   //是否匿名
                        details: vm.assessDetails //评价商品列表
                    };
                    httpRequest.getReq(urlHelper.getUrl('submitEvaluation'), null, {
                        type: 'POST',
                        data: requestParam,
                        ignoreLogin: true
                    }).then(function (d) {
                        utils.gotoUrl(vm.assessUrl);
                    }, function (d) {
                        utils.error('抱歉，评价失败 ' + d.msg);
                    })
                }
            }


        };

        //初始化

        function init() {

            //根据商品id获得商品信息   (调接口)
            httpRequest.getReq(urlHelper.getUrl('getOrder'), {
                order_id: order_id
            }).then(function (d) {
                vm.assessUrl = utils.getUrlWithParams('/product/assesssuccess', {
                productId: d.productId,
                promotionId: d.promotionId,
                promotionType: d.type
            });
                if (d.orderDetails) {
                    vm.orderDetails = d.orderDetails;
                    for (var i = 0; i < d.orderDetails.length; i++) {
                        vm.assessDetails.push({
                            subOrderId: d.orderDetails[i].id,
                            evaluate: null,
                            picUrls: [],
                            productDescScore: null
                        });
                    }
                } else {
                    vm.orderDetails.push(d);
                    vm.assessDetails.push({
                        subOrderId: d.id,
                        evaluate: null,
                        picUrls: [],
                        productDescScore: null
                    });
                }

                if (isAdd) {
                    vm.assessDetails = [];
                    vm.copyOrderDetails = vm.orderDetails;
                    vm.orderDetails = [];
                    httpRequest.getReq(urlHelper.getUrl('getEvaluate'), {orderId: order_id}).then(function (data) {
                        for (var i = 0; i < data.details.length; i++) {
                            if (!data.details[i].canAdditionalEvaluate) {
                            } else {
                                vm.orderDetails.push(vm.copyOrderDetails[i]);
                                data.details[i].evaluate = data.details[i].evaluate ? data.details[i].evaluate : '没有填写评论！';
                                vm.assessDetails.push(data.details[i]);
                                vm.addEvaluate.details.push({
                                    subOrderId: data.details[i].orderDetailId,
                                    evaluate: null,
                                    picUrls: []
                                });
                            }
                        }
                    }, function (d) {

                    })
                }


            }, function (d) {
            });


        }

        init();

    }

});
