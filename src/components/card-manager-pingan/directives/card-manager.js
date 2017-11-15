define(['angular',
    'jq',
    'text!components/card-manager-pingan/views/card-manager-tpl.html'
], function (angular, jq, cardManagerTpl) {

    'use strict';

    angular
        .module('components.cardManager', [])
        .directive('cardManager', cardManagerProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/card-manager-pingan/views/card-manager-tpl.html', cardManagerTpl);
        }]);

    cardManagerProvider.$inject = [
        'httpRequest',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    var CARD_BIND_URL = "/m/s/pingan/pay/jd_bind_card.json",// 绑卡
        CARD_UNBIND_URL = "/m/s/pingan/pay/jd_unbind_card.json",// 解绑
        QUERY_BANK_URL = "/m/s/pingan/pay/query_bank_u.json",// 查询能绑卡的银行
        QUERY_BIND_CARDS_URL = "/m/s/pingan/pay/query_bind_cards.json",//查询绑定的银行卡
        GET_USER_INFO = '/m/s/user/get_user_info.json';   //查询用户信息;

    function cardManagerProvider(httpRequest, constant, utils) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'components/card-manager-pingan/views/card-manager-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope;

                vm.userInfo = null;

                vm.cardList = null;
                vm.hasBindCard = false;
                vm.lockBindBtn = false;

                var reloadCardsFn = vm.$eval($attribute.reloadCardsFn),
                    selectedFn = vm.$eval($attribute.selectedFn);

                vm.isCardListEmpty = function () {
                    if (vm.cardList && vm.cardList.length > 0) {
                        return false;
                    }
                    return true;
                };

                vm.reloadForCards = reloadForCards;

                function reloadForCards() {
                    httpRequest.getReq(QUERY_BIND_CARDS_URL)
                        .then(function (d) {
                            vm.hasBindCard = false;
                            vm.cardList = d.items;

                            var defItem = null;

                            if (vm.cardList && vm.cardList.length > 0) {
                                vm.hasBindCard = true;
                                var item;
                                for (var i = 0; i < vm.cardList.length; i++) {
                                    item = vm.cardList[i];
                                    item.cardStateStr = (item.status == 'normal') ? "已确认" : "确认中";

                                    // 默认选中一个银行卡
                                    if (item.status == 'normal') {
                                        defItem = item;
                                        break;
                                    }
                                }
                            }

                            if (reloadCardsFn) {
                                reloadCardsFn(defItem);
                            }
                        });
                }

                vm.bankCardList = {
                    isVisible: false,
                    openDialog: function () {
                        vm.bankCardList.isVisible = true;
                        reloadForCards();
                    },
                    closeDialog: function () {
                        vm.bankCardList.isVisible = false;
                    },
                    selected: function (item) {
                        if (item.status == 'normal') {
                            if (selectedFn) {
                                selectedFn(item);
                            }
                            vm.bankCardList.closeDialog();
                        }
                    },
                    flush: function () {
                        reloadForCards();
                    }
                };

                vm.bankCardListEdit = {
                    isVisible: false,
                    openDialog: function () {
                        httpRequest.getReq(GET_USER_INFO).then(function (d) {
                            if (d.name) {
                                vm.bankCardListEdit.isVisible = true;
                                reloadForCards();
                            } else {
                                utils.customDialog("亲，您未完成认证", "绑定银行卡前。请在APP中【我的认证】页面完成任意一个产品认证，以确认您的身份。", "我知道了,下载App", function (idx) {
                                    if (idx == 2) {
                                        utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                                    }
                                });
                            }
                        })
                    },
                    closeDialog: function () {
                        vm.bankCardListEdit.isVisible = false;
                    }
                };


                vm.checkUserAuth = function () {
                    console.log('asdad')
                    httpRequest.getReq(GET_USER_INFO).then(function (d) {
                        if (d.name) {
                            vm.addCardDialog.openDialog();
                        } else {
                            utils.customDialog("亲，您未完成认证", "绑定银行卡前。请在APP中【我的认证】页面完成任意一个产品认证，以确认您的身份。", "我知道了,下载App", function (idx) {
                                if (idx == 2) {
                                    utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                                }
                            });
                        }
                    })


                };

                vm.addCardDialog = {
                    isVisible: false,
                    showBigCardNo: false,
                    bigCardNo: null,
                    canScan: false,
                    item: {},
                    onFocus: function () {
                        this.showBigCardNo = true;
                        this.onChange();
                    },
                    onBlur: function () {
                        this.showBigCardNo = false;
                    },
                    onChange: function () {
                        if (this.item.cardNo) {
                            this.item.cardNo = this.item.cardNo.replace(/\D/g, '');
                            if (this.item.cardNo.length > 19) {
                                this.item.cardNo = this.item.cardNo.substring(0, 19);
                            }
                            this.bigCardNo = this.item.cardNo.replace(/(.{4})/g, "$1 ");
                        } else {
                            this.bigCardNo = this.item.cardNo;
                        }
                    },
                    scan: function () {
                        // TODO
                        alert("scan");
                    },
                    openDialog: function () {
                        vm.addCardDialog.isVisible = true;
                        vm.addCardDialog.item = {};
                        vm.lockBindBtn = false;

                        //v1验证
                        if (vm.userInfo && vm.userInfo.completeStatus == "un_completed") {
                            utils.customDialog('亲，您未完成v1认证', '请先完成注册成为我们的会员！', '先逛逛,去注册', function () {
                                utils.gotoUrl(constant.AUTH_V1);
                            }); // 去认证V1
                        }
                    },
                    closeDialog: function () {
                        vm.addCardDialog.isVisible = false;
                    },
                    check: function () {
                        if (utils.isEmpty(vm.addCardDialog.item.bankName)) {
                            utils.error("请选择要绑定的银行!");
                            return false;
                        }
                        if (utils.isEmpty(vm.addCardDialog.item.cardNo)) {
                            utils.error("请输入要绑定的银行卡号!");
                            return false;
                        }
                        if (!utils.checkCardNo(vm.addCardDialog.item.cardNo)) {
                            utils.error("银行卡号输入有误!");
                            return false;
                        }
                        return true;
                    },
                    bind: function () {    //邦卡函数（切换页面，提交数据，将数据显示在银行卡管理页面）
                        if (vm.addCardDialog.check()) {
                            vm.lockBindBtn = true;

                            utils.confirm("亲，请确认银行与银行卡号填写正确无误，以免由于错误信息影响正常使用。", function (buttonIndex) {
                                if (buttonIndex == 2) {
                                    httpRequest.getReq(CARD_BIND_URL, null, {
                                        type: 'post',
                                        data: {
                                            'id': vm.addCardDialog.item.bankId,
                                            'bankNo': vm.addCardDialog.item.bankNo,
                                            'cardNo': vm.addCardDialog.item.cardNo
                                        }
                                    }).then(function (d) {
                                        reloadForCards();
                                        vm.lockBindBtn = false;
                                        vm.bankCardListEdit.closeDialog();
                                        vm.addCardDialog.closeDialog();
                                    }, function (d) {
                                        vm.lockBindBtn = false;
                                        utils.error("绑卡失败：" + d.msg);
                                    });
                                } else {
                                    vm.lockBindBtn = false;
                                }
                            });
                        }
                    }
                };

                vm.showCardDialog = {
                    isVisible: false,
                    item: {},
                    openDialog: function (item) {
                        vm.showCardDialog.isVisible = true;
                        vm.showCardDialog.item = item;
                    },
                    closeDialog: function () {
                        vm.showCardDialog.isVisible = false;
                    },
                    unbind: function () {
                        utils.confirm("亲，是否确定解绑此银行卡", function (buttonIndex) {
                            if (buttonIndex == 2) {
                                var requestParam = {
                                    'userFundAccountId': vm.showCardDialog.item.userFundAccountId
                                };
                                httpRequest.getReq(CARD_UNBIND_URL, requestParam)
                                    .then(function (d) {
                                        reloadForCards();
                                        vm.showCardDialog.closeDialog();
                                    }, function (d) {
                                        utils.error("银行卡解绑失败：" + d.msg);
                                    });
                            }

                        });
                    },
                    canUnbind: function () {
                        return (vm.showCardDialog.item.status == 'normal');
                    }
                };


                vm.bankDialog = {
                    isVisible: false,
                    items: {},
                    openDialog: function () {
                        vm.bankDialog.isVisible = true;
                    },
                    closeDialog: function () {
                        vm.bankDialog.isVisible = false;
                    },
                    selectBank: function (item) {
                        vm.addCardDialog.item.bankName = item.bankName;
                        vm.addCardDialog.item.bankNo = item.bankNo;
                        vm.addCardDialog.item.bankId = item.id;
                        vm.bankDialog.closeDialog();
                    },
                    checkSelected: function (item) {
                        if (vm.addCardDialog.item.bankId == item.id) {
                            return true;
                        }
                        return false;
                    }
                };

                httpRequest.getReq(constant.GET_USER_INFO)
                    .then(function (d) {
                        vm.userInfo = d;
                    });

                httpRequest.getReq(QUERY_BANK_URL)
                    .then(function (d) {
                        vm.bankDialog.items = d.items;
                    });

                reloadForCards();
            }
        };
    }
});