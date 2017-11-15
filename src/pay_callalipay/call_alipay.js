(function (owner, doc) {
    owner.getAllParams = function (url) {
        var reg = /[(\?|\&)]([^=]+)\=([^&#]+)/g,
            matches, output = {};
        while (matches = reg.exec(url)) {
            var key = decodeURIComponent(matches[1]),
                value = decodeURIComponent(matches[2]);
            output[key] = value;
        }
        return output;
    };
    owner.userAgent = function () {
        var output = {};
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            output['ios'] = true;
        } else if (navigator.userAgent.match(/android/i)) {
            output['android'] = true;
        }
        return output;
    };
    owner.ajax = function (method, uri, options, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                return callback(xmlhttp.responseText);
            }
        }
        xmlhttp.open(method, uri, true);
        xmlhttp.send(options);
    };
    owner.callAlipay = function (gourl) {
        if (gourl) {
            var urlscheme = 'alipays';
            var ug = this.userAgent();
            if (ug.ios) {
                urlscheme = 'alipay';
            }
            var p = 'platformapi';
            var sm = '11';
            var s = '100000' + sm;
            var gopage = urlscheme + '://' + p + '/startApp?appId=' + s + '&url=' + encodeURIComponent(gourl);
            window.location.href = gopage;
        }
    };
}(window.callappjs = {}, document));