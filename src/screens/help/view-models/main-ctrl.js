/**
 * help controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/help/module'
], function (module) {

    'use strict';

    module.controller('HelpMainCtrl', HelpMain);

    ////////
    HelpMain.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'CONSTANT_UTILS'
    ];
    function HelpMain($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "帮助中心",
                isShow: true
            }, $location);
        }

        vm.gotoUrl = gotoUrl;

        function gotoUrl(redirect) {
            utils.gotoUrl(redirect);
        }

    }

});