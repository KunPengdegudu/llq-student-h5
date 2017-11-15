/**
 *
 */
(function () {

    function isStartWith(str, sub) {
        return 0 == str.indexOf(sub);
    }

    function isEndWith(str, sub) {
        var strLen = str.length,
            subLen = sub.length;
        return strLen >= subLen && str.indexOf(sub) == strLen - subLen;
    }

    function trim(str) {
        return isString(str) ? str.replace(/^\s+|\s+$/g, "") : "";
    }

    function getCookie(name) {
        var c = doc.cookie.match(new RegExp("\\b" + name + "=([^;]+)"));
        return c ? c[1] : "";
    }

    function getSPMFromUrl(url) {
        var spm,
            spmArr = url.match(new RegExp("\\?.*spm=([\\w\\.\\-\\*]+)"));
        return spmArr && (spm = spmArr[1]) ? spm : null;
    }

    function isContain(parent, child) {
        return parent.indexOf(child) > -1;
    }

    function isNumber(obj) {
        return "number" == typeof obj;
    }

    function isUnDefined(obj) {
        return "undefined" == typeof obj;
    }

    function isString(obj) {
        return "string" == typeof obj;
    }

    function isArray(obj) {
        return "[object Array]" === Object.prototype.toString.call(obj)
    }

    function tryToDecodeURIComponent(val, def) {
        var rtn = def || "";
        if (val) {
            try {
                rtn = decodeURIComponent(val);
            } catch (e) {

            }
        }
        return rtn;
    }

    function arr2param(arr) {
        var name,
            value,
            newArr = [];
        for (var i = 0; i < arr.length; i++) {
            name = arr[i][0];
            value = arr[i][1];
            newArr.push(isStartWith(name, s_plain_obj) ? value : name + "=" + encodeURIComponent(value));
        }
        return newArr.join("&");
    }

    function obj2param(obj) {
        var name,
            value,
            newArr = [];
        for (name in obj) {
            obj.hasOwnProperty(name) && (value = "" + obj[name], newArr.push(isStartWith(name, s_plain_obj) ? value : name + "=" + encodeURIComponent(value)));
        }
        return newArr.join("&");
    }

    function mkPlainKey() {
        return s_plain_obj + Math.random();
    }

    function ifAdd(arr, addArr) {
        if (addArr) {
            var param,
                name,
                value;
            for (var i = 0; i < addArr.length; i++) {
                param = addArr[i];
                name = param[0];
                value = param[1];
                value && arr.push([name, value]);
            }
        }
    }

    function tryToGetAttribute(tag, name) {
        return tag && tag.getAttribute ? tag.getAttribute(name) || "" : ""
    }

    function getMetaTags() {
        return _head_node = _head_node || doc.getElementsByTagName("head")[0], _meta_nodes || (_head_node ? _meta_nodes = _head_node.getElementsByTagName("meta") : []);
    }

    function getMetaSPMData(n) {
        var tag,
            tagName,
            tags = getMetaTags();

        if (tags) {
            for (var i = 0; i < tags.length; i++) {
                if (tag = tags[i], tagName = tryToGetAttribute(tag, "name"), tagName == n) {
                    spm_a = tryToGetAttribute(tag, "content");
                    return;
                }
            }
        }
    }

    function init_getGlobalSPMId() {

        getMetaSPMData(s_SPM_ATTR_NAME);

        var body = doc.getElementsByTagName("body"),
            __spm_b = body && body.length ? tryToGetAttribute(body[0], s_SPM_ATTR_NAME) : null;
        if (__spm_b != "{{spmb}}") {
            spm_b = __spm_b;
            spm_ab = spm_a + "." + spm_b;
            return spm_ab;
        }

        return null;
    }

    var win = window,
        doc = document,
        _k = "g_goldlog_loaded";

    if (!win[_k]) {
        win[_k] = true;

        var version = "0.0.1",
            loc = location,
            is_https = "https:" == loc.protocol,
            is_in_iframe = parent !== self,
            pathname = loc.pathname,
            hostsname = loc.hostname,
            use_protocol = is_https ? "https://" : "http://",
            goldlog_beacon_base = use_protocol + "/m.007fenqi.com/spmdot.do",
            page_url = loc.href,
            loc_hash = loc.hash,
            ua = navigator.userAgent,
            isIOS = /iPhone|iPad|iPod/i.test(ua),
            isAndroid = /Android/i.test(ua),
            osVersion = ua.match(/(?:OS|Android)[\/\s](\d+[._]\d+(?:[._]\d+)?)/i),

            _head_node,
            _meta_nodes,

            atta = !!doc.attachEvent,
            s_attachEvent = "attachEvent",
            s_addEventListener = "addEventListener",
            onevent = atta ? s_attachEvent : s_addEventListener,

            s_goldlog = "goldlog",
            s_plain_obj = "::-plain-::",
            s_SPM_ATTR_NAME = "data-spm",

            spm_a = win._SPM_a,
            spm_b = win._SPM_b,
            spm_ab,
            goldlog;

        // 参数说明：
        // type: 枚举 page, event, error
        // title: 页面标题
        // size: 页面尺寸
        // url: 页面url
        // log-type: 1-不在iframe中，0-在iframe中
        // version: 打点程序版本号
        // appName: app名称
        // appChannel: app渠道
        //
        // spm: 页面标识, eg:[站点 id].[页面 id]
        // spm-url: url中页面标识
        // nick: 部分cookie信息, [llq_uid;llq_tid;llq_fg]
        // ios: 是否ios，0/1
        // android: 是否android，0/1
        // os-ver: 操作系统版本
        //
        // dt: DEVICE_TOKEN
        // udi: UNIQUE_DEVICE_ID
        // [del]tt: TONGDUN_TOKEN
        // c-ver: 内容版本号
        // a-ver: APP版本号
        // na-ver: 当前最新APP版本号
        goldlog = {
            send: function (url, param) {
                var srcDelegate,
                    img = new Image,
                    name = "_img_" + Math.random(),
                    conn = -1 == url.indexOf("?") ? "?" : "&",
                    paramStr = param ? isArray(param) ? arr2param(param) : obj2param(param) : "";
                return win[name] = img, img.onload = img.onerror = function () {
                    win[name] = null;
                }, img.src = srcDelegate = paramStr ? url + conn + paramStr : url, img = null, srcDelegate;
            },
            sendPV: function (param) {
                var _param,
                    spmFromUrl = getSPMFromUrl(page_url),
                    spmFromCookie = getCookie("llq_uid")+";"+getCookie("llq_tid")+";"+getCookie("llq_fg"); //llq_uid, llq_tid, llq_fg

                loc_hash = loc.hash;
                loc_hash && 0 == loc_hash.indexOf("#") && (loc_hash = loc_hash.substr(1));

                spm_ab = init_getGlobalSPMId();

                _param = [
                    [
                        mkPlainKey(),
                        "title=" + doc.title
                    ],
                    [
                        "size",
                        screen.width + "x" + screen.height
                    ],
                    [
                        "url",
                        page_url
                    ],
                    [
                        "log-type",
                        is_in_iframe ? 0 : 1
                    ],
                    [
                        "type",
                        "page"
                    ],
                    [
                        "version",
                        version
                    ]
                ];

                ifAdd(_param, param);

                ifAdd(_param, [
                    [
                        "spm",
                        spm_ab
                    ],
                    [
                        "spm-url",
                        spmFromUrl
                    ],
                    [
                        mkPlainKey(),
                        "nick=" + spmFromCookie
                    ],
                    [
                        "ios",
                        isIOS ? 1 : 0
                    ],
                    [
                        "android",
                        isAndroid ? 1 : 0
                    ],
                    [
                        "os-ver",
                        osVersion
                    ]
                ]);

                goldlog.send(goldlog_beacon_base, _param);

            }
        };

        win[s_goldlog] = goldlog;

        init_getGlobalSPMId();
    }

}());