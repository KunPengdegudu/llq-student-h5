/**
 * urlhelper for sale
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/tongtongli/module'], function (module) {
    'use strict';

    module
        .factory('tongtongliUrlHelper', function () {
            var devUrl = '';

            var urlMap = {
                'download': 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tongtongli.tongtonglihd'
            };


            return {
                getUrl: function (key) {
                    if (key) {
                        return devUrl + urlMap[key];
                    }
                    return null;
                }
            };
        });

});