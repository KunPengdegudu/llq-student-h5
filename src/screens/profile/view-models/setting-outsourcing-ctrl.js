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

    module.controller('ProfileSettingOutsourcingCtrl', ProfileSettingOutsourcing);

    ////////
    ProfileSettingOutsourcing.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$loadingOverlay',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileSettingOutsourcing($rootScope, $scope, $state, $timeout, $loadingOverlay, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            loadingTimer;

        vm.addressListEmpty = true;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/setting"
                },
                title: "海外购实名认证",
                isShow: true
            }, $location);
        }

        vm.realNameAuthList = [];
        vm.hasRealNameAuth = false;

        function loaderComplete() {
            $loadingOverlay.hide();

            if (loadingTimer) {
                $timeout.cancel(loadingTimer);
                loadingTimer = null;
            }
        }

        function showLoading(msg) {
            var template = "<div class='ui-loading'><img class='ui-loading-img' src='../../assets/imgs/base/loading.gif' /><div class='ui-loading-text'>" + msg + "</div></div></div>";
            $loadingOverlay.show(template);
            loadingTimer = $timeout(function () {
                $loadingOverlay.hide();
            }, 20000);
        }

        function realNameAuthList() {
            httpRequest.getReq(urlHelper.getUrl('realNameAuthList'))
                .then(function (d) {
                    if (d && d.items && d.items.length > 0) {
                        vm.realNameAuthList = d.items;
                        vm.hasRealNameAuth = true;
                    } else {
                        vm.hasRealNameAuth = false;
                    }
                }, function (err) {

                })
        }

        vm.deleteAuthUser = function (item) {
            if (item) {
                showLoading();
                httpRequest.getReq(urlHelper.getUrl('realNameAuthRemove'), {
                    id: item.id
                }).then(function (d) {
                    loaderComplete();
                    if (d) {
                        utils.alert('海外购认证信息删除成功', realNameAuthList);
                    }
                }, function (err) {
                    loaderComplete();
                    utils.error(err.msg || '服务器忙，请稍后再试！');
                })
            }
        };

        function init() {
            realNameAuthList();
        }

        init();

    }

});
