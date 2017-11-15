/**
 * notification: 消息框
 */
define(['angular',
    'text!services/notification/notification-tpl.html',
    'jq',
    'services/backdrop/backdrop'], function (angular, notificationTpl, jq) {

    'use strict';

    angular.module('services.notification', ['services.backdrop'])
        .directive('uiNotification', ['$rootScope', 'backdrop', '$window', function ($rootScope, backdrop, $window) {
            return {
                restrict: 'EA',
                replace: true,
                templateUrl: 'services/notification/notification-tpl.html',
                link: function (scope, element, attrs) {
                }
            };
        }])
        .provider('notification', function () {

            this.$get = ['$rootScope', 'backdrop', '$window', function ($rootScope, backdrop, $window) {

                function setStyle() {
                    var topMargin = parseInt((jq($window).height() - 195) / 2 - 10);
                    $rootScope.notificationConf.style = {
                        'margin': topMargin + "px auto"
                    };
                }

                function hideDialog() {
                    $rootScope.notificationConf.isShow = false;
                    backdrop.hideMask();
                    //$rootScope.$apply();
                }

                function showDialog() {
                    $rootScope.notificationConf.isShow = true;
                    backdrop.showMask();
                    //$rootScope.$apply();
                }

                function setConf(title, msg, btns, cb) {
                    $rootScope.notificationConf.title = title;
                    $rootScope.notificationConf.msg = msg;

                    if (btns) {
                        var btnArr = btns.split(","),
                            btnsOpt = [];
                        for (var i = 0; i < btnArr.length; i++) {
                            btnsOpt.push({
                                idx: (i + 1),
                                name: btnArr[i],
                                styleClass: (btnArr[i] == '确定') ? 'button-primary' : 'button-default'
                            });
                        }
                        $rootScope.notificationConf.btns = btnsOpt;
                    } else {
                        $rootScope.notificationConf.btns = null;
                    }

                    $rootScope.notificationConf.cb = cb;
                }

                $rootScope.notificationConf = {
                    isShow: false,
                    style: null,
                    title: null,
                    msg: null,
                    html: null,
                    btns: null,
                    cb: null,
                    cbWrapper: function (idx) {
                        if ($rootScope.notificationConf.cb) {
                            $rootScope.notificationConf.cb(idx);
                        }
                        hideDialog();
                    }
                };

                setStyle();

                $rootScope.$on('backdrop.click', hideDialog);

                return {
                    info: function (title, msg, cb) {
                        setConf(title, msg, '关闭', cb);
                        showDialog();
                    },

                    alert: function (msg, cb) {
                        setConf('提醒', msg, '关闭', cb);
                        showDialog();
                    },

                    error: function (msg, cb) {
                        setConf('错误', msg, '关闭', cb);
                        showDialog();
                    },

                    confirm: function (msg, cb) {
                        setConf('提醒', msg, '关闭,确定', cb);
                        showDialog();
                    },

                    customDialog: function (title, msg, btns, cb) {
                        setConf(title, msg, btns, cb);
                        showDialog();
                    }
                };
            }];
        })
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('services/notification/notification-tpl.html', notificationTpl);
        }]);
});