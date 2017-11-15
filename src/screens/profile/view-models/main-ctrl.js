/**
 * profile main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'jq',
    'screens/profile/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProfileMainCtrl', ProfileMain);

    ////////
    ProfileMain.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        'settingCache',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileMain($rootScope, $scope, $state, $timeout, $window, httpRequest, settingCache, $location, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "设置",
                isShow: true,
                headerType: "setting"
            }, $location);
        }

        vm.requestParam = {};
        vm.isAbnormal = false;

        vm.reload = reload;

        vm.msgSettings = {
            src: "/profile/msg",
            iconStyle: "icon-my-msg",
            label: "我的消息"
            //hasBadge: $rootScope.FLAGS_HAS_MSG,
            //count: $rootScope.FLAGS_COUNT_MSG
        };

        vm.quotaSettings = {
            src: "/profile/quota/waitingFetch",
            imgUrl: '/app/assets/imgs/profile/my-card.png',
            //iconStyle: "icon-quota",
            label: "额度提升"
            //hasBadge: $rootScope.FLAGS_HAS_QUOTA,
            //count: $rootScope.FLAGS_COUNT_QUOTA
        };

        vm.myorderSettings = {
            src: "/profile/myorder/orderall",
            imgUrl: '/app/assets/imgs/profile/my-order.png',
            //iconStyle: "icon-my-order",
            label: "我的订单"
            // hasBadge: $rootScope.FLAGS_HAS_ORDER,
            // count: $rootScope.FLAGS_COUNT_ORDER
        };

        vm.gotoCategory = gotoCategory;

        vm.settingOrderItem = [
            {name: '待付款', icon: 'icon-wait-pay', type: 'wait_pay', orderCount: 0},
            {name: '待发货', icon: 'icon-pay-success', type: 'waiting_deliver_goods', orderCount: 0},
            {name: '待收货', icon: 'icon-distribution-completed', type: 'wait_delivery', orderCount: 0},
            {name: '待评价', icon: 'icon-sign', type: 'waiting_evaluate', orderCount: 0}
        ];
        vm.settingBillItem = [
            {name: '本期剩余待还', value: 0, unit: ' 元', url: '/profile/mybill/billcurrent'},
            {name: '分期中账单', value: 0, unit: '笔', url: '/profile/mybill/billcurrent'},
            {name: '距最近还款', value: '暂无', unit: '', isOverDue: false, url: null}
        ];


        function gotoCategory(type) {
            utils.gotoUrl('/profile/myCategory?type=' + type);
        }

        vm.settings = [[
            vm.myorderSettings,
            {
                src: "/profile/mybill/billcurrent",
                imgUrl: '/app/assets/imgs/profile/my-bill.png',
                //iconStyle: "icon-my-bill",
                label: "我的账单"
            },
            vm.quotaSettings,
            {
                src: "/auth/main?to=%2Fprofile%2Fmain",
                imgUrl: '/app/assets/imgs/profile/my-identification.png',
                //iconStyle: "icon-auth",
                label: "我的认证"
            }
        ], [
            {
                src: "/profile/wallet",
                // iconStyle: "icon-my-wallet",
                imgUrl: '/app/assets/imgs/profile/my-wallet.png',
                label: "我的钱包"
            }, {
                src: "/profile/red/notUsed",
                // iconStyle: "icon-feedback",
                imgUrl: '/app/assets/imgs/profile/myRed.png',
                label: "我的红包"
            }, {
                src: "/profile/coupon/notUsed",
                // iconStyle: "icon-feedback",
                imgUrl: '/app/assets/imgs/profile/myCoupon.png',
                label: "我的优惠券"
            }, {
                src: "/works/task/share",
                // iconStyle: "icon-my-wallet",
                imgUrl: '/app/assets/imgs/profile/my-student.png',
                label: "邀请有礼"
            }
        ], [
            {
                src: "/security/main",
                // iconStyle: "icon-my-wallet",
                imgUrl: '/app/assets/imgs/profile/safety.png',
                label: "安全中心"
            }, {
                src: "/profile/help",
                imgUrl: '/app/assets/imgs/profile/help.png',
                // iconStyle: "icon-help2",
                label: "客服中心"
            }, {
                src: "/profile/feedback",
                // iconStyle: "icon-feedback",
                imgUrl: '/app/assets/imgs/profile/my-advice.png',
                label: "我要反馈"
            }, {
                src: "/auth/credit",
                // iconStyle: "icon-feedback",
                imgUrl: '/app/assets/imgs/profile/credit-rating.png',
                label: "信用评级"
            }
        ], [
            {
                src: "/profile/allAssess",
                // iconStyle: "icon-feedback",
                imgUrl: '/app/assets/imgs/profile/evaluate.png',
                label: "我的评价"
            //}, {
            //    src: "__inner://http://m.007fenqi.com/app/family/wxm/index.html#/active/main",
            //    // iconStyle: "icon-feedback",
            //    imgUrl: '/app/assets/imgs/profile/creditCard.png',
            //    label: "双十一"
            //}, {
                //    src: "/works/task/share/newuser",
                //    // iconStyle: "icon-feedback",
                //    imgUrl: '/app/assets/imgs/profile/my-student.png',
                //    label: "新人专享"
            }
        ]];

        vm.gotoAuth = gotoAuth;
        vm.gotoUrl = gotoUrl;
        //vm.gotoLifting = gotoLifting;


        vm.resData = [0, 1];

        vm.resOptions = {
            percentageInnerCutout: 90
        };

        vm.data = {};

        vm.settingItemStyle = {};

        function gotoUrl(redirect) {
            if (!utils.isEmpty(redirect)) {
                utils.gotoUrl(redirect);
            }
        }

        function gotoAuth() {
            utils.gotoUrl("/auth/main?to=" + utils.createRedirect($location));
        }

        function reload() {
            var requestParam = $scope.requestParam;
            httpRequest.getReq(urlHelper.getUrl('main'), requestParam)
                .then(function (d) {
                    if (d.name) {
                        settingCache.set('__req_info_user_have_name', true);
                    } else {
                        settingCache.set('__req_info_user_have_name', false);
                    }
                    vm.data = d;
                    vm.data.name = utils.htmlDecode(vm.data.name);
                    vm.sex = d.sex;
                    if (d.totalCreditAmount == 0) {
                        vm.resData[0] = 0;
                        vm.resData[1] = 1;
                    } else {
                        vm.resData[0] = d.totalCreditAmount - d.balanceCreditAmount;
                        vm.resData[1] = d.balanceCreditAmount;
                    }
                });

        }

        function initFlags() {
            // 获得消息数量
            utils.flushFlags(function (hasMsg, count) {
                vm.msgSettings.hasBadge = hasMsg;
                vm.msgSettings.count = count;
            }, function (hasMsg, count) {
                vm.quotaSettings.hasBadge = hasMsg;
                vm.quotaSettings.count = count;
            });

        }

        function initSettingStyle() {
            var winWidth = jq($window).width();
            var padding = (winWidth / 4 - 60) / 2;
            vm.settingItemStyle = {
                width: '25%',
                padding: (padding + 2) + "px 0 " + (padding - 2) + "px"
            };
        }

        //
        //function gotoLifting() {
        //    utils.gotoUrl("/profile/lifting?code=icab");
        //}

        //帮助
        vm.questionDialog = {
            isVisible: false,
            content: '消费额度:消费额度可用于零零期商城购物消费',
            url: '/stage/category',
            openDialog: function (type) {
                if (type) {
                    vm.questionDialog.content = '消费额度:消费额度可用于零零期商城购物消费';
                    vm.questionDialog.btn = '去购物';
                    vm.questionDialog.url = '/stage/category';
                } else {
                    vm.questionDialog.content = '借款额度:借款额度可用于零零期白条取现';
                    vm.questionDialog.btn = '去取现';
                    vm.questionDialog.url = '/blanknote/main';
                }
                vm.questionDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.questionDialog.isVisible = false;
            },
            gotosm: function () {
                utils.gotoUrl(vm.questionDialog.url);
            }
        }

        vm.gotoProduct = function (productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            if (productId) {
                utils.gotoUrl(url);
            }
        }


        vm.showUserName = false;
        function getCertProductList() {
            httpRequest.getReq(urlHelper.getUrl('getCertProductList'), {}, {
                ignoreLogin: true
            }).then(function (d) {
                if (d) {
                    d.items.forEach(function (item, index) {
                        if (item.censorResult.censorStatus == 'passed') {
                            vm.showUserName = true;
                        }

                    });
                }
            }, function (err) {
                utils.error(err.msg || '服务器忙，请稍后再试');
            })
        }


        function init() {

            initFlags();

            initSettingStyle();

            getCertProductList();

            var unWatch = vm.$watch('requestParam', reload, true);
            vm.$on('$destroy', function () {
                unWatch();
            });
            httpRequest.getReq(urlHelper.getUrl('getRepaymentInfo'))
                .then(function (d) {
                    if (d) {
                        vm.settingBillItem[1].value = d.totalCount;
                        vm.settingBillItem[2].url = '/profile/billdetail?billNo=' + d.applyNo;
                        if (d) {
                            vm.settingBillItem[0].value = d.currentTotalRepayAmount;
                        } else {
                            vm.settingBillItem[0].value = 0
                        }
                        if (d.totalCount) {
                            vm.settingBillItem[2].value = Math.abs(d.minDays);
                            vm.settingBillItem[2].unit = ' 天';
                        }
                        if (d.overdue) {
                            vm.settingBillItem[2].name = '逾期天数';
                            vm.settingBillItem[2].isOverDue = true;

                        }

                    }
                }, function (d) {

                });

            //订单统计
            httpRequest.getReq(urlHelper.getUrl('orderCalculate'))
                .then(function (d) {
                    //console.log('订单统计接口数据:'+d);
                    vm.settingOrderItem[0].orderCount = d.waitingPayCount;
                    vm.settingOrderItem[1].orderCount = d.waitingSendGoodsCount;
                    vm.settingOrderItem[2].orderCount = d.waitingReceiveGoodsCount;
                    vm.settingOrderItem[3].orderCount = d.waitingEvaluateCount;
                }, function () {
                    console.log("订单统计失败");
                });
        }

        init();

    }

});