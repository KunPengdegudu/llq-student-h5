/**
 * security main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/security/module',
    'screens/security/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('SecurityAddBankCardCtrl', SecurityAddBankCard);

    ////////
    SecurityAddBankCard.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        '$interval',
        'httpRequest',
        'securityUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function SecurityAddBankCard($rootScope, $scope, $location, $q, $interval, httpRequest, urlHelper, constant , utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "新增银行卡",
                isShow: true
            }, $location);
        }
        vm.addBankCard = {
            userInfo: null,
            isVisible: false,
            openDialog: function () {
                vm.addBankCard.isVisible = true;
            },
            closeDialog: function () {
                vm.addBankCard.isVisible = false;
            }
        }
        vm.changeDia = {
            isVisible: false,
            openDialog: function () {
                vm.changeDia.isVisible = true;
            },
            closeDialog: function () {
                vm.changeDia.isVisible = false;
            }
        }
        vm.authCode = {
            isVisible: false,
            openDialog: function () {
                vm.authCode.isVisible = true;
            },
            closeDialog: function () {
                vm.authCode.isVisible = false;
            }
        }
        httpRequest.getReq(constant.GET_USER_INFO).then(function (d) {
                vm.addBankCard.userInfo = d;
                console.log(d)
            });
        function init() {

        }

        init();

    }
});