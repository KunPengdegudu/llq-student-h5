/**
 * Created by fionaqin on 2017/8/23.
 */
define([
    'screens/groupBuying/module',
    'jq',
    'screens/groupBuying/utils/url-helper'
], function (module,jq) {

    'use strict';

    module.controller('groupBuyingRuleCtrl', groupBuyingRule);

    ////////
    groupBuyingRule.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'groupBuyingUrlHelper'
    ];
    function groupBuyingRule($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "拼团玩法",
                isShow: true
            }, $location);
        }

    }

});