define(['angular',
    'jq',
    'text!components/card-manager-ebao/views/card-manager-tpl.html'
], function (angular, jq, cardManagerTpl) {

    'use strict';

    angular
        .module('components.cardManager', [])
        .directive('cardManager', cardManagerProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/card-manager-ebao/views/card-manager-tpl.html', cardManagerTpl);
        }]);

    cardManagerProvider.$inject = [
        '$interval',
        'httpRequest',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    var CARD_BIND_URL = "/m/s/pay/jd_bind_card.json",// 绑卡
        CONFIRM_BIND_CARD = "/m/s/yeepay/pay/confirm_bind_card.json", //确认绑卡
        CARD_UNBIND_URL = "/m/s/pay/jd_unbind_card.json",// 解绑
        QUERY_CARD_LIST = "/m/s/pay/query_userCard_list.json",// 银行卡列表
        QUERY_BANKINFO_LIST = "/m/s/pay/query_bankInfo_list.json", //
        QUERY_BIND_CARD = '/m/s/pay/confirm_bind_card.json', //提交验证
        FAILURE_REBIND_CARD = '/m/s/pay/failure_rebind_card.json';

    function cardManagerProvider($interval, httpRequest, constant, utils) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'components/card-manager-ebao/views/card-manager-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope;

                vm.userInfo = null;

                vm.cardList = null;
                vm.hasBindCard = false;
                vm.lockBindBtn = false;
                vm.closeListName = '';
                vm.closeListCode = '';


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
                    httpRequest.getReq(QUERY_CARD_LIST).then(function (d) {
                        console.log(d.items.status)
                            vm.hasBindCard = false;
                            vm.cardList = d.items;

                            var defItem = null;

                            if (vm.cardList && vm.cardList.length > 0) {
                                vm.hasBindCard = true;
                                var item;
                                for (var i = 0; i < vm.cardList.length; i++) {
                                    item = vm.cardList[i];
                                    // item.cardStateStr = (item.status == 'normal') ? "已绑定" : "已解绑";
                                    // 默认选中一个银行卡
                                    if (defItem == null && item.status == 'normal') {
                                        defItem = item;
                                    }
                                }
                            }

                            if (reloadCardsFn) {
                                reloadCardsFn(defItem, vm.cardList);
                            }
                        });
                }


                vm.bankCardList = {
                    isVisible: false,
                    openDialog: function () {
                        vm.bankCardList.isVisible = true;
                        reloadForCards();
                    },
                    closeDialog: function (data,id) {
                        vm.bankCardList.isVisible = false;
                        if (data) {
                            vm.bankCardAccount = data
                            vm.bankCardAccountId = id
                        }
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

                vm.cardAuthCode = {
                    show: false,
                    val: null,
                    bindRequestNo: null,
                    index: 60,
                    timer: null,
                    reset: function () {
                        vm.cardAuthCode.show = false;
                        vm.cardAuthCode.val = null;
                        vm.cardAuthCode.bindRequestNo = null;
                        vm.cardAuthCode.index = 60;
                        if (vm.cardAuthCode.timer) {
                            $interval.cancel(vm.cardAuthCode.timer);
                            vm.cardAuthCode.timer = null;
                        }
                    },
                    open: function (bindRequestNo) {
                        vm.cardAuthCode.reset();
                        vm.cardAuthCode.show = true;
                        vm.cardAuthCode.bindRequestNo = bindRequestNo;
                        vm.cardAuthCode.timer = $interval(function () {
                            vm.cardAuthCode.index--;
                        }, 1000, 60);
                        vm.cardAuthCode.timer.then(function () {
                            vm.cardAuthCode.reset();
                        }, function () {
                            vm.cardAuthCode.reset();
                        });
                    },
                    submit: function () {
                        if (utils.isEmpty(vm.cardAuthCode.val)) {
                            utils.error("请输入验证码!");
                            return false;
                        }
                        httpRequest.getReq(CONFIRM_BIND_CARD, null, {
                            type: 'post',
                            data: {
                                'bindRequestNo': vm.cardAuthCode.bindRequestNo,
                                'smsCode': vm.cardAuthCode.val
                            }
                        }).then(function (d) {
                            vm.cardAuthCode.reset();
                            vm.addCardDialog.completeBind();
                        }, function (d) {
                            utils.error(d.msg);
                        });
                    }
                };


                vm.checkUserAuth = function () {
                    console.log(123);
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
                        vm.cardAuthCode.reset();
                        vm.addCardDialog.isVisible = true;
                        vm.addCardDialog.item = {};
                        vm.lockBindBtn = false;
                        // v1验证
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
                        if (utils.isEmpty(vm.closeListName)) {
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
                    completeBind: function () {
                        reloadForCards();
                        vm.lockBindBtn = false;
                        vm.bankCardListEdit.closeDialog();
                        vm.addCardDialog.closeDialog();
                    },
                    bind: function () {    //邦卡函数（切换页面，提交数据，将数据显示在银行卡管理页面）
                        if (vm.addCardDialog.check()) {
                            vm.lockBindBtn = true;

                            utils.customDialog("确认银行卡", "亲，请确认银行与银行卡号填写正确无误，以免由于错误信息影响正常使用。", "取消,确定", function (buttonIndex) {
                                if (buttonIndex == 2) {
                                    httpRequest.getReq(CARD_BIND_URL, null, {
                                        type: 'post',
                                        data: {
                                            'cardNo': vm.addCardDialog.item.cardNo,
                                            'bankCode': vm.closeListCode
                                        }
                                    }).then(function (d) {
                                        // 易宝接口
                                        // if (d.bindPayChannel = "yeepay_api") {
                                        //     vm.cardAuthCode.open(d.bindRequestNo);
                                        // }
                                        // else {
                                        //     vm.addCardDialog.completeBind();
                                        // }
                                        vm.authCode.openDialog();
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
                                httpRequest.getReq(CARD_UNBIND_URL, null, {
                                    type: 'POST',
                                    data: {
                                        unBindFundId: vm.showCardDialog.item.id
                                    }
                                }).then(function (d) {
                                    console.log(d)
                                    reloadForCards();
                                    vm.showCardDialog.closeDialog();
                                },function (res) {
                                    utils.error(res.msg)
                                });
                            }

                        });
                     }
                };
                vm.addBankDialog = {
                    isVisible: false,
                    addBankList:[],
                    openDialog: function () {
                        vm.addBankDialog.isVisible = true;
                        this.bankList();
                    },
                    closeDialog: function () {
                        vm.addBankDialog.isVisible = false;
                    },
                    bankList: function () {
                        httpRequest.getReq(QUERY_BANKINFO_LIST, null, {
                            type: 'POST'
                        }).then(function (d) {
                            vm.addBankDialog.addBankList = d.items
                        }, function (d) {
                            utils.error(d.msg);
                        });
                    },
                    closeListDialog: function(code,name) {
                        vm.closeListCode = code;
                        vm.closeListName = name;
                        vm.addBankDialog.closeDialog()
                    }
                }
                vm.changeDialog = {
                    isVisible: false,
                    openDialog: function () {
                        vm.changeDialog.isVisible = true;
                    },
                    closeDialog: function () {
                        vm.changeDialog.isVisible = false;
                    }
                };
                vm.authCode = {
                    phoneMi:'',
                    codeText: '',
                    isVisible:false,
                    btn: {
                        enable: true,
                        text: '获取验证码',
                        index: 0,
                        timer: null,
                        reset: function () {
                            vm.authCode.btn.text = '获取验证码';
                            vm.authCode.btn.enable = true;
                            vm.authCode.btn.timer = null;
                        }
                    },
                    openDialog: function (data) {
                        vm.authCode.isVisible = true;
                        vm.authCode.codeText = '';
                        vm.authCode.endAuthCode();
                        if (data) {
                            vm.userFundAccountId = data;
                        }
                        console.log(data)
                    },
                    closeDialog: function () {
                        vm.authCode.isVisible = false;
                    },
                    endAuthCode: function () {
                        vm.authCode.btn.enable = false;
                        vm.authCode.btn.index = 60;
                        vm.authCode.btn.timer = $interval(function () {
                            vm.authCode.btn.index--;
                            vm.authCode.btn.text = "重新获取(" + vm.authCode.btn.index + " s)";
                        }, 1000, 60);
                        vm.authCode.btn.timer.then(function () {
                            vm.authCode.btn.reset();
                        }, function () {
                            vm.authCode.btn.reset();
                        })
                    },
                    sendAuthCode: function () {
                        if (vm.userFundAccountId) {
                            httpRequest.getReq(FAILURE_REBIND_CARD, null, {
                                type: 'POST',
                                data: {
                                    unBindFundId: vm.userFundAccountId
                                }
                            }).then(function (d) {
                                vm.authCode.endAuthCode()
                            });
                        } else {
                            httpRequest.getReq(CARD_BIND_URL, null, {
                                type: 'post',
                                data: {
                                    'cardNo': vm.addCardDialog.item.cardNo,
                                    'bankCode': vm.closeListCode
                                }
                            }).then(function (d) {
                                vm.authCode.endAuthCode()
                            });
                        }
                    },
                    successBtn: function () {
                        httpRequest.getReq(QUERY_BIND_CARD, null, {
                            type: 'POST',
                            data: {
                                cardNo: vm.addCardDialog.item.cardNo?vm.addCardDialog.item.cardNo:vm.userFundAccountId,
                                verifyCode: vm.authCode.codeText
                            }
                        }).then(function (d) {
                            if (vm.addCardDialog.item.cardNo) {
                                utils.alert('绑卡成功')
                                reloadForCards()
                                vm.authCode.isVisible = false;
                                vm.addCardDialog.isVisible = false;
                                vm.listWithholdingInfoByUserId();
                            } else {
                                utils.alert('银行卡验证成功')
                                reloadForCards()
                                vm.authCode.isVisible = false;
                                vm.addCardDialog.isVisible = false;
                                vm.listWithholdingInfoByUserId();
                            }



                        }, function (d) {
                            utils.error(d.msg);
                        });
                    }
                };
                httpRequest.getReq(constant.GET_USER_INFO)
                    .then(function (d) {
                        vm.userInfo = d;
                        vm.authCode.phoneMi = d.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                    });

                reloadForCards();
            }
        };
    }
});