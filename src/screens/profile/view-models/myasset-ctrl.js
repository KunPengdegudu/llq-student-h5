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

    module.controller('ProfileMyAssetCtrl', ProfileMyAsset);

    ////////
    ProfileMyAsset.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper'
    ];
    function ProfileMyAsset($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper) {
        var _this = this,
            vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "我的资产",
                isShow: true
            }, $location);
        }

        vm.requestParam = {};
        vm.isAbnormal = false;

        vm.reload = _this.reload;

        _this.reload = function () {
            var requestParam = vm.requestParam;
            httpRequest.getReq(urlHelper.getUrl('my'), requestParam)
                .then(function (d) {
                    vm.data = d;
                });

        };

        _this.init = function () {
            vm.requestParam = {};
            vm.$watch('requestParam', _this.reload, true);
        };

        _this.init();


    }

});