/**
 * urlhelper for newExclusive
 * @create: 2016/09/11
 * @author: dxw
 */

define(['screens/newExclusive/module'], function (module) {
    'use strict';

    module
        .factory('newExclusiveUrlHelper', function () {
            var devUrl = '',
                productUrl = "/w";

            var urlMap = {
                'checkFetchRequireU':'/m/s/credit/fetch/check_fetch_require_u.json',      //查询用户认证状态
                'listPagedFreshManProductInfo': productUrl + '/freshman/listPagedFreshManProductInfo.json',     //商品列表
                'queryForBuy': productUrl + '/freshman/queryForBuy.json'        //购买资格判断
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