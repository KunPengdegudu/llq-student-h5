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

    module.controller('ProfileHelpCtrl', ProfileHelp);

    ////////
    ProfileHelp.$inject = [
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
    function ProfileHelp($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "帮助中心",
                isShow: true
            }, $location);
        }

        vm.gotoUrl = gotoUrl;

        vm.contactUs = function () {
            utils.contactUs();
        };

        function gotoUrl(redirect) {
            utils.gotoUrl(redirect);
        }

        vm.helpGuide = {
            isVisible: false,
            openDialog: function () {
                vm.helpGuide.isVisible = true;
            },
            closeDialog: function () {
                vm.helpGuide.isVisible = false;
            }
        };


    }

});
