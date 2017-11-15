try {
    (function (e) {
        function n() {
            for (var e = document.getElementsByTagName("meta"), n = [], t = 0; e.length > t; t++) {
                var o = e[t];
                o && o.name && ("data-spm" == o.name || "spm-id" == o.name) && n.push(o.content)
            }
            return document.body && document.body.getAttribute("data-spm") && n.push(document.body.getAttribute("data-spm")), n = n.length ? n.join(".") : 0, n && -1 == n.indexOf(".") && (n += ".0"), n
        }

        function t(e, n) {
            var t = {};
            for (var o in e)t[o] = e[o];
            for (var o in n)t[o] = n[o];
            return t
        }

        function o(e) {
            for (var n = ["a.tbcdn.cn", "s.tbcdn.cn", "g.tbcdn.cn/tbc", "g.tbcdn.cn", "tbcdn.cn", "www.taobao.com/go/rgn", "www.taobao.com", "taobao.com", "gtms01.alicdn.com", "gtms02.alicdn.com", "gtms03.alicdn.com", "gtms04.alicdn.com", "atp.alicdn.com/tmse", "at.alicdn.com", "log.mmstat.com/1.gif", "log.mmstat.com", "lac.mmstat.com", "gm.mmstat.com", "mmstat.com", "cdn.tanx.com", "ecpm.tanx.com", "p.tanx.com", "tanx.com", "i.mmcdn.cn", "img.taobaocdn.com", "img01.taobaocdn.com", "img02.taobaocdn.com", "img03.taobaocdn.com", "img04.taobaocdn.com", "allot.mpp.taobao.com/allot.do", "/tps/i1/TB", "/tps/i2/TB", "/tps/i3/TB", "/tps/i4/TB", "tbcdn.cn/s/aplus_v2.js", "XXXX", "/simba/img", "index.js", "index.css", "tb/global/", "/s/kissy/gallery/", "-min.js", "-min.css", ".png", ".jpg", ".gif", ".css", ".php", "kissy", ".com", ".cn"], t = [], o = 0; e.length > o; o++) {
                for (var r = e[o].name, c = 0; n.length > c; c++) {
                    var a = c.toString(36);
                    1 == a.length && (a = "0" + a);
                    var i = "~" + a, s = RegExp(n[c].replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g"), m = r.replace(s, i);
                    m != r && (r = m)
                }
                r = r.replace(/\-/g, "__").replace(/\?[^\?]*$/, "").replace(/^http[s]*:\/\//, "").replace(/\//g, ".."), t.push([r, (1 * e[o].fs).toString(36), (1 * e[o].re).toString(36)].join("-"))
            }
            return t = t.join("-")
        }

        function r() {
            try {
                if (e.performance && e.performance.getEntriesByType)for (var n = performance.getEntriesByType("resource"), t = 0, r = []; n.length > t;) {
                    r.push({
                        name: n[t].name,
                        fs: (100 * n[t].fetchStart).toFixed(0),
                        re: (100 * n[t].responseEnd).toFixed(0)
                    }), t++;
                    var c = o(r);
                    (c.length > 1700 || t >= n.length) && (e.JSTracker.send({
                        msg: c,
                        file: "",
                        line: 0,
                        delay: 0,
                        category: "__RS",
                        spm: e.JSTracker._configs.spm,
                        sampling: e.JSTracker._configs.sampling,
                        url: location.href,
                        ua: "",
                        scrolltop: 0,
                        screen: screen.width + "x" + screen.height,
                        nick: s
                    }), r = [])
                }
            } catch (a) {
                e.JSTracker.send({category: "error_resource_collect", url: "http://jstracker/0.1/"})
            }
        }

        if (!e.JSTracker) {
            var c = n(), a = function () {
                function n(n, t, o, r) {
                    var c, a = e.navigator.mimeTypes;
                    for (c in a)if (a[c][n] == t) {
                        if (void 0 !== o && r.test(a[c][o]))return !0;
                        if (void 0 === o)return !0
                    }
                    return !1
                }

                try {
                    var t = n("type", "application/vnd.chromium.remoting-viewer");
                    if (t)return "";
                    var o = "track"in e.document.createElement("track"), r = "scoped"in e.document.createElement("style"), c = "v8Locale"in e, a = e.navigator.appVersion;
                    return o && !r && !c && /Gecko\)\s+Chrome/.test(a) ? " QIHU 360 EE" : o && r && c ? " QIHU 360 SE" : ""
                } catch (i) {
                    return ""
                }
            }(), i = e.g_config && e.g_config.startTime || +new Date;
            e.JSTracker = {
                _configs: {
                    sampling: 100,
                    spm: c,
                    debug: -1 != location.href.indexOf("jt_debug"),
                    nick: "",
                    url: "",
                    ignore: []
                }
            }, ("detail.tmall.com" == location.host || "www.tmall.com" == location.host || "item.taobao.com" == location.host || "item.taobao.com" == location.host) && (e.JSTracker._configs.sampling = 20);
            var s = function () {
                var n;
                if ("" !== e.JSTracker._configs.nick)return e.JSTracker._configs.nick;
                try {
                    return TB.Global.util.getNick()
                } catch (t) {
                }
                try {
                    if (n = /_nk_=([^;]+)/.exec(document.cookie) || /_w_tb_nick=([^;]+)/.exec(document.cookie) || /lgc=([^;]+)/.exec(document.cookie))return decodeURIComponent(n[1])
                } catch (t) {
                    return ""
                } finally {
                    return ""
                }
            }();
            e.JSTracker.config = function (n, t) {
                return n || t ? t ? (e.JSTracker._configs[n] = t, void 0) : e.JSTracker._configs[n] : e.JSTracker._configs
            };
            var m = function (n) {
                var t = "jsFeImage_" + +new Date, o = e[t] = new Image;
                o.onload = o.onerror = function () {
                    e[t] = null
                }, o.src = n, o = null
            }, l = function () {
                return "https:" == location.protocol ? "https://log.mmstat.com/jstracker.2?" : "http://gm.mmstat.com/jstracker.2?"
            }();
            e.JSTracker.send = function (n) {
                var o = {
                    msg: "",
                    file: "",
                    line: 0,
                    delay: +new Date - i,
                    category: "",
                    spm: e.JSTracker._configs.spm,
                    sampling: e.JSTracker._configs.sampling,
                    url: location.href,
                    ua: navigator.userAgent + a,
                    scrolltop: document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0,
                    screen: screen.width + "x" + screen.height,
                    nick: s
                };
                e.JSTracker._configs.url && (o.url = e.JSTracker._configs.url);
                var r = t(o, n), c = [];
                r.url != location.href && c.push("[u" + r.url + "]"), r.delay > 0 && c.push("[t" + r.delay + "]"), r.category && c.push("[c" + r.category + "]"), r.spm && c.push("[s" + r.spm + "]"), r.sampling && c.push("[r" + r.sampling + "]"), r.msg && c.push(r.msg), c = c.join("");
                var g = 1 >= Math.random() * r.sampling;
                try {
                    for (var d = 0; e.JSTracker._configs.ignore.length > d; d++) {
                        var u = e.JSTracker._configs.ignore[d];
                        u.test(n.msg) && (g = !1)
                    }
                } catch (p) {
                    e.JSTracker.send({category: "error_ignore", url: "http://jstracker/0.1/"})
                }
                (g || e.JSTracker._configs.debug) && m(l + ["type=9", "id=jstracker", "v=1.0.15", "nick=" + r.nick, "msg=" + encodeURIComponent(c), "file=" + encodeURIComponent(r.file), "ua=" + encodeURIComponent(r.ua), "line=" + r.line, "scrolltop=" + r.scrolltop, "screen=" + screen.width + "x" + screen.height, "t=" + (new Date).valueOf()].join("&")), e.JSTracker._configs.debug && console && console.log(r)
            };
            var g = ["log", "info", "debug", "warn", "error"];
            for (var d in g) {
                var u = g[d];
                e.JSTracker[u] = function (n) {
                    return function () {
                        var t = Array.prototype.slice.call(arguments, 0), o = t.join("");
                        e.JSTracker.send({category: n.toUpperCase(), msg: o})
                    }
                }(u)
            }
            var p = e.onerror;
            e.onerror = function (n, t, o) {
                p && p(n, t, o), e.JSTracker.send({msg: n, file: t, line: o})
            };
            var f = function () {
                var n = {}, t = "";
                if (e.performance) {
                    var o = e.performance.timing;
                    n.dns = o.domainLookupEnd - o.domainLookupStart, n.con = o.connectEnd - o.connectStart, n.req = o.responseStart - o.requestStart, n.res = o.responseEnd - o.responseStart, n.dcl = o.domContentLoadedEventEnd - o.domLoading, n.onload = o.loadEventStart - o.domLoading, n.type = window.performance.navigation.type;
                    try {
                        t = JSON.stringify(n)
                    } catch (c) {
                    }
                }
                e.JSTracker.send({msg: t, category: "__PV"}), setTimeout(r, 5e3)
            };
            window.addEventListener ? (document.addEventListener("DOMContentLoaded", function () {
                c = n(), e.JSTracker._configs.spm = c
            }, !1), window.addEventListener("load", f, !1)) : (document.attachEvent("onreadystatechange", function () {
                "complete" === document.readyState && document.detachEvent("onreadystatechange", arguments.callee), c = n(), e.JSTracker._configs.spm = c
            }), window.attachEvent("onload", f))
        }
    })(window)
} catch (e) {
}