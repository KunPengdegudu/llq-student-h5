/**
 * urlhelper for shopActivity
 * @create: 201d/08/28
 * @author: D.xw
 */

define(['screens/shopActivity/module'], function (module) {
    'use strict';

    module
        .factory('shopActivityUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w';

            var urlMap = {
                'getProducts':'/mc/group_buy/get_products.json',    //团购商品列表
                'searchShopIsEvent':'/mc/activity/get_product.json',  //查询商品是否有活动
                'findProductDesc': productUrl + '/product/findProductDesc.json',
                'findProductSkuDTOForDetailByPromotion': productUrl + '/product/findProductSkuDTOForDetailByPromotion.json',
                'cartAdd': '/cart/add_product.json' //添加商品到购物车接口
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