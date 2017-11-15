/**
 * profile setting controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'jq',
    'screens/profile/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProfileSettingCtrl', ProfileSetting);

    ////////
    ProfileSetting.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS',
        'CONSTANT'
    ];
    function ProfileSetting($scope, $rootScope, $state, $timeout, $window, httpRequest, $location, urlHelper, utils, constant) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "设置",
                isShow: true
            }, $location);
        }

        vm.doLogout = doLogout;

        vm.version = {
            isAppleStore: utils.isAppleStore(),
            info: {
                hasNew: false,
                localVer: '',
                serverVer: ''
            },
            dialogOpen: function () {
                if (vm.version.info.hasNew) {
                    // 检查新版本
                    if (navigator.appupdate) {
                        var updateType = utils.isAppleStore() ? 'applestore' : 'other';
                        navigator.appupdate.checkAndUpdate('llq-student-release', constant.CurrentVersion, updateType, function (type) {
                            if (type == "updateContent") {
                                location.reload();
                            }
                        });
                    }
                }
            }
        };

        vm.gotoUrl = gotoUrl;

        vm.canRateApp = function () {
            return utils.canRateApp();
        };

        vm.doRateApp = function () {
            utils.doRateApp();
        };

        function gotoUrl(redirect) {
            utils.gotoUrl(redirect);
        }

        function gotoLogin() {
            $location.url('/login');
        }

        function doLogout() {
            httpRequest.getReq(urlHelper.getUrl('logout'), null, {ignoreLogin: true})
                .then(function (d) {
                    gotoLogin();
                }, function (d) {
                    gotoLogin();
                });
        }

        function reload() {
            // version
            vm.version.ver = constant.CurrentVersion;

            // 检查新版本
            if (navigator.appupdate) {
                navigator.appupdate.getUpdateInfo('llq-student-release', function (info) {
                    vm.version.info = info;
                    vm.$apply();
                });
            }
        }

        function init() {
            vm.requestParam = {};
            vm.$watch('requestParam', reload, true);
        }

        init();
    }

});