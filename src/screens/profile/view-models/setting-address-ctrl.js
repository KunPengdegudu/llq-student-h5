/**
 * profile my controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileSettingAddressCtrl', ProfileSettingAddress);

    ////////
    ProfileSettingAddress.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileSettingAddress($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        vm.addressListEmpty = true;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/setting"
                },
                title: "地址管理",
                isShow: true
            }, $location);
        }

        function setAddressListEmpty() {
            if(vm.addressDialog && vm.addressDialog.items && vm.addressDialog.items.length>0){
                vm.addressListEmpty = false;
            } else {
                vm.addressListEmpty = true;
            }
        };

        function reload() {
            vm.addressDialog.initAddress();
        }

        function init() {
            vm.requestParam = {};
            vm.$watch('requestParam', reload, true);
            vm.$watch('addressDialog', setAddressListEmpty, true);
        }

        init();

    }

});
