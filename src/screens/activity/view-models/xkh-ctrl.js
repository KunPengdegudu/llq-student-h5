/**
 * activity cash controller
 * @create 2015/07/18
 * @author dxw
 */
define([
    'screens/activity/module',
    'jq',
    'qrcode',
    'screens/activity/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ActivityXkhCtrl', ActivityXkh);

    ////////
    ActivityXkh.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'activityUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ActivityXkh($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "校开花",
                isShow: false,
                isShowLeftBtn: false,
                leftBtnType: "back"
            }, $location);
        }


        function init() {
            httpRequest.getReq(urlHelper.getUrl("listSysNotices"), {
                'positionType': 'xkh_activities'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items) {
                    var item = d.items[0];
                    if (item.content) {
                        vm.xkhContent = utils.htmlDecode(item.content);
                    }
                    if (item.memo) {
                        $rootScope.navConfig.title = item.memo;
                    }
                }
            });
        }


        init();


    }

});