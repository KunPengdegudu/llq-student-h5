/**
 * rechargeGame main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/rechargeMobile/module',
    'jq',
    'qrcode',
    'screens/rechargeMobile/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('rechargeMobileCtrl', rechargeMobile);

    ////////
    rechargeMobile.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        '$window',
        '$loadingOverlay',
        '$timeout',
        '$interval',
        'httpRequest',
        'settingCache',
        'mobileUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function rechargeMobile($rootScope, $scope, $location, $q, $window, $loadingOverlay, $timeout, $interval, httpRequest, settingCache, urlHelper, constant, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "手机充值",
                isShow: true
            }, $location);
        }

        vm.userPhone = '';
        vm.checkOrder = {
            phone: vm.userPhone,
            parValue: null
        };

        vm.order = {
            "chargeAccount": null,
            "productId": null,
            "productSkuId": null,
            "productCount": 1,
            "virtualType": "",
            "shopId": null
        }
        vm.chooseItem = {};
        vm.phoneHint = '暂无归属地';

        vm.bill = {
            title: '充话费',
            type: 'phone',
            subtitle: '',
            content: [],
            selected: true,
            submit: function () {
                if (check()) {
                    /**
                     httpRequest.getReq(urlHelper.getUrl('phoneChargeCheck'), {
                        'parValue': vm.checkOrder.parValue,
                        'phone': vm.userPhone
                    }).then(function (d) {
                        createOrder();
                    }, function (err) {
                        utils.error(err.msg || '服务器繁忙，请稍后再试');
                    })
                     **/
                    utils.customDialog("温馨提示", "下载零零期APP，付款体验更流畅哦", "关闭,立即下载", function (idx) {
                        if (idx == 2) {
                            utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                        }
                    });
                }
            }
        };
        vm.flow = {
            title: '充流量',
            type: 'traffic',
            subtitle: '(全国)',
            content: [],
            selected: false,
            submit: function () {
                if (check()) {
                    /**
                     httpRequest.getReq(urlHelper.getUrl('trafficChargeCheck'), {
                        'parValue': vm.checkOrder.parValue,
                        'phone': vm.userPhone
                    }).then(function (d) {
                        createOrder();
                    }, function (err) {
                        utils.error(err.msg || '服务器繁忙，请稍后再试');
                    })
                     **/
                    utils.customDialog("温馨提示", "下载零零期APP，付款体验更流畅哦", "关闭,立即下载", function (idx) {
                        if (idx == 2) {
                            utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                        }
                    });
                }
            }
        };

        vm.tebList = [vm.bill, vm.flow];

        function check() {
            if (utils.isEmpty(vm.userPhone)) {
                utils.error('手机号码不能为空');
                return false;
            }
            if (!utils.checkMobile(vm.userPhone)) {
                utils.error('手机号码格式不变');
                return false;
            }
            if (utils.isEmpty(vm.checkOrder.parValue)) {
                utils.error('未选择充值金额');
                return false;
            }
            return true;
        }

        vm.selectTeb = function (item) {
            for (var i = 0; i < vm.tebList.length; i++) {
                vm.tebList[i].selected = false;
            }
            item.selected = true;
            chooseItem(item)
        };

        vm.selectContent = function (item) {
            for (var i = 0; i < vm.chooseItem.content.length; i++) {
                vm.chooseItem.content[i].default = false;
            }
            item.default = true;
            vm.checkOrder.parValue = item.parValue;
            vm.order.productId = item.productId;
            vm.order.productSkuId = item.skuId;
        };

        function chooseItem(item) {
            vm.chooseItem = item;
            vm.order.virtualType = item.type;
            for (var i = 0; i < vm.chooseItem.content.length; i++) {
                if (vm.chooseItem.content[i].default) {
                    vm.checkOrder.parValue = vm.chooseItem.content[i].parValue;

                    vm.order.productId = vm.chooseItem.content[i].productId;
                    vm.order.productSkuId = vm.chooseItem.content[i].skuId;
                    vm.order.shopId = vm.chooseItem.content[i].shopId;
                }
            }
        }


        function queryUserInfo() {
            httpRequest.getReq(urlHelper.getUrl('getUserInfo'))
                .then(function (d) {
                    if (d) {
                        vm.userPhone = d.phone;
                        queryPhoneSkuInfo();
                    }
                })
        }

        function queryPhoneSkuInfo() {
            httpRequest.getReq(urlHelper.getUrl('queryPhoneSkuInfo'), {
                phone: vm.userPhone
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items && d.items.length > 0) {
                    vm.bill.content = d.items;
                    if (vm.tebList[0].selected) {
                        chooseItem(vm.bill);
                    }

                }
            });
            httpRequest.getReq(urlHelper.getUrl('queryTrafficSkuInfo'), {
                phone: vm.userPhone
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items && d.items.length > 0) {
                    vm.flow.content = d.items;
                    if (vm.tebList[1].selected) {
                        chooseItem(vm.flow);
                    }
                }
            })
        }

        function queryPhoneAttr() {
            httpRequest.getReq(urlHelper.getUrl('queryPhoneAttr'), {
                phone: vm.userPhone
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d) {
                    vm.phoneHint = d.area;
                }
            })
        }

        function checkMobile() {
            if (vm.userPhone.length == 11) {
                queryPhoneAttr();
                queryPhoneSkuInfo();
            } else if (vm.userPhone.length > 11) {
                utils.error('手机号码格式有误');
                vm.userPhone = vm.userPhone.substr(0, 11);
            }
        }

        //购买的部分
        vm.payDialog = {
            isVisible: false,

            name: null,
            amount: null,
            params: {
                orderNos: null,
                agingTotalAmount: null,
                deliveryFee: null
            },
            openDialog: function () {
                vm.payDialog.isVisible = true;
                vm.payDialog.params.orderNos = vm.submitCb.orderNo;
                vm.payDialog.params.agingTotalAmount = vm.submitCb.payAmount;
                vm.payDialog.params.deliveryFee = vm.submitCb.deliveryFee;
                vm.payInfo.open();
            },
            goBack: function () {
                vm.payDialog.isVisible = true;
            }
        };


        function createOrder() {
            var params = {
                shopId: 1,
                productBuyDetail: {
                    "chargeAccount": vm.userPhone,
                    "productId": vm.order.productId,
                    "productSkuId": vm.order.productSkuId,
                    "productCount": 1,
                    "virtualType": vm.order.virtualType
                }

            }
            httpRequest.getReq(urlHelper.getUrl('createOrder'), null, {
                type: 'POST',
                data: params
            }).then(function (d) {
                vm.submitCb = d;
                vm.payDialog.name = d.title;
                vm.payDialog.amount = d.payAmount;
                vm.payDialog.openDialog();
            })
        }


        function init() {
            if ($rootScope.loginStatus) {
                queryUserInfo();
            }

            queryPhoneSkuInfo();
            var unWatch = vm.$watch('userPhone', checkMobile, true);

            vm.$on('$destroy', function () {
                unWatch();

            });
        }

        init();

    }

})
;
