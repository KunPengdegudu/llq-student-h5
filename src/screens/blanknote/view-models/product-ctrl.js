/**
 * sale main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/blanknote/module',
    'jq',
    'screens/blanknote/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('BlankNoteProductCtrl', BlankNoteProduct);

    ////////
    BlankNoteProduct.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        'httpRequest',
        'settingCache',
        '$loadingOverlay',
        '$timeout',
        'blankNoteUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function BlankNoteProduct($rootScope, $scope, $location, $stateParams, $q, httpRequest, settingCache, $loadingOverlay, $timeout, urlHelper, constant, utils) {
        var vm = $scope;
        vm.lock = false;
        var canBindInfo = settingCache.get('__req_info_user_have_name');


        var loadingTimer;
        var _userSource = $stateParams.userSource,
            _name = $stateParams.name,
            _productType = $stateParams.productType;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                currentUrl: "/blanknote/main",
                leftBtnType: "back",
                title: _name,
                isShow: true,
                isShowRightBtn: true,
                rightBtnType: "text",
                rightBtnAttrs: {
                    text: '常见问题',
                    fn: loanExplation
                }
            }, $location);
        }

        vm.blankNote = {
            loanAmount: 0,
            source: "app",
            peroid: null,
            accountType: null,
            purpose: null,
            userFundAccountId: null,
            memo: null
        };

        vm.canFromContact = (navigator.contacts) ? true : false;

        vm.firstRepay = {};

        vm.isAgree = true;

        vm.canShow = true;

        vm.bannerSrc = null;

        vm.gotoTaskShare = function () {
            utils.gotoUrl('/works/task/share');
        };
        vm.useCoupon = useCoupon;

        vm.blankNoteAmountList = null;
        vm.cashApplyPurposeVOList = null;
        vm.cashInterestRuleList = null;
        vm.supportAccountFundTypeList = null;

        vm.bankCardAccount = null;
        vm.bankCardAccountId = null;
        vm.alipayAccount = null;
        vm.alipayAccountId = null;

        vm.serviceAccount = null;
        vm.blankBalanceCreditAmount = 0;
        vm.blankTotalCreditAmount = 0;
        vm.blanknoteText = null;

        vm.cashApplyType = null;


        vm.showAllPurpose = false;
        vm.samePurposeList = [0, 1, 2];
        vm.foldBlankNotePurpose = function () {
            vm.showAllPurpose = false;
        };
        vm.moreBlankNotePurpose = function () {
            vm.showAllPurpose = true;
        };


        vm.showAllAmount = false;
        vm.sameAmountList = [0, 1, 2, 3, 4, 5, 6, 7];
        vm.foldAmounts = function () {
            vm.showAllAmount = false;
        };
        vm.moreAmounts = function () {
            vm.showAllAmount = true;
        };


        vm.quotaCount = null;
        vm.isSelectAmount = function (amount) {
            return amount == vm.blankNote.loanAmount;
        };
        vm.selectBlankNoteAmount = function (amount) {
            if (amount <= vm.blankBalanceCreditAmount && vm.blankNote.loanAmount != amount) {
                vm.blankNote.loanAmount = amount;
                getPeriodList();
            }
        };

        vm.serviceCouponsItems = null;

        vm.red = {
            isVisible: false,
            openDialog: function () {
                vm.red.isVisible = true;
            },
            closeDialog: function () {
                vm.red.isVisible = false;
            }
        };
        vm.contactUs = function () {
            utils.contactUs();
        };

        // 用途
        vm.isSelectPurpose = function (purpose) {
            return purpose.purposeCode == vm.blankNote.purpose;
        };
        vm.selectBlankNotePurpose = function (purpose) {
            if (vm.blankNote.purpose != purpose.purposeCode) {
                vm.blankNote.purpose = purpose.purposeCode;
            }
        };


        vm.isSelectPeriod = function (myPeriod) {
            return myPeriod == vm.blankNote.peroid;
        };

        vm.isSelectFundType = function (fundType) {
            return fundType == vm.blankNote.accountType;
        };

        vm.selectCashInterestRule = function (myPeriod) {
            if (vm.blankNote.peroid != myPeriod) {
                vm.blankNote.peroid = myPeriod;
                changePayment();
            }
        };

        vm.selectFundType = function (fundType) {
            if (vm.blankNote.accountType != fundType) {
                vm.blankNote.accountType = fundType;
                changePayment();
            }
        };

        vm.usualQuestion = function () {
            utils.gotoUrl('/profile/help/question')
        };

        function unlock() {
            vm.lock = false;
        }

        function setLock() {
            vm.lock = true;
        }


        function loanExplation() {
            utils.gotoUrl('/profile/help/question');
        }

        function getPeriodList() {
            httpRequest.getReq(urlHelper.getUrl("getCashLoanRuleByAmount"), {
                amount: vm.blankNote.loanAmount
            }).then(function (d) {
                if (d && d.cashLoanRuleDTO) {
                    var agingPeriods = d.cashLoanRuleDTO.agingPeriods || '';
                    vm.cashInterestRuleList = agingPeriods.split(",");
                    if (vm.cashInterestRuleList && vm.cashInterestRuleList.length > 0) {
                        vm.blankNote.peroid = vm.cashInterestRuleList[0];
                    }
                    vm.supportAccountFundTypeList = d.cashLoanRuleDTO.supportAccountFundTypeList;
                    if (vm.supportAccountFundTypeList && vm.supportAccountFundTypeList.length > 0) {
                        // 如果存在当前类型，不变
                        var hasFundType = false;
                        for (var i = 0; i < vm.supportAccountFundTypeList.length; i++) {
                            if (vm.blankNote.accountType == vm.supportAccountFundTypeList[i]) {
                                hasFundType = true;
                                break;
                            }
                        }
                        // 如果不存在当前类型，使用第一个
                        if (!hasFundType) {
                            vm.blankNote.accountType = vm.supportAccountFundTypeList[0];
                        }
                    }

                    changePayment();
                }
            });
        }

        function reload() {

            reloadForAlipay();
            reloadForService();

        }

        function changePayment() {

            reload();

            httpRequest.getReq(urlHelper.getUrl("getCashRepayments"), vm.blankNote)
                .then(function (d) {
                    if (d && d.items) {
                        vm.firstRepay = d.items[0];
                    }
                });
        }

        function loaderComplete() {
            $loadingOverlay.hide();

            if (loadingTimer) {
                $timeout.cancel(loadingTimer);
                loadingTimer = null;
            }
        }

        function showLoading(msg) {
            var template = "<div class='ui-loading'><img class='ui-loading-img' src='../../assets/imgs/base/loading.gif' /><div class='ui-loading-text'>" + msg + "</div></div></div>";
            $loadingOverlay.show(template);
            loadingTimer = $timeout(function () {
                $loadingOverlay.hide();
            }, 20000);
        }

        function closeOrder(orderId, fn) {
            httpRequest.getReq(urlHelper.getUrl('cancelOrder'), {
                order_id: orderId
            }).then(function (d) {
                if (fn) {
                    fn();
                }
            }, function (d) {
                if (fn) {
                    fn();
                }
            });
        }

        vm.successDialog = {
            isVisible: false,
            cashProduct: [],
            openDialog: function () {
                vm.successDialog.isVisible = true;
                vm.successDialog.getUserProductCash();
            },
            closeDialog: function () {
                vm.successDialog.isVisible = false;
            },
            getUserProductCash: function () {
                httpRequest.getReq(urlHelper.getUrl('getCashProduct'))
                    .then(function (d) {
                        if (d) {
                            vm.successDialog.cashProduct = d.items[0];
                        }
                    })
            },
            submit: function () {
                var url = utils.getUrlWithParams('/product/detail', {
                    'productId': vm.successDialog.cashProduct.product.id
                });
                utils.gotoUrl(url);
            }
        };

        function applySuccess() {
            /*utils.customDialog("申请借款成功", "亲，您的借款申请已经提交成功，借款金额将在稍后打到您的账号中，请耐心等待!", "先去逛逛,查看申请记录", function (buttonIndex) {
             if (buttonIndex == 1) {
             utils.gotoUrl("/enter/main");
             } else if (buttonIndex == 2) {
             utils.gotoUrl("/profile/myorder/ordercash");
             }
             });*/
            var url = utils.getUrlWithParams('/blanknote/applySuccess', {
                'money': vm.blankNote.loanAmount,
                'time': vm.blankNote.peroid
            })
            utils.gotoUrl(url);
        }

        function gotoSignContract(url, orderId) {
            // 废弃
            var attr = {
                title: "借款合同",
                onSuccessFn: applySuccess,
                onFailureFn: applyFailure
            };
            if (jq.os.android && navigator.appupdate && navigator.appupdate.openUrl) {
                utils.customDialog(attr.title, "亲，首次借款需要您签署电子合同，此合同需要您打开浏览器进行签署。", "关闭,打开合同", function (buttonIndex) {
                    if (buttonIndex == 1) {
                        applyFailure();
                    } else if (buttonIndex == 2) {
                        utils.customDialog("提醒", "亲，合同签署是否遇到问题？", "关闭订单,签署成功", function (buttonIndex) {
                            if (buttonIndex == 1) {
                                applyFailure();
                            } else if (buttonIndex == 2) {
                                utils.gotoUrl("/profile/myorder/ordercash");
                            }
                        });
                        utils.gotoBrowser(url);
                    }
                });
            } else {
                utils.gotoUrl(url, attr);
            }

            function applyFailure() {
                closeOrder(orderId);
                utils.customDialog('借款合同取消', '亲，您未同意借款合同，该借款订单已经被取消，如需借款请重新进行借款流程！', '关闭', function (buttonIndex) {
                });
            }
        }

        vm.doApply = function () {

            if (vm.blankNote.accountType == 'person_pingan') {
                vm.blankNote.userFundAccountId = vm.bankCardAccountId;
            } else if (vm.blankNote.accountType == 'person_alipay') {
                vm.blankNote.userFundAccountId = vm.alipayAccountId;
            }

            if (vm.autoRepaySignObject.userFundAccountId) {
                vm.blankNote.autoRepaySign = true;
                vm.blankNote.autoRepaySignFundAccId = vm.autoRepaySignObject.userFundAccountId;
            }

            if (vm.lock) {
                return;
            } else {
                setLock();
            }


            if (checkApply()) {
                httpRequest.getReq(urlHelper.getUrl('checkProductCert'), {
                    productCode: _productType
                }).then(function (d) {
                    if (d.censorStatus == 'passed') {

                        utils.confirm("亲，是否确认借款" + vm.blankNote.loanAmount + "元，分" + vm.blankNote.peroid + "期", function (btnIndex) {
                            if (btnIndex == 2) {

                                showLoading("正在拼命生成借款协议...");

                                httpRequest.getReq(urlHelper.getUrl("createCashOrderContract"), vm.blankNote, {
                                    type: "POST",
                                    timeout: 20000
                                }).then(function (d) {
                                    unlock();
                                    loaderComplete();

                                    if (d.signContractUrl) {

                                        var url = encodeURI(utils.htmlDecode(d.signContractUrl));

                                        if (navigator.appupdate && navigator.appupdate.openUrlInner && navigator.appupdate.closeUrlInner) {
                                            // 保存orderId
                                            settingCache.set("__blanknote_order_id", d.orderId);

                                            navigator.appupdate.openUrlInner('借款合同',
                                                url,
                                                urlHelper.getUrl("backBlanknote"),
                                                "亲，是否取消签署借款合同，如果合同未签署系统将会自动关闭本次借款？");
                                        } else {
                                            gotoSignContract(url, d.orderId);
                                        }
                                    } else {
                                        if (d && d.cashApplyType == 'product_cash') {
                                            vm.successDialog.openDialog();
                                        } else {
                                            applySuccess();
                                        }

                                    }

                                }, function (err) {
                                    unlock();
                                    loaderComplete();

                                    utils.error(err.msg || "服务器忙，请稍后再试");
                                });
                            } else {
                                unlock();
                            }
                        });
                    } else {
                        utils.customDialog("亲，您未完成认证", "您的认证在审核中或暂未通过，当前无可用额度哦。请在APP中【我的认证】页查看当前认证状态。", "我知道了,下载App", function (idx) {
                            if (idx == 2) {
                                utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                            }
                        });
                        return false;
                    }
                }, function (err) {
                    utils.error(err.msg || "服务器忙，请稍后重试");
                })
            } else {
                unlock();
            }
        };

        function checkApply() {

            if (vm.blankNote.loanAmount == 0) {
                utils.alert("请选择借款金额!");
                return false;
            }
            if (vm.blankBalanceCreditAmount < vm.blankNote.loanAmount) {
                utils.alert("亲，您的圆梦贷款的剩余额度不足，按时还款和多做任务有助于提升额度！");
                return false;
            }
            if (vm.blankNote.accountType == 'person_pingan') {
                if (utils.isEmpty(vm.bankCardAccountId)) {
                    utils.alert("请选择需要收款的银行卡帐号!");
                    return false;
                }
            } else if (vm.blankNote.accountType == 'person_alipay') {
                if (utils.isEmpty(vm.alipayAccountId)) {
                    utils.alert("请绑定需要收款的支付宝帐号!");
                    return false;
                }
            }
            if (vm.needUploadPhoneList) {
                utils.customDialog("温馨提示", "您的联系人信息已过期，请下载APP，补充您的紧急联系人电话。", "我知道了,下载App", function (idx) {
                    if (idx == 2) {
                        utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                    }
                });
                return false;
            }
            return true;
        }

        vm.gotoQuota = function () {
            utils.gotoUrl("/profile/quota/waitingFetch");
        };

        //bind bankCard
        vm.isEmpty = utils.isEmpty;


        // autoRepaySignObject
        vm.autoRepaySignObject = {
            userFundAccountId: null,
            userFundAccountNo: null,
            isInit: true,
            init: function (items) {
                if (!vm.autoRepaySignObject.isInit && items && items.length > 0) {
                    vm.autoRepaySignObject.isInit = true;
                    vm.autoRepaySignObject.userFundAccountId = items[0].userFundAccountId;
                    vm.autoRepaySignObject.userFundAccountNo = items[0].cardNo;
                }
            },
            selectedFn: function (item) {
                vm.autoRepaySignObject.userFundAccountId = item.userFundAccountId;
                vm.autoRepaySignObject.userFundAccountNo = item.cardNo;
            },
            toggleStatus: function () {
                if (vm.autoRepaySignObject.userFundAccountId == null) {
                    vm.cardFn.openSelectCard('autoRepay');
                } else {
                    vm.autoRepaySignObject.userFundAccountId = null;
                    vm.autoRepaySignObject.userFundAccountNo = null;
                }
            }
        };


        function reloadForAlipay() {
            vm.alipayAccountId = null;
            vm.alipayAccount = null;
            httpRequest.getReq(urlHelper.getUrl('getAlipayAccounts'))
                .then(function (d) {
                    if (d.items && d.items.length > 0) {
                        var item = d.items[0];
                        vm.alipayAccountId = item.id;
                        vm.alipayAccount = item.accNo;
                    }
                });
        }


        //运营商认证
        function reloadForService() {
            httpRequest.getReq(urlHelper.getUrl('getPhoneOperationPwd')).then(function (d) {
                vm.serviceAccount = d;
            }, function () {
                vm.serviceAccount = '';
            })
        }

        // alipay
        vm.alipay = {
            isVisible: false,
            newAlipayAccount: "",
            dialogBeforeHide: function () {
                vm.alipay.newAlipayAccount = "";
                return true;
            },
            openDialog: function () {
                if (canBindInfo) {
                    vm.alipay.newAlipayAccount = "";
                    vm.alipay.isVisible = true;
                } else {
                    utils.customDialog("亲，您未完成认证", "绑定支付宝前。请在APP中【我的认证】页面完成任意一个产品认证，以确认您的身份。", "我知道了,下载App", function (idx) {
                        if (idx == 2) {
                            utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                        } else {
                            vm.alipay.closeDialog();
                        }
                    });
                }

            },
            closeDialog: function () {
                vm.alipay.isVisible = false;
            },
            dialogSubmit: function () {
                var check = function () {
                    if (utils.isEmpty(vm.alipay.newAlipayAccount)) {
                        utils.error("新支付宝账号不能为空", vm.alipay.closeDialog);
                        return false;
                    }
                    return true;
                };

                if (check()) {
                    var requestParam = {
                        'acc_no': vm.alipay.newAlipayAccount
                    };
                    httpRequest.getReq(urlHelper.getUrl('bindFundAccount'), requestParam)
                        .then(function (d) {
                            vm.alipay.isVisible = false;
                            reloadForAlipay();
                            utils.alert("修改绑定支付宝账号成功");
                        }, function (d) {
                            utils.error("修改绑定支付宝账号失败：" + d.msg);
                        });
                }
            }
        };

        vm.agreementDialog = {
            isVisible: false,
            openDialog: function () {
                var content = jq("#agreementDialogContent");
                content.html('');
                vm.agreementDialog.isVisible = true;
                httpRequest.getReq(urlHelper.getUrl('jujianContract'))
                    .then(function (d) {
                        content.html(utils.htmlDecode(d));
                    });
            },
            closeDialog: function () {
                vm.agreementDialog.isVisible = false;
            }
        };

        //获取额度提升点券列表
        function checkCount() {
            httpRequest.getReq(urlHelper.getUrl('countFetchList'), {}, {
                ignoreLogin: true
            }).then(function (d) {
                vm.quotaCount = d;
            });
        }

        //额度提升
        function useCoupon(item) {
            if (item.status != 'waiting_fetch') {
                return false;
            }

            var params = {
                status: 'waiting_fetch',
                creditFetchStoreId: item.id
            };

            httpRequest.getReq(urlHelper.getUrl('fetchCredit'), params)
                .then(function (d) {
                    if (d) {
                        item.status = "fetched";
                        utils.alert("领取额度成功，您的额度已提升！", init);
                    }
                }, function (err) {
                    utils.error(err.msg || "领取额度失败！");
                });
            return true;
        }

        // cardFn
        vm.cardFn = {
            selectType: null, // blanknote, autoRepay
            openSelectCard: function (type) {
                vm.cardFn.selectType = type;
                vm.bankCardList.openDialog();
            },
            reloadCardsFn: function (item, items) {
                if (item) {
                    if (!vm.bankCardAccountId) {
                        vm.bankCardAccountId = item.userFundAccountId;
                        vm.bankCardAccount = item.cardNo;
                    }
                } else {
                    vm.bankCardAccountId = null;
                    vm.bankCardAccount = null;
                }

                vm.autoRepaySignObject.init(items);
            },
            selectedFn: function (item) {
                if (item) {
                    if (vm.cardFn.selectType == 'autoRepay') {
                        vm.autoRepaySignObject.selectedFn(item);
                    } else {
                        vm.bankCardAccountId = item.userFundAccountId;
                        vm.bankCardAccount = item.cardNo;
                    }
                }
            }
        };

        function bannerSrc(bannerType) {
            httpRequest.getReq(urlHelper.getUrl('queryBanners'), {
                type: bannerType
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d.items && d.items.length != 0) {
                    vm.bannerSrc = d.items[0].imgUrl;
                }
            });
        }

        vm.getBlanknotExplain = getBlanknotExplain;
        vm.blanknoteType = false;
        function getBlanknotExplain() {
            if (!vm.blanknoteType) {
                vm.blanknoteType = true;
                vm.iconRightArrow = {
                    transform: 'rotate(90deg)',
                    transformOrigin: 'left center',
                    marginTop: '-10px'
                }
            } else if (vm.blanknoteType) {
                vm.blanknoteType = false;
                vm.iconRightArrow = {
                    transform: 'rotate(0)',
                    transformOrigin: 'left center'
                }
            }
        }

        function getCashApplyAmountList() {
            httpRequest.getReq(urlHelper.getUrl("getCashApplyAmountList"))
                .then(function (d) {
                    vm.blankNoteAmountList = d.blankNoteAmountList;

                    if (vm.blankNoteAmountList) {
                        vm.blankNote.loanAmount = vm.blankNoteAmountList[0];
                    }

                    vm.cashApplyPurposeVOList = d.cashApplyPurposeVOList;
                    if (vm.cashApplyPurposeVOList) {
                        vm.blankNote.purpose = vm.cashApplyPurposeVOList[0].purposeCode;
                    }


                    if (vm.blankBalanceCreditAmount < vm.blankNote.loanAmount) {
                        vm.canShow = false;
                    }

                    getPeriodList();

                });
        }

        vm.userType = 'normal';

        function checkUserType(status) {
            httpRequest.getReq(urlHelper.getUrl('getCashLoanType'))
                .then(function (d) {
                    if (d == 'product_cash') {
                        bannerSrc('007_phone_blanknote_grey');
                        vm.userType = 'grad';
                    } else if (d == 'normal_cash') {
                        vm.userType = 'normal';
                        if (_userSource == 'activity') {
                            utils.alert('您暂未获得“韩蜜天使贷”活动参与资格，您可正常申请借款，无需购买面膜商品');
                        }
                        if (status == 'completed') {
                            bannerSrc('007_phone_blanknote_grade');
                        } else {
                            bannerSrc('007_phone_blanknote');
                        }
                    }
                })
        }

        function getGradUserCreditStatus() {
            httpRequest.getReq(urlHelper.getUrl('getGradUserCreditStatus'))
                .then(function (d) {
                    if (d && d.status) {
                        checkUserType(d.status);
                    }

                }, function (err) {

                })
        }

        vm.gotoProduct = function () {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: 31579,
                promotionId: 273,
                promotionType: 'sale'
            });
            utils.gotoUrl(url);
        }

        function init() {
            getGradUserCreditStatus();
            checkCount();
            getUserContactsStatus();
            utils.checkAndUpdate();

            httpRequest.getReq(urlHelper.getUrl("getUserInfo"))
                .then(function (d) {
                    vm.blankBalanceCreditAmount = d.blankBalanceCreditAmount;
                    vm.blankTotalCreditAmount = d.blankTotalCreditAmount;

                    getCashApplyAmountList();

                });
            httpRequest.getReq(urlHelper.getUrl('checkFetchRequire')).then(function (d) {
                if (d.autoWithhold == false) {
                    vm.autoRepaySignObject.isInit = true;
                } else {
                    vm.autoRepaySignObject.isInit = false;
                }
            }, function () {

            });

            var params = {
                status: 'waiting_fetch'
            };
            httpRequest.getReq(urlHelper.getUrl('getFetchList'), params, {
                ignoreLogin: true
            }).then(function (d) {
                vm.ScouponList = d.items;
            }, function () {
            });


            reloadForService();

            httpRequest.getReq(urlHelper.getUrl('getAllServiceCoupons')).then(function (d) {
                vm.serviceCouponsItems = d.items;
                for (var i = 0; i < vm.serviceCouponsItems.length; i++) {
                    if (vm.serviceCouponsItems[i].couponType == 'service_fee_discount') {
                        vm.serviceCouponsItems[i].style = {
                            'background': '#ff9600'
                        };
                        if (vm.serviceCouponsItems[i].amount > 0) {
                            vm.serviceCouponsItems[i].showNumber = true;
                        } else {
                            vm.serviceCouponsItems[i].showNumber = false;
                            if (vm.serviceCouponsItems[i].discount == 0) {
                                vm.serviceCouponsItems[i].desc = "全免";
                            } else {
                                vm.serviceCouponsItems[i].desc = vm.serviceCouponsItems[i].discount + "折";
                            }
                        }
                        vm.serviceCouponsItems[i].typeText = "还款券";
                    }
                    if (vm.serviceCouponsItems[i].couponType == 'red_envelope') {
                        vm.serviceCouponsItems[i].style = {
                            'background': '#ff5f80'
                        };
                        vm.serviceCouponsItems[i].showNumber = true;
                        vm.serviceCouponsItems[i].typeText = "红包";
                    }
                }
            }, function (d) {

            })
        }

        vm.needUploadPhoneList = false;
        function getUserContactsStatus() {
            httpRequest.getReq(urlHelper.getUrl('getUserContactsStatus'))
                .then(function (d) {
                    if (d) {
                        vm.needUploadPhoneList = d;
                    }
                })
        }

        function doFeedback() {
            var feedback = $stateParams.feedback;
            if (feedback === "success") {
                applySuccess();
                init();
            } else if (feedback === "failure" || feedback === "back") {
                var orderId = settingCache.get("__blanknote_order_id");
                if (orderId) {
                    closeOrder(orderId, init);
                    settingCache.set("__blanknote_order_id", undefined);
                }
                utils.customDialog('借款合同取消', '亲，您未同意借款合同，该借款订单已经被取消，如需借款请重新进行借款流程！', '关闭', function (buttonIndex) {
                });
            } else {
                init();
            }

        }

        doFeedback();

    }

});
