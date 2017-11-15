/**
 * activity 901 controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/activity/module',
    'jq',
    'qrcode',
    'screens/activity/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ActivityA901Ctrl', Activity);

    ////////
    Activity.$inject = [
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
    function Activity($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        var _title = $stateParams.name;
        var _type = $stateParams.type?$stateParams.type:'school_activities';
        vm.canShow = false;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: _title,
                isShow: true
            }, $location);
        }

        vm.linkUrl = null;
        vm.ruleUrl = null;
        vm.title = null;
        if (vm.title) {
            $rootScope.navConfig.title = vm.title;
        }
        vm.gotoUrl = function (linkUrl) {
            if (linkUrl) {
                utils.gotoUrl(linkUrl);
            }
        };
        vm.gotoRulesUrl = function (ruleUrl) {
            if (ruleUrl) {
                utils.gotoUrl(ruleUrl);
            } else {
                vm.rulesDialog.closeDialog();
            }
        };

        vm.rulesDialog = {
            isVisible: false,
            openDialog: function () {
                vm.rulesDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.rulesDialog.isVisible = false;
            }
        };
        vm.showRule = false;

        function init() {
            httpRequest.getReq(urlHelper.getUrl("listSysNotices"), {
                'positionType': _type
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items) {
                    var item = d.items[0];
                    if (item.memo) {
                        vm.title = item.memo;
                    }
                    if (item.content) {
                        vm.schoolContent = utils.htmlDecode(item.content);
                    }
                    if (item.linkUrl) {
                        vm.linkUrl = item.linkUrl
                    }
                }
            });
            httpRequest.getReq(urlHelper.getUrl("listSysNotices"), {
                'positionType': 'school_activity_rules'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items) {
                    var item = d.items[0];
                    if (item.content) {
                        vm.rulesContent = utils.htmlDecode(item.content);
                        vm.showRule = true;
                    }
                    if (item.linkUrl) {
                        vm.ruleUrl = item.linkUrl
                    }
                }
            });

        }

        init();


    }

});