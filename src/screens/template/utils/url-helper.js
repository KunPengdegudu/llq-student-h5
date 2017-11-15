/**
 * urlhelper for sale
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/template/module'], function (module) {
    'use strict';

    module
        .factory('templateUrlHelper', function () {
            var devUrl = '';

            var urlMap = {

                'doQueryWidetNodetree': '/select/product/doQueryWidetNodetree.json',          //查询二级目录
                'doQueryData': '/select/product/doQueryData.json'           //具体商品
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