/**
 * urlhelper for enter
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/shop/module'], function (module) {
    'use strict';

    module
        .factory('shopUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w',
                prefixUrl = '/m/s/charge',
                orderUrl = '/m/s';

            var urlMap = {
                'queryBanners': productUrl + '/queryBanners.json?type=007_phone',
                'listPagedProductInfoFromSearch': productUrl + '/product/listPagedProductInfoFromSearch.json',       //商铺商品列表
                'shopInfo':'/seller/shop/select_shop.json',
                'listProductInfoFromSearch': orderUrl + '/product/listProductInfoFromSearch.json'       //搜索结果

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