/**
 * constant
 */
define(['angular',
    'jq',
    'moment',
    'services/backdrop/backdrop',
    'services/notification/notification'], function (angular, jq, moment) {
    'use strict';
    var theme = document.getElementsByTagName('body')[0].getAttribute('data-theme');
    if (!theme) {
        theme = 'student';
    }

    var CONSTANT = {
        ALIPAY_SELLER: "3097472580@qq.com",
        ALIPAY_NOTIFY_URL: "www.007fenqi.com/w/pay/alipay/async_notify_url.do",

        APP_DOWNLOAD_URL: "https://down-cdn.007fenqi.com/app/family/homepage/index.html#/app/install",

        QUERY_SYS_NOTICE_URL: "/m/s/user/querySysNotice.json",
        LIST_SYS_NOTICE_URL: "/m/s/user/listSysNotice.json",

        SAVE_USER_CONTACTS_INFO: "/m/s/user/saveUserContactsInfos.json",

        APP_HOME_URL: "https://m.007fenqi.com/app/family/homepage/index.html#",

        CALL_CENTER_INFO: "/k/send_userJsonObject.json",

        GET_USER_INFO: "/m/s/user/get_user_info.json",
        MSG_COUNT_URL: "/m/p/a/count_push_msg.json",
        FETCH_COUNT_URL: "/m/s/credit/fetch/count_fetch_list.json",

        GET_TIME_STAMP: '/common/get_timestamp.json',  //获取当前时间

        CART_COUNT_URL: "/cart/quantity.json",

        GLOBAL_CONFIG_URL: "/sysnotice/user/listSysNotice.json?positionType=gb_config", // 全局设置url
        GLOBAL_CONFIG: null,

        DEFAULT_CITY: {
            "cityCode": "330100",
            "cityName": "杭州市"
        },

        DEFAULT_SHARE_INFO: {
            title: "零零期分期 - 大学生分期购物商城领先品牌",
            description: "大学生分期购物商城领先品牌，首次借款免息，0首付买手机等数码产品，更多福利等着你",
            thumb: "https://m.007fenqi.com/app/assets/imgs/weixin/share2.png",
            baseUrl: "https://m.007fenqi.com/app/family/m/index.html#"
        },

        AUTH_V1: "/auth/main",
        AUTH_V2: "/auth/main",

        DEVICE_TOKEN: "",
        UNIQUE_DEVICE_ID: "",
        TONGDUN_TOKEN: "",

        AppName: "llq-student-release",

        CurrentVersion: "3.6.7",
        AppVersion: null,
        NewestAppVersion: null
    };

    var EVENT_ID = {
        "show_product_detail": "000",
        "open_login_page": "001",
        "open_red_page": "002"
    };

    function init() {
        if (navigator.appupdate) {
            navigator.appupdate.getDeviceToken(function (deviceToken) {
                CONSTANT.DEVICE_TOKEN = deviceToken || "";
            });
            navigator.appupdate.getUpdateInfo(CONSTANT.AppName, function (d) {
                CONSTANT.AppVersion = d.localVer;
                CONSTANT.NewestAppVersion = d.serverVer;
            });
        }
        if (navigator.uniqueDeviceID) {
            navigator.uniqueDeviceID.get(function (udid) {
                CONSTANT.UNIQUE_DEVICE_ID = udid || "";
            });
        }
        if (navigator.tongdun) {
            navigator.tongdun.getBlackBox(function (deviceToken) {
                CONSTANT.TONGDUN_TOKEN = deviceToken || "";
            });
        }
    }

    init();

    var UTILS = function () {
        this.$get = ['$rootScope', '$window', 'httpRequest', 'settingCache', 'notification', '$interval', function ($rootScope, $window, httpRequest, settingCache, notification, $interval) {
            return {
                info: function (title, msg, cb) {
                    if (navigator.notification) {
                        navigator.notification.alert(msg, cb, title, "关闭");
                    } else {
                        notification.info(title, msg, cb);
                    }
                },
                alert: function (msg, cb) {
                    if (navigator.notification) {
                        navigator.notification.alert(msg, cb, "提醒", "关闭");
                    } else {
                        notification.alert(msg, cb);
                    }
                },
                error: function (msg, cb) {
                    if (navigator.notification) {
                        navigator.notification.alert(msg, cb, "错误", "关闭");
                    } else {
                        notification.error(msg, cb);
                    }
                },
                confirm: function (msg, cb) {
                    if (navigator.notification) {
                        navigator.notification.confirm(msg, cb, "提醒", "取消,确定");
                    } else {
                        notification.confirm(msg, cb);
                    }
                },
                customDialog: function (title, msg, btns, cb) {
                    if (navigator.notification) {
                        navigator.notification.confirm(msg, cb, title, btns);
                    } else {
                        notification.customDialog(title, msg, btns, cb);
                    }
                },
                contactUs: function () {
                    if (navigator.udesk) {
                        httpRequest.getReq(CONSTANT.CALL_CENTER_INFO, null, {
                            ignoreLogin: true
                        }).then(function (d) {
                            if (d) {
                                navigator.udesk.contactUs(d.sdkToken, d.userInfo);
                            }
                        });
                    } else {
                        this.info("版本升级", "当前版本不支持在线客服，请升级最新版本。");
                    }
                },
                getGlobalConfig: function (fn, flush) {

                    var _self = this;

                    if (CONSTANT.GLOBAL_CONFIG == null || flush) {
                        httpRequest.getReq(CONSTANT.GLOBAL_CONFIG_URL, null, {
                            ignoreLogin: true
                        }).then(function (d) {
                            var items = {};
                            if (d && d.items) {
                                for (var i = 0; i < d.items.length; i++) {
                                    items = jq.extend(items, _self.string2Json(d.items[i]));
                                }
                            }
                            CONSTANT.GLOBAL_CONFIG = items;
                            fn(CONSTANT.GLOBAL_CONFIG);
                        }, function (d) {
                            CONSTANT.GLOBAL_CONFIG = null;
                            fn(CONSTANT.GLOBAL_CONFIG);
                        });
                    } else {
                        fn(CONSTANT.GLOBAL_CONFIG);
                    }
                },
                getDeviceToken: function (fn) {
                    if (this.isEmpty(CONSTANT.DEVICE_TOKEN)) {
                        if (navigator.appupdate) {
                            navigator.appupdate.getDeviceToken(function (deviceToken) {
                                CONSTANT.DEVICE_TOKEN = deviceToken || "";
                                fn(CONSTANT.DEVICE_TOKEN);
                            });
                        }
                    } else {
                        fn(CONSTANT.DEVICE_TOKEN);
                    }
                },
                getUniqueDeviceID: function (fn) {
                    if (this.isEmpty(CONSTANT.UNIQUE_DEVICE_ID)) {
                        if (navigator.uniqueDeviceID) {
                            navigator.uniqueDeviceID.get(function (udid) {
                                CONSTANT.UNIQUE_DEVICE_ID = udid || "";
                                fn(CONSTANT.UNIQUE_DEVICE_ID);
                            });
                        }
                    } else {
                        fn(CONSTANT.UNIQUE_DEVICE_ID);
                    }
                },
                getTongDunToken: function (fn) {
                    if (this.isEmpty(CONSTANT.TONGDUN_TOKEN)) {
                        if (navigator.tongdun) {
                            navigator.tongdun.getBlackBox(function (deviceToken) {
                                CONSTANT.TONGDUN_TOKEN = deviceToken || "";
                                fn(CONSTANT.TONGDUN_TOKEN);
                            });
                        }
                    } else {
                        fn(CONSTANT.TONGDUN_TOKEN);
                    }
                },
                /**
                 * 深度复制一个对象
                 */
                deepClone: function (obj) {
                    // Handle the 3 simple types, and null or undefined
                    if (null == obj || "object" != typeof obj) return obj;
                    // Handle Date
                    if (obj instanceof Date) {
                        var copy = new Date();
                        copy.setTime(obj.getTime());
                        return copy;
                    }
                    // Handle Array
                    if (obj instanceof Array) {
                        var copy = [];
                        for (var i = 0, len = obj.length; i < len; ++i) {
                            copy[i] = UTILS.deepClone(obj[i]);
                        }
                        return copy;
                    }
                    // Handle Object
                    if (obj instanceof Object) {
                        var copy = {};
                        for (var attr in obj) {
                            if (obj.hasOwnProperty(attr))
                                copy[attr] = UTILS.deepClone(obj[attr]);
                        }
                        return copy;
                    }
                    return obj;
                },
                dot: function (eventId, attributes) {
                    if (navigator.umeng) {
                        navigator.umeng.event(eventId, attributes);
                    }
                },
                // 带时间戳的缓存
                cacheTime: function (key) {
                    var date = new Date();
                    settingCache.set("__ct_" + key, date.getTime());
                },
                deleteCacheTime: function (key) {
                    settingCache.set("__ct_" + key, undefined);
                },
                // 判断缓存是否有效，true-有效期内，false-有效期外或者没有
                // @param key
                // @param time: 时间s
                checkCacheTime: function (key, time) {
                    var c = settingCache.get("__ct_" + key);

                    if (!c) {
                        return false;
                    }
                    if (!time) {
                        return true;
                    }
                    var d = (new Date()).getTime() - parseInt(c);

                    return (d < time * 1000);
                },
                dateFormat: function (d, format) {

                    var date = d;

                    if (!isNaN(d)) {
                        date = new Date(d);
                    }

                    if (date) {
                        var o = {
                            "M+": date.getMonth() + 1, //month
                            "d+": date.getDate(), //day
                            "h+": date.getHours(), //hour
                            "m+": date.getMinutes(), //minute
                            "s+": date.getSeconds(), //second
                            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                            "S": date.getMilliseconds() //millisecond
                        };

                        format = format || "yyyy-MM-dd hh:mm:ss";

                        if (/(y+)/.test(format)) {
                            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                        }

                        for (var k in o) {
                            if (new RegExp("(" + k + ")").test(format)) {
                                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                            }
                        }
                        return format;
                    }
                },

                stringToDate: function (str, fmt) {
                    if (!fmt) {
                        fmt = 'YYYY-MM-DD HH:mm:ss';
                    }
                    var d = moment(str, fmt);
                    return d.toDate();
                },

                dateAdd: function (date, strInterval, n) {
                    switch (strInterval) {
                        case 's' :
                            return new Date(Date.parse(date) + (1000 * Number));
                        case 'n' :
                            return new Date(Date.parse(date) + (60000 * Number));
                        case 'h' :
                            return new Date(Date.parse(date) + (3600000 * Number));
                        case 'd' :
                            return new Date(Date.parse(date) + (86400000 * Number));
                        case 'w' :
                            return new Date(Date.parse(date) + ((86400000 * 7) * Number));
                        case 'q' :
                            return new Date(date.getFullYear(), (date.getMonth()) + Number * 3, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                        case 'm' :
                            return new Date(date.getFullYear(), (date.getMonth()) + Number, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                        case 'y' :
                            return new Date((date.getFullYear() + Number), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                    }
                },

                htmlEncode: function (str) {
                    var s = "";
                    if (str) {
                        if (str.length == 0) return "";
                        s = str.replace(/&/g, "&amp;");
                        s = s.replace(/</g, "&lt;");
                        s = s.replace(/>/g, "&gt;");
                        s = s.replace(/≤/g, "&le;");
                        s = s.replace(/≥/g, "&ge;");
                        s = s.replace(/ /g, "&nbsp;");
                        s = s.replace(/\'/g, "&#39;");
                        s = s.replace(/\"/g, "&quot;");
                        s = s.replace(/—/g, "&mdash;");
                        s = s.replace(/“/g, "&ldquo;");
                        s = s.replace(/”/g, "&rdquo;");
                        s = s.replace(/\r\n/g, "&lt;br&gt;");
                        s = s.replace(/\n/g, "&lt;br&gt;");
                    }
                    return s;
                },

                htmlDecode: function (str, ignoreBr) {
                    var s = "";
                    if (str) {
                        if (str.length == 0) return "";
                        s = s.replace(/&yen;/g, "¥");
                        s = str.replace(/&amp;/g, "&");
                        s = s.replace(/&lt;/g, "<");
                        s = s.replace(/&gt;/g, ">");
                        s = s.replace(/&le;/g, "≤");
                        s = s.replace(/&ge;/g, "≥");
                        s = s.replace(/&nbsp;/g, " ");
                        s = s.replace(/&#39;/g, "\'");
                        s = s.replace(/&quot;/g, '\"');
                        s = s.replace(/&middot;/g, "·");
                        s = s.replace(/&mdash;/g, "—");
                        s = s.replace(/&ldquo;/g, "“");
                        s = s.replace(/&rdquo;/g, "”");
                        if (!ignoreBr) {
                            s = s.replace(/\r\n/g, "<br>");
                            s = s.replace(/\n/g, "<br>");
                        }
                    }
                    return s;
                },
                string2Json: function (str) {
                    var obj = new Object();
                    if (str) {
                        str = this.htmlDecode(str, true);
                        try {
                            obj = JSON.parse(str);
                        } catch (error) {

                        }

                    }
                    return obj;
                },

                getByClass: function (oParent, sClass) {
                    var aEle = oParent.getElementsByTagName('*');
                    var re = new RegExp('b' + sClass + 'b');
                    var aResult = [];
                    for (var i = 0; i < aEle.length; i++) {
                        if (re.test(aEle[i].className)) {
                            aResult.push(aEle[i]);
                        }
                    }
                    return aResult;
                },

                getUrlWithParams: function (url, params) {
                    var paramStr = '';

                    var hasParam = (url.indexOf('?') > -1);

                    if (params) {
                        for (var param in params) {
                            if (param && params[param] !== undefined) {
                                paramStr = paramStr + (((paramStr == '' && !hasParam) ? '?' : '&'));
                                paramStr = paramStr + param + '=' + params[param];
                            }
                        }
                    }

                    return url + paramStr;
                },

                createRedirect: function ($location) {
                    return window.encodeURIComponent($location.url());
                },

                getRedirect: function (redirect) {
                    return window.decodeURIComponent(redirect);
                },

                gotoBrowser: function (redirect) {
                    if (navigator.appupdate && navigator.appupdate.openUrlInner) {
                        navigator.appupdate.openUrlInner('零零期', redirect);
                    } else {
                        window.location.href = redirect;
                    }
                },

                // attr: title, onSuccessFn, onFailureFn
                // type: back jump share
                gotoUrl: function (redirect, attr, type) {
                    if (window.reactNativeInject && window.reactNativeInject == "fromLLQApp") {
                        /**
                         var appType = type ? type : 'jump';
                         var params = JSON.stringify({
                            type: appType,
                            sceneName: redirect
                        });
                         **/
                        window.postMessage(redirect);
                    } else {
                        if (!redirect || redirect == "") {
                            redirect = "/";
                        }

                        if (/^http(s)?:\/\//.test(redirect)) {
                            var win = {
                                width: jq(window).width(),
                                height: jq(window).height() - 40
                            };
                            window.outerPageFn.show(redirect, win, attr);
                        } else if (/^__location:\/\//.test(redirect)) {
                            window.location.href = redirect.substring(13);
                        } else if (/^__browser:\/\//.test(redirect)) {
                            this.gotoBrowser(redirect.substring(12));
                        } else if (/^__inner:\/\//.test(redirect)) {
                            var url = redirect.substring(10);
                            if (navigator.appupdate && navigator.appupdate.openUrlInner) {
                                navigator.appupdate.openUrlInner('零零期', url);
                            } else {
                                window.location.href = url;
                            }
                        } else if (/^[\s|\S]{1,}:\/\//.test(redirect)) {
                            window.location.href = redirect;
                        } else {
                            window.location.replace("#" + redirect);
                        }
                    }
                },

                checkLogin: function ($rootScope, $location, redirect, to) {
                    console.log($rootScope.loginStatus)
                    if (!$rootScope.loginStatus) {
                        var loginUrl = "/login";
                        var params = {};
                        if (!this.isEmpty(redirect)) {
                            params.redirect = window.encodeURIComponent(redirect);
                        } else {
                            params.redirect = window.encodeURIComponent($location.url());
                        }
                        if (!this.isEmpty(to)) {
                            params.to = window.encodeURIComponent(to);
                        }
                        this.gotoUrl(this.getUrlWithParams(loginUrl, params));
                        return false;
                    }
                    return true;
                },

                isEmpty: function (str) {
                    if (str && str != "") {
                        return false;
                    }
                    return true;
                },

                isEmptyObject: function (obj) {
                    for (var name in obj) {
                        return false;
                    }
                    return true;
                },

                checkID: function (str) {
                    if ((/^(\d{18,18}|\d{15,15}|\d{17,17}[x|X])$/).test(str)) {
                        return true;
                    }
                    return false;
                },

                checkMobile: function (str) {
                    if ((/^[1][0-9]{10}$/).test(str)) {
                        return true;
                    }
                    return false;
                },

                checkEmail: function (str) {
                    if ((/^\s*$|^\w+[\w\.\-\_]+@(\w+\.){1,4}\w+$/).test(str)) {
                        return true;
                    }
                    return false;
                },

                checkUrl: function (str) {
                    if (/^http(s)?:\/\//.test(str)) {
                        return true;
                    }
                    return false;
                },

                checkCardNo: function (str) {
                    if ((/^\d{14,19}$/).test(str)) {
                        return true;
                    }
                    return false;
                },

                checkVersion: function (local, remote) {
                    var localVers = local.split("."),
                        remoteVers = remote.split(".");
                    var isNew = true;
                    for (var i = 0; i < localVers.length; i++) {
                        if (localVers[i] < remoteVers[i]) {
                            isNew = false;
                            break;
                        } else if (localVers[i] > remoteVers[i]) {
                            isNew = true;
                            break;
                        }
                    }
                    return isNew;
                },

                isAppleStore: function () {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf('applestore') > -1) {
                        return true;
                    }
                    return false;
                },

                isMM: function () {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf('micromessenger') > -1) {
                        return true;
                    }
                    return false;
                },

                getAppVersion: function () {
                    try {
                        var ua = navigator.userAgent.toLowerCase();
                        ua = ua.substring(ua.indexOf('llqapp'));
                        var uaList = ua.split(" ");
                        ua = uaList[0];
                        ua = ua.substring(7);
                        return ua;
                    } catch (e) {
                    }
                    return "0.0.1";
                },

                // 购物车数量
                carProductNum: function () {
                    httpRequest.getReq(CONSTANT.CART_COUNT_URL, null, {
                        ignoreLogin: true
                    }).then(function (d) {
                        $rootScope.FLAGS_HAS_CART_COUNT = (d > 0);
                        $rootScope.FLAGS_CART_COUNT = d;
                    });
                },

                // 刷新消息
                flushFlags: function (msgFn, fetchFn) {

                    function showFlags() {

                        var d = $rootScope.FLAGS_COUNT_MSG + $rootScope.FLAGS_COUNT_QUOTA;

                        // 设置角标
                        if (navigator.notification && jq.os.ios) {
                            navigator.notification.badge(d);
                        }

                        // 设置导航
                        var navs = $rootScope["__navs"];

                        if (navs) {
                            navs[4].brand = d;
                        }
                    }

                    function getFetchCount() {
                        // 获得提升额度数量
                        httpRequest.getReq(CONSTANT.FETCH_COUNT_URL, {
                            app: 'student',
                            read_flag: 'unread'
                        }, {
                            ignoreLogin: true
                        }).then(function (d) {
                            $rootScope.FLAGS_HAS_QUOTA = (d > 0);
                            $rootScope.FLAGS_COUNT_QUOTA = d;

                            // 执行fn
                            if (fetchFn) {
                                fetchFn($rootScope.FLAGS_HAS_QUOTA, $rootScope.FLAGS_COUNT_QUOTA);
                            }

                            // show
                            showFlags();

                        });
                    }

                    function getMsgCount() {
                        httpRequest.getReq(CONSTANT.MSG_COUNT_URL, {
                            app: 'student',
                            read_flag: 'unread'
                        }, {
                            ignoreLogin: true
                        }).then(function (d) {
                            $rootScope.FLAGS_HAS_MSG = (d > 0);
                            $rootScope.FLAGS_COUNT_MSG = d;

                            // 执行fn
                            if (msgFn) {
                                msgFn($rootScope.FLAGS_HAS_MSG, $rootScope.FLAGS_COUNT_MSG);
                            }

                            // next
                            getFetchCount();
                        });
                    }

                    getMsgCount();

                    this.carProductNum();
                },
                // 检查新版本
                checkAndUpdate: function () {
                    var _self = this;
                    if (!this.checkCacheTime("CheckUpdateTime", 600)) {
                        if (navigator.appupdate) {
                            var updateType = this.isAppleStore() ? 'applestore' : 'other';
                            navigator.appupdate.checkAndUpdate(CONSTANT.AppName, CONSTANT.CurrentVersion, updateType, function (type) {
                                _self.cacheTime("CheckUpdateTime");
                                if (type == "updateContent") {
                                    window.location.reload();
                                }
                            });
                        }
                    }

                },

                canRateApp: function () {
                    if (jq.os.ios && navigator.appupdate && navigator.appupdate.getAppId) {
                        return true;
                    }
                    return false;
                },

                doRateApp: function () {
                    var _self = this;
                    if (jq.os.ios && navigator.appupdate && navigator.appupdate.getAppId) {
                        navigator.appupdate.getAppId(function (appId) {
                            if (!_self.isEmpty(appId)) {
                                var url = "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=" + appId + "&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8";
                                _self.gotoBrowser(url);
                            }
                        });
                    }
                },

                // 系统评价
                rateApp: function () {
                    var _self = this;
                    if (jq.os.ios && navigator.appupdate && navigator.appupdate.getAppId) {

                        var key = "RateApp";
                        var time = 86400 * 7;
                        var c = settingCache.get("__ct_" + key);
                        if (!c) {
                            this.cacheTime(key);
                            time = 86400 * 2;
                        }

                        if (!this.checkCacheTime(key, time)) {
                            navigator.appupdate.getAppId(function (appId) {
                                if (!_self.isEmpty(appId)) {
                                    _self.cacheTime(key);
                                    _self.customDialog("评价零零期", "亲，喜欢零零期的APP么，请您给零零期一个五星好评。", "现在就去,残忍拒绝", function (idx) {
                                        if (idx == 1) {
                                            var url = "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=" + appId + "&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8";
                                            _self.gotoBrowser(url);
                                        }
                                    });
                                }
                            });
                        }
                    }
                },

                // 设置状态栏颜色
                setStatusBarColor: function (color) {
                    if (navigator.statusbar) {
                        navigator.statusbar.backgroundColorByHexString(color);
                    }
                },

                // 设置状态栏样式
                // default, lightContent, blackTranslucent, blackOpaque
                setStatusBarStyle: function (style) {
                    if (navigator.statusbar) {
                        if (style == "lightContent") {
                            navigator.statusbar.styleLightContent();
                        } else if (style == "blackTranslucent") {
                            navigator.statusbar.styleBlackTranslucent();
                        } else if (style == "blackOpaque") {
                            navigator.statusbar.styleBlackOpaque();
                        } else {
                            navigator.statusbar.styleDefault();
                        }
                    }
                },
                // 根据时间差算出时分秒
                // time 时间差
                getHMS: function (time) {
                    if (time && time > 0) {
                        var data = {
                            hour: 0,
                            minute: 0,
                            second: 0
                        }
                        if (time && time > 0) {
                            var thisTime = parseInt(time / 1000);
                            if (typeof (thisTime) == 'number') {
                                var s, m, minutes, h;
                                s = parseInt(thisTime % 60);
                                minutes = parseInt((thisTime - s) / 60);
                                m = parseInt(minutes % 60);
                                h = parseInt((minutes - m) / 60);
                                data.hour = (h > 9) ? h : ('0' + h);
                                data.minute = (m > 9) ? m : ('0' + m);
                                data.second = (s > 9) ? s : ('0' + s);
                                return data;
                            }
                        }
                    }
                },

                // 获得定位信息
                getLocation: function (onSuccess, onError) {
                    if (this.isMM() && window.WEIXIN_READY) {
                        wx.getLocation({
                            type: 'wgs84',
                            success: function (res) {
                                if (onSuccess) {
                                    var loc = {
                                        coodrs: res,
                                        address: {}
                                    };
                                    onSuccess(loc);
                                }
                            }
                        });
                    } else if (navigator.amaplocation) {
                        navigator.amaplocation.getCurrentPosition(onSuccess, onError);
                    } else if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(onSuccess, onError);
                    } else {
                        var pos = {type: 'noLocateDevice'};
                        if (onSuccess) {
                            onSuccess(pos);
                        }
                    }
                },

                // 获得登录信息
                getAttachInfo: function (cb) {
                    var info = {
                        AccessSource: $window.ACCESS_SOURCE,
                        AppType: jq.os.ios ? "ios" : jq.os.android ? "android" : "",
                        AppVersion: '',
                        NewestAppVersion: '',
                        ContentVersion: CONSTANT.CurrentVersion
                    };

                    if (navigator.appupdate) {
                        navigator.appupdate.getUpdateInfo(CONSTANT.AppName, function (d) {
                            info.AppVersion = d.localVer;
                            info.NewestAppVersion = d.serverVer;
                            if (cb) {
                                cb(info);
                            }
                        });
                    } else {
                        if (cb) {
                            cb(info);
                        }
                    }
                },

                saveMyPhoneNumber: function () {
                    if (navigator.appupdate && navigator.appupdate.getPhoneNumber) {
                        navigator.appupdate.getPhoneNumber(function (num) {
                            if (num) {
                                var json = {
                                    frName: "***本机号码***",
                                    phone: num,
                                    otherInfo: "system auto save"
                                };

                                httpRequest.getReq(CONSTANT.SAVE_USER_CONTACTS_INFO + "?deviceToken=" + CONSTANT.UNIQUE_DEVICE_ID,
                                    null, {
                                        type: 'POST',
                                        data: [json]
                                    });
                            }
                        });
                    }
                },

                pickContactWithAllContacts: function (onSuccess, onError) {
                    var that = this;

                    function contactError() {
                        if (jq.os.ios) {
                            that.error("未获得通讯录授权，请在系统[设置]-[隐私]-[通讯录]中设置允许[零零期]使用通讯录。");
                        } else {
                            that.error("未获得通讯录授权，请在系统[设置]-[应用管理]-[零零期]-[权限管理]中设置允许其[获取联系人信息]。");
                        }
                    }

                    that.getContacts(function (contactList) {
                        if (!$rootScope.sendContacts) {
                            httpRequest.getReq(CONSTANT.SAVE_USER_CONTACTS_INFO + "?deviceToken=" + CONSTANT.UNIQUE_DEVICE_ID,
                                null, {
                                    type: 'POST',
                                    data: contactList
                                }).then(function () {
                                $rootScope.sendContacts = true;
                            });
                        }

                        that.pickContact(function (contact) {
                            var phone = "",
                                checkPhone = false;

                            if (contact.phoneNumbers) {
                                for (var i = 0; i < contact.phoneNumbers.length; i++) {
                                    phone = fixPhone(contact.phoneNumbers[i].value);
                                    if (that.checkMobile(phone)) {
                                        checkPhone = true;
                                        break;
                                    }
                                }
                            }

                            if (checkPhone) {
                                onSuccess(phone);
                            } else {
                                onError(phone);
                            }

                            function fixPhone(phone) {
                                if (phone) {
                                    phone = phone.replace(/\D/g, '');
                                    if (phone.length > 11) {
                                        phone = phone.substring(phone.length - 11);
                                    }
                                }
                                return phone;
                            }

                        }, contactError);
                    }, contactError);
                },

                pickContact: function (onSuccess, onError) {
                    // ios10
                    if (jq.os.ios && parseInt(jq.os.version) >= 9 && navigator.contacts10 && navigator.contacts10.getAll) {
                        navigator.contacts10.pickContact(onSuccess, onError);
                    } else if (navigator.contacts) {
                        navigator.contacts.pickContact(onSuccess, onError);
                    }
                },

                getContacts: function (onSuccess, onError) {
                    if (jq.os.ios && parseInt(jq.os.version) >= 9 && navigator.contacts10 && navigator.contacts10.getAll) {

                        navigator.contacts10.getAll(function (contacts) {
                            var contactsList = [], c;
                            if (contacts && contacts.length > 0) {
                                for (var i = 0; i < contacts.length; i++) {
                                    c = contacts[i];
                                    contactsList.push({
                                        frName: getName10(c),
                                        company: getCompany10(c.company),
                                        phone: getPhones10(c.phoneNumbers),
                                        otherInfo: getOtherInfo10(c)
                                    });
                                }
                            }

                            if (onSuccess) {
                                onSuccess(contactsList);
                            }
                        }, function (contactError) {
                            if (onError) {
                                onError(contactError);
                            }
                        });
                    } else if (navigator.contacts) {
                        var options = new ContactFindOptions();
                        options.filter = "";
                        options.multiple = true;

                        var filter = ["displayName", "organizations"];

                        navigator.contacts.find(filter, function (contacts) {
                            var contactsList = [], c;
                            if (contacts && contacts.length > 0) {
                                for (var i = 0; i < contacts.length; i++) {
                                    c = contacts[i];
                                    contactsList.push({
                                        frName: getName(c),
                                        company: getOrganizations(c.organizations),
                                        phone: getPhones(c.phoneNumbers),
                                        otherInfo: getOthers(c)
                                    });
                                }
                            }

                            if (onSuccess) {
                                onSuccess(contactsList);
                            }
                        }, function (contactError) {
                            if (onError) {
                                onError(contactError);
                            }
                        }, options);

                    }


                    function getCompany10(comp) {
                        var company = null;
                        if (comp) {
                            company = comp;
                        }
                        return company;
                    }

                    function getName10(eachContact) {
                        var name;
                        if (eachContact.familyName) {
                            name = eachContact.familyName + eachContact.givenName;
                        } else {
                            name = eachContact.givenName;
                        }
                        return name;
                    }

                    function getPhones10(phones) {

                        var number = null;
                        if (phones && phones.length > 0) {
                            number = "";
                            for (var i = 0; i < phones.length; i++) {
                                if (i > 0) {
                                    number = number + ";";
                                }
                                number = number + phones[i];
                            }
                        }

                        return number;

                    }

                    function getOtherInfo10(eachContact) {
                        var info = {};
                        if (eachContact.note) {
                            info['note'] = eachContact.note;
                        }
                        if (eachContact.address && eachContact.address.length > 0) {
                            info['addresses'] = eachContact.address;
                        }
                        if (eachContact.emailAddresses && eachContact.emailAddresses.length > 0) {
                            info['emails'] = eachContact.emailAddresses;
                        }
                        if (eachContact.jobTitle) {
                            info['jobTitle'] = eachContact.jobTitle;
                        }
                        return JSON.stringify(info);

                    }


                    function getName(c) {
                        var name = null;
                        if (c) {
                            name = c.displayName;
                            if (!name && c.name) {
                                name = c.name.formatted;
                            }
                        }
                        return name;
                    }

                    function getPhones(phones) {
                        var rtn = null;
                        if (phones && phones.length > 0) {
                            rtn = "";
                            for (var i = 0; i < phones.length; i++) {
                                if (i > 0) {
                                    rtn = rtn + ";";
                                }
                                rtn = rtn + phones[i].value;
                            }
                        }
                        return rtn;
                    }

                    function getOrganizations(org) {
                        var rtn = null;
                        if (org && org.length > 0) {
                            rtn = "";
                            for (var i = 0; i < org.length; i++) {
                                if (i > 0) {
                                    rtn = rtn + ";";
                                }
                                rtn = rtn + org[i].name;
                            }
                        }
                        return rtn;
                    }

                    function getOthers(c) {
                        var rtn = {};
                        if (c.nickname) {
                            rtn.nickname = c.nickname;
                        }
                        if (c.note) {
                            rtn.note = c.note;
                        }
                        if (c.addresses) {
                            rtn.addresses = c.addresses;
                        }
                        if (c.ims) {
                            rtn.ims = c.ims;
                        }
                        if (c.emails) {
                            rtn.emails = c.emails;
                        }
                        return JSON.stringify(rtn);
                    }
                }
            };
        }];
    };

    angular
        .module('services.constant', ['services.backdrop', 'services.notification'])
        //.constant('CONSTANT_STYLE_URL_PREFIX', 'http://localhost:3000/watch/')
        .constant('CONSTANT_STYLE_URL_PREFIX', 'https://m.007fenqi.com/')
        .constant('CONSTANT_THEME', theme)
        .constant('CONSTANT', CONSTANT)
        .constant('EVENT_ID', EVENT_ID)
        .provider('CONSTANT_UTILS', UTILS);


});
