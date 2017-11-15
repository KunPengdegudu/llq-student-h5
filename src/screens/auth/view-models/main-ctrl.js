/**
 * auth controller
 * @create 2017/03/06
 * @author dxw
 */
define([
    'screens/auth/module',
    'jq',
    'qrcode',
    'screens/auth/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('AuthMainCtrl', AuthMain);

    ////////
    AuthMain.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'CONSTANT',
        'authUrlHelper',
        'CONSTANT_UTILS'
    ];
    function AuthMain($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, constant, urlHelper, utils) {
        var vm = $scope;


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "icon",
                leftBtnAttrs: {
                    icon: 'icon-back',
                    fn: function () {
                        utils.gotoUrl('/profile/main')
                    }
                },
                title: "我的认证",
                isShow: true
            }, $location);
        }


        vm.showResult = function (item) {
            utils.alert(item.censorResult.censorRejectReason);
        };

        vm.showSupplement = function (item) {
            utils.customDialog("未提交材料", item.censorResult.censorRejectReason + '，请下载零零期app，重新认证', "取消,下载App", function (idx) {
                if (idx == 2) {
                    utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                }
            });
        };

        vm.showReason = {
            isVisible: false,
            authReason: null,
            openDialog: function (item) {
                vm.showReason.authReason = item.censorResult.censorRejectReason
                vm.showReason.isVisible = true;
            },
            closeDialog: function () {
                vm.showReason.isVisible = false;
            }
        };
        vm.download = function (d) {
            utils.customDialog("温馨提示", "请下载零零期app，在零零期app内进行认证", "取消,去下载", function (idx) {
                if (idx == 2) {
                    utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                }
            });
        };

        vm.byjIsPassed = false;
        function getCertProductList() {
            httpRequest.getReq(urlHelper.getUrl('getCertProductList'))
                .then(function (d) {
                    if (d) {
                        vm.items = d.items;
                        vm.items.forEach(function (item, idx) {
                            if (item.certProCode == 'BYJ' && item.censorResult.censorStatus == 'passed') {
                                vm.byjIsPassed = true;
                            }
                        })
                    }
                }, function (err) {
                    utils.error(err.msg || '服务器忙，请稍后再试');
                })
        }

        vm.gotoEnter = function () {
            utils.gotoUrl("/enter/main");
        };
        vm.gotoBlanknote = function () {
            utils.gotoUrl("/blanknote/main");
        };

        vm.recommendDialog = {
            isVisible: false,
            openDialog: function () {
                getRecommendLoan();
                vm.recommendDialog.isVisible = true;
                vm.showReason.closeDialog();
            },
            closeDialog: function () {
                vm.recommendDialog.isVisible = false;
            }
        }


        function getUserInfo() {
            httpRequest.getReq(urlHelper.getUrl('getUserInfo'), null, {
                ignoreLogin: false
            }).then(function (d) {
                vm.userPhone = d.phone;
            });
        }

        vm.goodsList = [];

        function getRecommendLoan() {
            var goodsList = [];
            httpRequest.getReq(urlHelper.getUrl('getRecommendLoan'), null, {
                ignoreLogin: true
            }).then(function (d) {
                console.log(1);
                console.log(d);
                console.log(1);
                if (d && d.length > 0) {
                    goodsList = d;
                }
                var rows = [];
                goodsList.forEach(function (item, index) {
                    var itemRow = [];
                    if (index % 2 == 0 && index < 4) {
                        if (index + 1 < goodsList.length) {
                            itemRow.push(goodsList[index + 1]);
                        }
                        itemRow.push(item);
                        rows.push(itemRow);
                    }
                });
                vm.goodsList = rows;
                vm.showReason.closeDialog();

            })
        }

        vm.gotoLoanProductDetail = gotoLoanProductDetail;
        function gotoLoanProductDetail(item) {
            var url = '__inner://http://show.007fenqi.com/app/loan/index.html?phone=' + vm.userPhone + '&platformId=' + item.id;
            utils.gotoUrl(url);
        }

        vm.gotoLoan = function () {
            var url = '__inner://http://show.007fenqi.com/app/loan/index.html?phone=' + vm.userPhone;
            utils.gotoUrl(url);
        };

        function init() {
            getUserInfo();
            getCertProductList();
        }

        init();


    }

});