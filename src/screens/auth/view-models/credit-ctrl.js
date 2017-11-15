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

    module.controller('AuthCreditCtrl', AuthCredit);

    ////////
    AuthCredit.$inject = [
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
    function AuthCredit($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, constant, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "信用证书",
                rightBtnType: 'text',
                isShowRightBtn: false,
                rightBtnAttrs: {
                    text: "评级说明",
                    fn: function () {
                        vm.creditInfo.openDialog();
                    }
                },
                isShow: true
            }, $location);
        }

        vm.hasLevel = false;
        vm.isUserVip = false;


        vm.creditInfo = {
            isVisible: false,
            openDialog: function () {
                vm.creditInfo.isVisible = true;
            },
            closeDialog: function () {
                vm.creditInfo.isVisible = false;
            }
        };


        function init() {
            httpRequest.getReq(urlHelper.getUrl('getUserLevel'))
                .then(function (d) {
                    if (d && d.level) {
                        vm.userLevel = d;
                        if (vm.userLevel.level == 'AA' || vm.userLevel.level == 'A' || vm.userLevel.level == 'B' || vm.userLevel.level == 'C') {
                            vm.hasLevel = true;
                        } else {
                            vm.isUserVip = true;
                            vm.hasLevel = false;
                        }
                    } else {
                        vm.hasLevel = false;
                        vm.isUserVip = false;
                    }
                }, function (d) {
                    utils.error(d.msg || "服务器忙，请稍后再试！");
                })
        }

        init();

    }

});