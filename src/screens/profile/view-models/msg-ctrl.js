/**
 * profile my controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'jq',
    'screens/profile/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProfileMsgCtrl', ProfileMsg);

    ////////
    ProfileMsg.$inject = [
        '$rootScope',
        '$scope',
        '$q',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileMsg($rootScope, $scope, $q, httpRequest, $location, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "我的消息",
                isShow: true,
                isShowRightBtn: true,
                rightBtnType: "text",
                rightBtnAttrs: {
                    text: "全部已读",
                    fn: setAllRead
                }
            }, $location);
        }

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        vm.showMsgDetail = showMsgDetail;
        vm.setAllRead = setAllRead;

        /**
         * Screen reload
         */
        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();
            httpRequest.getReq(urlHelper.getUrl('msgList'), {
                offset: pageIndex,
                app: 'student',
                limit: 10
            }).then(function (d) {
                pageIndex++;
                var items = d.items;
                if (items && items.length === 0) {
                    vm.canLoad = false;
                }
                vm.items = vm.items.concat(items);
                if (vm.items.length === 0) {
                    vm.isAbnormal = true;
                }
                dtd.resolve();
            }, function () {
                dtd.reject();
            });
            return dtd.promise;
        }

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        function showMsgAndGoto(item, gotoText, url) {
            utils.customDialog(item.title, utils.htmlDecode(item.text), "关闭," + gotoText, function (idx) {
                if (idx == 2) {
                    utils.gotoUrl(url);
                }
            });
        }

        function showMsgAndGotoBrowser(item, gotoText, url) {
            utils.customDialog(item.title, utils.htmlDecode(item.text), "关闭," + gotoText, function (idx) {
                if (idx == 2) {
                    utils.gotoBrowser(url);
                }
            });
        }

        function showMsgDetail(item) {
            // 按照类型跳转
            if (item.type == "make_delivery") {
                showMsgAndGoto(item, "去确认收货", "/profile/myorder/orderall");
            } else if (item.type == "spread_audit_un_pass") {
                showMsgAndGoto(item, "去重新审核", "/auth/main");
            } else if (item.type == "counpon_grant") {
                showMsgAndGoto(item, "去领红包", "/profile/myred");
            } else if (item.type == "blank_note_audit_pass" || item.type == "blank_note_grant_success") {
                showMsgAndGoto(item, "查看白条状态", "/profile/myorder/ordercash");
            } else if (item.type == "repayment") {
                showMsgAndGoto(item, "去还款", "/profile/mybill/billcurrent");
            } else if (item.type == "inner") {
                showMsgAndGoto(item, "打开页面", utils.htmlDecode(item.url));
            } else if (item.type == "browser") {
                showMsgAndGotoBrowser(item, "打开页面", utils.htmlDecode(item.url));
            } else {
                utils.info(item.title, utils.htmlDecode(item.text));
            }

            if (item.readFlag == 'unread') {
                httpRequest.getReq(urlHelper.getUrl('flagPushMsg'), {
                    ids: item.id,
                    app: 'student',
                    read_flag: 'read'
                }).then(function (d) {
                    item.readFlag = 'read';
                    // 设置角标
                    if (navigator.notification && jq.os.ios) {
                        navigator.notification.badge(d.unreadCount);
                    }
                });
            }
        }

        // 设置角标
        function setBadge(num) {
            if (navigator.notification && jq.os.ios) {
                navigator.notification.badge(num);
            }
        }

        function setAllRead() {
            httpRequest.getReq(urlHelper.getUrl('flagPushMsg'), {
                app: 'student',
                read_flag: 'read'
            }).then(function (d) {
                for (var i = 0; i < vm.items.length; i++) {
                    vm.items[i].readFlag = 'read';
                }
                setBadge(0);
            });
        }


    }

});