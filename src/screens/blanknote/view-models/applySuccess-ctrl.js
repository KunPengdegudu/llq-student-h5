define([
    'screens/blanknote/module',
    'jq',
    'screens/blanknote/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('BlankNoteApplySuccess', BlankNoteApplySuccess);

    ////////
    BlankNoteApplySuccess.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        'httpRequest',
        'settingCache',
        '$loadingOverlay',
        '$timeout',
        'blankNoteUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function BlankNoteApplySuccess($rootScope, $scope, $location, $stateParams, $q, httpRequest, settingCache, $loadingOverlay, $timeout, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;
        vm.money = $stateParams.money;
        vm.time = $stateParams.time;
        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: false,
                leftBtnType: "back",
                title: "申请借款成功",
                isShow: true
            }, $location);
        }
        vm.doApply = doApply
        function doApply(url) {
            utils.gotoUrl(url);
        }
        vm.applyBot = function () {
            httpRequest.getReq(urlHelper.getUrl('isAutoRepay'))
                .then(function (d) {
                    vm.applyBotInfo = d;
                })
        }



        function init() {
            vm.applyBot();
        }

        init();

    }

});