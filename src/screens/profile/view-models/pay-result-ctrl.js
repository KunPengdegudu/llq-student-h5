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

    module.controller('ProfilePayResultCtrl', ProfilePayResultCtrl);

    ////////
    ProfilePayResultCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfilePayResultCtrl($rootScope, $scope, $state, $stateParams, $timeout, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        var feedback = $stateParams.feedback;
        var payType = $stateParams.payType;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "支付结果",
                isShow: true
            }, $location);
        }

        vm.resultText = (feedback==='success')?'支付成功':'支付失败';

        vm.gotoSuccess = function () {
            if (payType === 'repay') {
                utils.gotoUrl('/profile/mybill/billcurrent');
            } else {
                utils.gotoUrl('/profile/myorder/orderall');
            }
        };

        vm.gotoEnter = function () {
            utils.gotoUrl('/enter/main');
        };


    }

});
