/**
 * urlhelper for sale
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/mobileTribe/module'], function (module) {
    'use strict';

    module
        .factory('mobileTribeUrlHelper', function () {
            var devUrl = '';

            var urlMap = {

                'addCount':'/statistics/add_count.json',        //打点计数
                'iosDownload': 'https://itunes.apple.com/cn/app/shou-ji-bu-luo-hui-shou-er/id1121520306?mt=8',   //ios下载地址
                'andriodDownload': 'http://mobile.baidu.com/item?docid=9553454'    //安卓下载地址
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