/**
 * rechargeGame main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/rechargeGame/module',
    'jq',
    'qrcode',
    'screens/rechargeGame/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('gameDetailCtrl', gameDetail);

    ////////
    gameDetail.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$location',
        '$q',
        '$window',
        '$loadingOverlay',
        '$timeout',
        '$interval',
        'httpRequest',
        'settingCache',
        'rechargeGameUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function gameDetail($rootScope, $scope, $stateParams, $location, $q, $window, $loadingOverlay, $timeout, $interval, httpRequest, settingCache, urlHelper, constant, utils) {
        var vm = $scope;

        var _prodId = $stateParams.prodId;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "网游充值",
                isShow: true
            }, $location);
        }

        vm.product = {};

        vm.accountInfo = [];
        vm.selectedInfo = null;
        vm.gameList = [];

        vm.isTwoLevel = false;
        vm.isThreeLevel = false;

        vm.selected = selected;
        function selected(item) {
            for (var i = 0; i < vm.product.productSkuList.length; i++) {
                vm.product.productSkuList[i].select = false;
            }
            item.select = true;
            vm.selectedInfo = item;
        }

        function queryProdSku() {
            httpRequest.getReq(urlHelper.getUrl('queryProdSku'), {
                prodId: _prodId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d) {
                    vm.product = d;
                }
            })
        }

        function check() {
            var amount = null,
                amountAgain = null;
            if (!vm.selectedInfo) {
                utils.error('未选择充值面额');
                return false;
            } else {
                var items = vm.accountInfo;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].module == 'ChargeAccount') {
                        amount = items[i];
                    }
                    if (items[i].module == 'ChargeAccountAgain') {
                        amountAgain = items[i];
                    }
                    if (items[i].module == 'ChargeAccount' || items[i].module == 'ChargePWD' || items[i].module == 'ChargeAccountAgain') {
                        if (utils.isEmpty(items[i].content)) {
                            utils.error(items[i].name + '不能为空');
                            return false;
                        }
                    }
                }
                for (var i = 0; i < items.length; i++) {
                    if (amount.content != amountAgain.content) {
                        utils.error(amountAgain.name + '与' + amount.name + '输入不一致');
                        return false;
                    }
                    if (items[i].module == 'ChargeType' || items[i].module == 'ChargeGame' || items[i].module == 'ChargeRegion' || items[i].module == 'ChargeServer') {
                        if (utils.isEmpty(vm.showFirstName)) {
                            utils.error(items[i].name + '不能为空');
                            return false;
                        }
                    }
                    if (items[i].module == 'ChargeGameRegion' || items[i].module == 'ChargeRegionServer') {
                        if (utils.isEmpty(vm.showFirstName)) {
                            utils.error(vm.firstObject.name + '不能为空');
                            return false;
                        }
                        if (utils.isEmpty(vm.showSecondName)) {
                            utils.error(vm.secondObject.name + '不能为空');
                            return false;
                        }
                    }
                    if (items[i].module == 'ChargeGameRegionServer') {
                        if (utils.isEmpty(vm.showFirstName)) {
                            utils.error(vm.firstObject.name + '不能为空');
                            return false;
                        }
                        if (utils.isEmpty(vm.showSecondName)) {
                            utils.error(vm.secondObject.name + '不能为空');
                            return false;
                        }
                        if (utils.isEmpty(vm.showThirdName)) {
                            utils.error(vm.thirdObject.name + '不能为空');
                            return false;
                        }
                    }
                    getParams(items[i]);
                }
            }

            return true;
        }

        function getParams(item) {
            switch (item.module) {
                case 'ChargeAccount':
                    vm.chargeAccount = item.content;
                    break;
                case 'ChargePWD':
                    vm.chargePassword = item.content;
                    break;
                case 'ChargeType':
                    vm.chargePassword = vm.showFirstName;
                    break;
                case 'ChargeRegion':
                    vm.chargeRegion = vm.showFirstName;
                    break;
                case 'ChargeServer':
                    vm.chargeServer = vm.showFirstName;
                    break;
                case 'ChargeGameRegion':
                    vm.chargeRegion = vm.showSecondName;
                    break;
                case 'ChargeRegionServer':
                    vm.chargeRegion = vm.showFirstName;
                    vm.chargeServer = vm.showSecondName;
                    break;
                case 'ChargeGameRegionServer':
                    vm.chargeRegion = vm.showSecondName;
                    vm.chargeServer = vm.showThirdName;
                    break;
            }
        }

        vm.submit = function () {

            if (check()) {
                /**
                 var params = {
                    shopId: vm.product.shopId,
                    productBuyDetail: {
                        productId: vm.product.productId,
                        productSkuId: vm.selectedInfo.skuId,
                        productCount: 1,
                        chargeAccount: vm.chargeAccount,
                        chargePassword: vm.chargePassword,
                        chargeType: vm.chargeType,
                        chargeGame: vm.chargeGame,
                        chargeRegion: vm.chargeRegion,
                        chargeServer: vm.chargeServer,
                        virtualType: 'game'

                    }
                };
                 httpRequest.getReq(urlHelper.getUrl('createOrder'), null, {
                    type: 'POST',
                    data: params
                }).then(function (d) {
                    if (d) {
                        vm.submitCb = d;
                        vm.payDialog.openDialog();
                    }
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
        };

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
                vm.payDialog.name = vm.product.productName;
                vm.payDialog.amount = vm.selectedInfo.sellPrice;
                vm.payDialog.params.orderNos = vm.submitCb.orderNo;
                vm.payDialog.params.agingTotalAmount = vm.submitCb.payAmount;
                vm.payDialog.params.deliveryFee = vm.submitCb.deliveryFee;
                vm.payInfo.open();
            },
            goBack: function () {
                vm.payDialog.isVisible = true;
            }
        };


        function queryProdTemp() {
            httpRequest.getReq(urlHelper.getUrl('queryProdTemp'), {
                prodId: _prodId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items && d.items.length > 0) {
                    var items = d.items,
                        accountHead = [],
                        accountFoot = [],
                        againInput = {};
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].module == 'ChargeAccount' || items[i].module == 'ChargePWD') {
                            items[i].content = null;
                        }
                        if (items[i].module == 'ChargeAccount') {
                            accountHead.push(items[i]);
                            againInput = {
                                gameRegionOrRegionServer: null,
                                gameRegionServer: null,
                                module: "ChargeAccountAgain",
                                name: "确认账号",
                                selectLevel: null,
                                type: "input",
                                content: null,
                                values: null
                            };
                            accountHead.push(againInput);
                        } else {
                            accountFoot.push(items[i]);
                        }

                    }
                    vm.accountInfo = vm.accountInfo.concat(accountHead, accountFoot);
                    for (var i = 0; i < vm.accountInfo.length; i++) {
                        switch (vm.accountInfo[i].module) {
                            case 'ChargeType':
                                vm.firstObject = {
                                    name: '充值类型',
                                    values: vm.accountInfo[i].values,
                                    level: 'first'
                                };
                                break;
                            case 'ChargeGame':
                                vm.firstObject = {
                                    name: '充值游戏',
                                    values: vm.accountInfo[i].values
                                };
                                break;
                            case 'ChargeRegion':
                                vm.firstObject = {
                                    name: '充值服',
                                    values: vm.accountInfo[i].values
                                };
                                break;
                            case 'ChargeServer':
                                vm.firstObject = {
                                    name: '充值区',
                                    values: vm.accountInfo[i].values
                                };
                                break;
                            case 'ChargeGameRegion':
                                vm.firstObject = {
                                    name: '充值游戏',
                                    values: vm.accountInfo[i].gameRegionOrRegionServer
                                };
                                vm.secondObject.name = '充值区';
                                vm.isTwoLevel = true;
                                break;
                            case 'ChargeRegionServer':
                                vm.firstObject = {
                                    name: '充值区',
                                    values: vm.accountInfo[i].gameRegionOrRegionServer
                                };
                                vm.secondObject.name = '充值服';
                                vm.isTwoLevel = true;
                                break;
                            case 'ChargeGameRegionServer':
                                vm.firstObject = {
                                    name: '充值游戏',
                                    values: vm.accountInfo[i].gameRegionServer
                                };
                                vm.secondObject.name = '充值区';
                                vm.thirdObject.name = '充值服';
                                vm.isThreeLevel = true;
                                break;
                        }

                    }

                }
            })
        }

        vm.firstObject = {
            name: '',
            values: []
        };

        vm.secondObject = {
            name: '',
            values: []
        };

        vm.thirdObject = {
            name: '',
            values: []
        };


        vm.showSeversList = null;

        vm.gameDialog = {
            isVisible: false,
            dialogTitle: null,
            dialogList: [],
            openDialog: function (obj, level) {
                vm.gameDialog.isVisible = true;
                vm.level = level;
                vm.gameDialog.dialogTitle = obj.title ? obj.title : obj.name;
                vm.gameDialog.dialogList = obj.values;
            },
            goBack: function () {
                vm.gameDialog.isVisible = false;
            },
            getItemName: function (item) {
                return item.name ? item.name : item;
            },
            select: function (item) {
                if (vm.level == 'first') {
                    vm.showFirstName = item.name ? item.name : item;

                    if (item.values && item.values.length > 0) {
                        vm.secondObject.values = item.values;
                    }
                }
                if (vm.level == 'second') {
                    vm.showSecondName = item.name ? item.name : item;

                    if (item.values && item.values.length > 0) {
                        vm.thirdObject.values = item.values;
                    }
                }
                if (vm.level == 'third') {
                    vm.showThirdName = item.name ? item.name : item;
                }


                vm.gameDialog.goBack();
            }
        };

        function init() {
            queryProdSku();
            queryProdTemp()
        }

        init();

    }

})
;
