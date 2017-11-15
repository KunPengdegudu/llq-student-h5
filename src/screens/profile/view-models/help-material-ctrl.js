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

    module.controller('ProfileHelpMaterialCtrl', ProfileHelpMaterial);

    ////////
    ProfileHelpMaterial.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper'
    ];
    function ProfileHelpMaterial($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "帮助",
                isShow: true
            }, $location);
        }

    }

});