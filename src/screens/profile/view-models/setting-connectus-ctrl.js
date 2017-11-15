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

    module.controller('ProfileSettingConnectUsCtrl', ProfileSettingConnectUs);

    ////////
    ProfileSettingConnectUs.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper'
    ];
    function ProfileSettingConnectUs($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper) {
        var _this = this,
            vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "联系我们",
                isShow: true
            }, $location);
        }

    }

});