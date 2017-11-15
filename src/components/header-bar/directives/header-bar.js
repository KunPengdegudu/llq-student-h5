/*
 * isShow: false,
 * isShowLeftBtn: false,
 * leftBtnType: null,
 * leftBtnAttrs: null,
 * isShowRightBtn: false,
 * rightBtnType: null,
 * rightBtnAttrs: null,
 * title: " "
 */

define(['angular',
    'text!components/header-bar/views/header-bar-tpl.html',
    'components/custom-head/directives/custom-head-ui-route'
], function (angular, barTpl) {

    'use strict';

    angular
        .module('components.headerBar', ['components.customHead'])
        .directive('headerBar', headerBarDirective)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/header-bar/views/header-bar-tpl.html', barTpl);
        }]);

    ///////
    headerBarDirective.$inject = [
        '$rootScope',
        '$location',
        'httpRequest',
        '$window',
        'customHead',
        'CONSTANT_UTILS'
    ];

    function headerBarDirective($rootScope, $location, httpRequest, $window, customHead, utils) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: function ($element, $attribute) {
                return $attribute.templateUrl;
            },
            link: function ($scope, $element, $attribute) {
                var vm = $rootScope,
                    navConfig = {},
                    his = {
                        isBack: false,
                        items: new Array(),
                        goBack: function () {
                            this.items.pop();
                            return this.items[this.items.length - 1];
                        }
                    };
                var defaultNavConfig = {
                    isShow: false,
                    showTextTitle: true,
                    isShowLeftBtn: true,
                    isShowRightBtn: true
                };

                vm.resetNavConfig = resetNavConfig;
                vm.saveHistory = saveHistory;

                vm.isBack = function () {
                    return !!his.isBack;
                };

                vm.setBack = function (back) {
                    his.isBack = back;
                };

                vm.gotoBack = function () {
                    // 如果设置了url，采用url
                    //var params = {
                    //    type: 'back'
                    //}
                    //if (!vm.navConfig.closeWebView) {
                    if (vm.navConfig && vm.navConfig.leftBtnAttrs && vm.navConfig.leftBtnAttrs.url) {
                        gotoUrl(vm.navConfig.leftBtnAttrs.url);
                    } else {
                        vm.gotoBackFromHistory();
                    }
                    //} else {
                    //    window.postMessage(JSON.stringify(params));
                    //}

                };

                vm.gotoBackFromHistory = function () {
                    var url = his.goBack() || '/';
                    vm.setBack(true);
                    gotoUrl(url);
                };

                vm.gotoMsg = function () {
                    gotoUrl("/profile/msg");
                };

                vm.gotoCar = function () {
                    gotoUrl("/product/car");
                };

                vm.gotoSetting = function () {
                    gotoUrl("/profile/setting");
                };

                vm.contactUs = function () {
                    utils.contactUs();
                };

                // set navs base on microdata
                if (true !== customHead.getMicrodata('signIn')) {
                    vm.navConfig = defaultNavConfig;
                } else if (true !== customHead.getMicrodata('hasPermission')) {
                    vm.navConfig = defaultNavConfig;
                } else {
                    vm.navConfig = navConfig || defaultNavConfig;
                }

                //resetNavConfig({
                //    title: "零零期",
                //    isShow: true
                //});

                function resetNavConfig(cfg, $location) {
                    vm.navConfig = angular.extend({
                        isShow: false,
                        showTextTitle: true,
                        forbidBack: false, // 禁止回退
                        isShowLeftBtn: false,
                        leftBtnType: null,
                        leftBtnAttrs: null,
                        isShowRightBtn: false,
                        rightBtnType: null,
                        rightBtnAttrs: null,
                        title: " "
                    }, cfg);

                    var currentUrl = $location.url();

                    if (cfg && cfg.currentUrl) {
                        currentUrl = cfg.currentUrl;
                    }

                    if ($location) {
                        if (!vm.navConfig.forbidBack) {
                            saveHistory(currentUrl);
                        }
                    }

                }

                function saveHistory(url) {

                    if (his.items.length == 10) {
                        his.items.shift();// 移除第一条路径记录
                    }

                    if (vm.isBack()) {// 回退操作,不缓存旧路径
                        vm.setBack(false);
                    } else {
                        his.items.push(url);
                    }
                }

                function gotoUrl(redirect) {

                    if (!redirect || redirect == "") {
                        redirect = "/";
                    }

                    if (/^http(s)?:\/\//.test(redirect)) {
                        window.location.href = redirect;
                    } else {
                        window.location.replace("#" + redirect);
                    }
                }

            }
        };
    }

});