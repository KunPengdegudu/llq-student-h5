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

    module.controller('ProfileSettingAboutCtrl', ProfileSettingAbout);

    ////////
    ProfileSettingAbout.$inject = [
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
    function ProfileSettingAbout($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper, utils) {
        var _this = this,
            vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/setting"
                },
                title: "关于零零期",
                isShow: true
            }, $location);
        }

        vm.gotoUrl = gotoUrl;

        function gotoUrl(redirect) {
            utils.gotoUrl(redirect);
        }

    }

});