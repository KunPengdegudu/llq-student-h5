/**
 * Created by fionaqin on 2017/8/29.
 */
define([
    'screens/groupBuying/module',
    'jq',
    'screens/groupBuying/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('GroupBuyingDetailsCtrl', GroupBuyingDetails);

    GroupBuyingDetails.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$q',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'groupBuyingUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function GroupBuyingDetails($rootScope, $scope, $state, $stateParams, $q, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, constant, utils) {
        var vm = $scope;
        var _tuanId = $stateParams.tuanId,
            _status = $stateParams.status;

        vm.showPtIndex = false;   //回到首页
        vm.pageTitle = '参团详情';
        vm.isShowLeftBtn = false;
        switch (_status) {
            case "unchange":
                vm.pageTitle = "参团详情";
                vm.isShowLeftBtn = true;
                $rootScope.navConfig.leftBtnAttrs = {
                    url: "/groupBuying/main"
                };
                vm.showPtIndex = true;
                break;
            case "change":
                vm.pageTitle = "支付成功";
                vm.isShowLeftBtn = false;
                vm.showPtIndex = true;
                break;
            default:
                vm.pageTitle = "参团详情";
                vm.isShowLeftBtn = false;
                vm.showPtIndex = false;
        }

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: vm.isShowLeftBtn,
                leftBtnType: "back",
                title: vm.pageTitle,
                isShow: true
            }, $location);
        }

        vm.shareGuideDialog = {
            isVisible: false,
            openDialog: function () {
                vm.shareGuideDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.shareGuideDialog.isVisible = false;
            }
        }

        vm.data = {};
        vm.ptProductPrice = null;   //商品价格
        vm.userPtProductSkuId = null;
        vm.productPrice = 0;   //拼团价格
        vm.productAllStock = 0;  //总库存
        vm.productStock = 0;   //库存

        vm.numberDiff = 0;    //还差几人
        vm.groupStatus = '已成团';
        vm.ptStatus = null;    //拼团状态   0--待团长支付  1--拼团中  4--拼团失败   6--拼团成功
        vm.productStatus = null;   //商品是否失效

        //地址相关
        vm.selectItem = null;
        vm.complete = false;
        vm.recommendList = [];   //更多拼团商品列表

        vm.selectedSku = [];    //存放选中的sku

        vm.productDetailInfoDTOSkus = [];   //可选的skus分类
        vm.ptProductSkuDOList = [];   //进行比对的skuId
        vm.shareSkuAttrVOList = [];


        //接口请求、页面跳转时需要传的参数
        vm.ptProductId = null;   //拼团商品活动id

        vm.productId = null;
        vm.productSkuId = null;
        vm.ptProductSkuId = null;

        vm.shopName = '';
        vm.name = '';
        vm.goodsDesc = '';
        vm.productImg = '';    //弹框内产品图
        vm.desc = '';


        //倒计时
        vm.currTime = null;   //当前时间（服务器时间）
        vm.mistime = 0;   //时间差
        vm.endTime = 0;   //商品活动结束时间
        vm.isDeleted = false;  //商品是否被删除
        vm.hour = null;
        vm.minute = null;
        vm.second = null;

        vm.showTuanInfo = false;
        //团成员弹框
        vm.memberInfo = [];    //团成员信息（含团长）
        vm.ptMember = [];   //团员信息（不含团长）
        vm.imgInfo = [];     //存放团成员图片
        vm.ptLeaderInfo = {};   //团长信息
        vm.ptLeaderPhone = null;
        vm.showMemberList = false;

        vm.tuanInfoList = [];   //团列表  （"重新开个团"时   显示）

        //控制按钮显示 or 隐藏
        vm.showInvitation = false;    //邀请好友
        vm.showJion = false;    //一键参团
        vm.showStroll = false;    //逛逛其他团
        vm.showCreatePtAgain = false;     //重新开个团
        vm.showPgBtn = false;    //拼光了
        vm.showOtherPt = false;


        //产品弹框
        vm.joinGrouponDialog = {
            isVisible: false,
            openDialog: function () {
                vm.joinGrouponDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.joinGrouponDialog.isVisible = false;
            },
            selectAttr: function () {

            }
        }

        //团员弹框
        vm.grouponInfoDialog = {
            isVisible: false,
            openDialog: function () {
                vm.grouponInfoDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.grouponInfoDialog.isVisible = false;
            }
        }


        vm.gotoUrl = gotoUrl;
        function gotoUrl(url) {
            utils.gotoUrl(url);
        }

        //（重新开个团）团列表"立即参团"——跳转到参团详情页
        vm.gotoGroupDetails = gotoGroupDetails;
        function gotoGroupDetails(item) {
            var url = utils.getUrlWithParams('/groupBuying/details', {
                tuanId: item.id,
                status: 'unchange'
            });
            utils.gotoUrl(url);
        }

        //(重新开个团) —— 跳转到产品详情页
        vm.recreatePt = recreatePt;
        function recreatePt() {
            var url = utils.getUrlWithParams('/groupBuying/product', {
                'ptProductId': vm.ptProductId,
                'productId': vm.productId
            });
            utils.gotoUrl(url);
        }

        //获取收货地址
        function showDeliveryList() {
            httpRequest.getReq(urlHelper.getUrl('showDeliveryList'), null, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items && d.items.length > 0) {
                    vm.selectItem = d.items[0];
                    vm.addressId = d.items[0].addressId;
                    vm.complete = d.items[0].complete;
                }
            });
        }

        vm.chooseAddressFn = function (addressItem) {
            if (addressItem) {
                vm.selectItem = addressItem;
                vm.addressId = addressItem.addressId;
                vm.complete = addressItem.complete;
            }
        };


        //跳转到订单确认页
        vm.gotoGrouponOrderConfirm = gotoGrouponOrderConfirm;
        function gotoGrouponOrderConfirm() {
            if (vm.hasStock) {
                var url;
                if (vm.selectItem) {
                    url = utils.getUrlWithParams('/groupBuying/orderConfirm', {
                        'addressId': vm.addressId,
                        'productId': vm.productId,
                        'proSkuId': vm.productSkuId,
                        'ptProductSkuId': vm.ptProductSkuId,
                        'pinTuanId': _tuanId
                    });
                    if (utils.checkLogin($rootScope, $location, null, url)) {
                        utils.gotoUrl(url);
                    }
                } else {
                    url = $window.location.hash.substr(1);
                    if (utils.checkLogin($rootScope, $location, null, url)) {
                        utils.alert("请填写收货地址", function () {
                            vm.joinGrouponDialog.closeDialog();
                        });
                    }
                }
            } else {
                utils.alert('库存不足', function () {
                    vm.joinGrouponDialog.closeDialog();
                });

            }

        }


        //团详情
        vm.getGroupDetail = getGroupDetail;
        function getGroupDetail() {
            httpRequest.getReq(urlHelper.getUrl('getGroupDetail'), {
                tuanId: _tuanId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                vm.data = d;
                vm.mistime = d.endTime - d.currTime;    //时间差

                vm.memberInfo = d.ptTuanItemDTOList;
                vm.productId = d.productId;
                vm.ptProductId = d.ptProductId;
                vm.ptStatus = d.status;    //拼团状态
                vm.numberDiff = d.joinNum - d.currJoinNum;

                getChoicenessList();
                getPtTuanList();

                if (d.ptProductDTO) {
                    vm.productAllStock = d.ptProductDTO.stock;   //总库存
                    vm.productStatus = d.ptProductDTO.status;    //商品是否失效
                    vm.endTime = d.ptProductDTO.endTime;    //商品活动结束时间
                    vm.isDeleted = d.ptProductDTO.isDeleted;    //商品是否被删除
                }

                if (vm.numberDiff == 0) {
                    vm.groupStatus = '已成团';
                } else {
                    vm.groupStatus = '还差' + vm.numberDiff + '人';
                }

                for (var i = 0; i < d.joinNum; i++) {
                    vm.imgInfo.push('../../../app/assets/imgs/groupon/icon_tuxedodetails_nobody.png');
                }


                if (d.joinNum && vm.memberInfo && vm.memberInfo.length > 0) {
                    vm.showTuanInfo = true;
                    vm.memberInfo.forEach(function (item, ind) {
                        if (item.captain) {
                            vm.imgInfo.splice(ind, 1, '../../../app/assets/imgs/groupon/image_avatar_leader.png');
                        } else {
                            vm.imgInfo.splice(ind, 1, '../../../app/assets/imgs/groupon/image_default_avatar.png');
                        }
                    });
                }

                //倒计时
                $interval(function () {
                    if (vm.mistime > 0) {
                        vm.mistime = vm.mistime - 1000;
                        var s, m, h;
                        s = (parseInt(vm.mistime / 1000)) % 60;
                        m = (parseInt(vm.mistime / 1000 / 60)) % 60;
                        h = parseInt(vm.mistime / 1000 / 60 / 60);
                        vm.hour = (h > 9) ? h : ('0' + h);
                        vm.minute = (m > 9) ? m : ('0' + m);
                        vm.second = (s > 9) ? s : ('0' + s);
                    } else {
                        vm.hour = "00";
                        vm.minute = "00";
                        vm.second = "00";
                    }
                }, 1000);

                //判断按钮状态
                if (vm.productAllStock == 0) {
                    return renderButton(1);   //拼光了
                } else {
                    //拼团失败
                    if (vm.ptStatus === 4) {
                        //商品失效 or 删除
                        if (vm.productStatus === 4 || vm.isDeleted) {
                            renderButton(3);
                        }

                        //拼团活动是否过期
                        if (d.currTime >= vm.endTime) {
                            renderButton(3);
                        } else {
                            if (vm.productStatus === 4 || vm.isDeleted) {
                                renderButton(3);
                            } else {
                                renderButton(0);
                            }
                        }
                    }

                    //拼团中
                    if (vm.ptStatus == 1) {
                        //商品失效 or 删除
                        if (vm.productStatus === 4 || vm.isDeleted) {
                            renderButton(3);
                        }

                        //是否是团成员
                        if (d.member) {
                            if (vm.numberDiff == 0) {
                                renderButton(3);
                            } else {
                                renderButton(4);
                            }
                        } else {
                            if (vm.numberDiff == 0) {
                                renderButton(0);
                            } else {
                                renderButton(2);
                            }
                        }


                    }

                    //拼团成功
                    if (vm.ptStatus == 6) {
                        if (d.member) {
                            renderButton(3);
                        } else {
                            renderButton(0);
                        }
                    }
                }

                vm.renderButton = renderButton;
                function renderButton(type) {
                    switch (type) {
                        case 0:
                            vm.showCreatePtAgain = true; //重新开个团
                            break;
                        case 1:
                            vm.showPgBtn = true;   //拼光了
                            break;
                        case 2:
                            vm.showJion = true;    //一键参团
                            break
                        case 3:
                            vm.showStroll = true;   //逛逛其他团
                            break
                        case 4:
                            vm.showInvitation = true;   //邀请好友
                            break;
                        default :
                            break;
                    }
                }


                if (vm.memberInfo && vm.memberInfo.length > 0) {
                    vm.ptLeaderInfo = vm.memberInfo[0];
                    vm.ptLeaderPhone = vm.memberInfo[0].phone;
                    if (vm.ptLeaderPhone) {
                        vm.ptLeaderPhone = vm.ptLeaderPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                    }
                    if (vm.memberInfo.length >= 1) {
                        vm.ptMember = vm.memberInfo.slice(1);
                        if (vm.ptMember.length > 0) {
                            vm.showMemberList = true;
                            vm.ptMember.forEach(function (item, idx) {
                                if (item.phone) {
                                    item.phone = item.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                                } else {
                                    item.phone = null;
                                }
                            });
                        } else {
                            vm.showMemberList = false;
                        }
                    }
                }


                var initSelectedSku = {};
                if (d && d.productDetailInfoDTO && d.productDetailInfoDTO.skus && d.productDetailInfoDTO.skus.length > 0) {

                    var productDTO = d.productDetailInfoDTO;
                    vm.productDetailInfoDTOSkus = d.productDetailInfoDTO.skus;

                    var initSkusId = null;
                    if (productDTO.product && productDTO.product.sku) {
                        initSkusId = productDTO.product.sku.id;
                        if (productDTO.product.sku.skuAttributeList) {

                            //初始化sku
                            if (d && d.shareSkuAttrVOList && d.shareSkuAttrVOList.length > 0) {
                                //初始选中有货列表第一个sku组合
                                for (var i = 0; i < d.shareSkuAttrVOList.length; i++) {
                                    var itemSkuList = d.shareSkuAttrVOList[i].shareSkuAttrItemDTOList;
                                    if (itemSkuList && itemSkuList.length > 0) {
                                        initSelected(itemSkuList, false);
                                        itemSkuList.forEach(function (itemSkuObj, idx) {
                                            productDTO.product.sku.skuAttributeList.forEach(function (itemSku, idx) {
                                                if (itemSku.attributeValueId == itemSkuObj.id) {
                                                    vm.selectedSku.push(itemSkuObj);
                                                }
                                            });
                                        });
                                    }
                                }
                                initSelected(vm.selectedSku, true);
                            }
                        }

                        if (d.ptProductSkuDOList && d.ptProductSkuDOList.length > 0) {
                            d.ptProductSkuDOList.forEach(function (item, idx) {
                                if (initSkusId == item.skuId) {
                                    vm.productPrice = item.itemPrice;
                                }
                            })
                        }
                    }

                }

                if (d.productDetailInfoDTO && d.productDetailInfoDTO.product) {
                    vm.productInfo = d.productDetailInfoDTO.product;
                    vm.productImg = vm.productInfo.imgUrl;
                    vm.shopName = vm.productInfo.shopName;
                    vm.goodsDesc = vm.productInfo.productSkuTag;
                    vm.name = vm.productInfo.name;

                    if (d.productDetailInfoDTO.product.sku && d.productDetailInfoDTO.product.sku.id) {
                        vm.defaultSkuId = d.productDetailInfoDTO.product.sku.id;
                    }
                }
                vm.shareSkuAttrVOList = d.shareSkuAttrVOList;

                if (d && d.productDetailInfoDTO && d.productDetailInfoDTO.skus && d.productDetailInfoDTO.skus.length > 0) {

                    vm.productDetailInfoDTOSkus = d.productDetailInfoDTO.skus;
                }

                if (d && d.ptProductDTO && d.ptProductDTO.ptProductSkuDOList && d.ptProductDTO.ptProductSkuDOList.length > 0) {
                    vm.ptProductSkuDOList = d.ptProductDTO.ptProductSkuDOList;

                    vm.ptProductSkuDOList.forEach(function (item, idx) {
                        if (item.skuId == vm.defaultSkuId) {
                            vm.ptProductPrice = item.itemPrice;    //默认的商品价格
                        }
                    });

                    if (d.member) {
                        if (d.ptTuanItemDTOList && d.ptTuanItemDTOList.length > 0) {
                            d.ptTuanItemDTOList.forEach(function (item, index) {
                                if (item.buyerId == d.userId) {
                                    vm.userPtProductSkuId = item.ptProductSkuId;
                                }
                            });
                        }

                        vm.ptProductSkuDOList.forEach(function (item, index) {
                            if (item.id == vm.userPtProductSkuId) {
                                vm.ptProductPrice = item.itemPrice;    //用户购买的价格
                            }

                        })
                    }

                }
                getSkuResult(vm.selectedSku);

            }, function (err) {
                utils.alert(err.msg);
            });
        }

        //选中操作
        vm.select = function (category, item) {

            initSelected(category.shareSkuAttrItemDTOList, false);

            item.isSelect = true;

            vm.selectedSku.forEach(function (itemIndex, index) {
                if (itemIndex.skuAttrId == category.id) {
                    vm.selectedSku.splice(index, 1);
                    vm.selectedSku.push(item);
                }
            })

            getSkuResult(vm.selectedSku);
        }


        function getSkuResult(items) {
            //处理数据
            var result = '';
            var newResult = '';
            items.sort(function (a, b) {
                return a.id - b.id;
            });


            items.forEach(function (itemId, ind) {
                result += itemId.id + ",";
                newResult = result.substring(0, result.length - 1);
            });

            vm.hasStock = false;
            //根据获得的数据结果进行比对
            if (vm.productDetailInfoDTOSkus.length > 0 && vm.ptProductSkuDOList.length > 0) {
                vm.productDetailInfoDTOSkus.forEach(function (itemSku, idx) {
                    if (itemSku.skuItemIds == newResult) {
                        vm.desc = itemSku.productSkuTag;
                        vm.ptProductSkuDOList.forEach(function (item, index) {
                            if (itemSku.id == item.skuId) {
                                vm.productSkuId = item.skuId;
                                vm.ptProductSkuId = item.id;

                                vm.productPrice = item.itemPrice;  //拼团价格
                                vm.productStock = item.stock;   //库存
                                if (item.stock && item.stock > 0) {
                                    vm.hasStock = true;
                                } else {
                                    vm.hasStock = false;
                                }

                            }
                        });
                    }
                });
            }

        }

        function getChoicenessList() {
            httpRequest.getReq(urlHelper.getUrl('getMorePtProductList'), null, {
                type: 'POST',
                data: {
                    categoryId: null,
                    choiceness: true,
                    expulserPtProductIds: [vm.ptProductId]
                },
                ignoreLogin: true
            }).then(function (d) {

                if (d.items && d.items.length > 0) {
                    d.items.forEach(function (item, idx) {
                        vm.recommendList = d.items;
                    });
                    vm.recommendList.forEach(function (item, idx) {
                        if (item.exemptionPostage) {
                            item.exemptionPostageText = "包邮";
                        } else {
                            item.exemptionPostageText = "不包邮";
                        }

                        item.isBtnActive = false;

                        if (item.stock <= 0) {
                            item.tuanStatus = "拼光了";
                            item.isBtnActive = false;

                        } else {
                            item.tuanStatus = "立即开团";
                            item.isBtnActive = true;
                        }
                    });
                }
            });
        }

        //当前商品开团列表
        function getPtTuanList() {
            httpRequest.getReq(urlHelper.getUrl('getPtTuanList'), {
                ptProductId: vm.ptProductId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.ptTuanDTOList && d.ptTuanDTOList.length > 0) {
                    vm.showOtherPt = true;
                    if (d.ptTuanDTOList.length > 2) {
                        vm.tuanInfoList = d.ptTuanDTOList.slice(0, 2);
                    } else {
                        vm.currTime = d.currTime;
                        vm.tuanInfoList = d.ptTuanDTOList;
                    }


                    vm.tuanInfoList.forEach(function (item, ind) {
                        if (item.ptTuanItemDTOList && item.ptTuanItemDTOList.length > 0) {
                            item.phone = item.ptTuanItemDTOList[0].phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                        }
                        dropDown(item);
                    })
                } else {
                    vm.showOtherPt = false;
                }
            });
        }

        vm.gotoProductDetails = gotoProductDetails;
        function gotoProductDetails(item) {
            var url = utils.getUrlWithParams('/groupBuying/product', {
                'ptProductId': item.id,
                'productId': item.productId
            });
            utils.gotoUrl(url);
        }


        function setDialog() {
            var dialogH = jq("#userDialog");
            var h = jq($window).height() * 0.464;
            dialogH.css("height", h + "px");
        }


        //插件类函数
        //初始化选中
        function initSelected(arr, bool) {
            //arr 数组    bool 初始化状态值：bool
            arr.forEach(function (item, idx) {
                item.isSelect = bool;
            })
            return arr;
        }

        //删除数组中指定项
        function remove(arr, item) {
            if (arr.length) {
                var index = arr.indexOf(item);
                if (index > -1) {
                    return arr.splice(index, 1)
                }
            }
        }

        //倒计时
        function dropDown(item) {
            item.timeDiff = item.endTime - vm.currTime;
            $interval(function () {
                if (item.timeDiff > 0) {
                    item.timeDiff = item.timeDiff - 1000;
                    item.dropDown = timeFormat(item.timeDiff);
                } else {
                    item.dropDown = "00" + ":" + "00" + ":" + "00";
                }
            }, 1000);
        }

        //时间格式处理
        var data = {};

        function timeFormat(time) {
            if (time && time > 0) {
                var thisTime = parseInt(time);
                if (typeof (thisTime) == 'number') {
                    var s, m, h;
                    s = (parseInt(time / 1000)) % 60;
                    m = (parseInt(time / 1000 / 60)) % 60;
                    h = parseInt(time / 1000 / 60 / 60);
                    data.hour = (h > 9) ? h : ('0' + h);
                    data.minute = (m > 9) ? m : ('0' + m);
                    data.second = (s > 9) ? s : ('0' + s);
                    return data.hour + ":" + data.minute + ":" + data.second;
                }
            }
        }

        vm.doOrder = function () {
            if (vm.shareSkuAttrVOList.length > 0) {
                vm.joinGrouponDialog.openDialog();
            } else {
                vm.productSkuId = vm.productInfo.sku.id;
                vm.ptProductSkuDOList.forEach(function (item, index) {
                    if (vm.productSkuId == item.skuId) {
                        vm.ptProductSkuId = item.id;
                    }
                });
                if (vm.productAllStock > 0) {
                    vm.hasStock = true;
                }
                gotoGrouponOrderConfirm();

            }
        }

        function init() {
            getGroupDetail();
            setDialog();
            showDeliveryList();
        }

        init();


    }
})
;