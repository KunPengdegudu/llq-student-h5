/**
 * urlhelper for seckill
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/seckill/module'], function (module) {
    'use strict';

    module
        .factory('seckillUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w';

            var urlMap = {
                'listPagedProductInfoByQuery': productUrl + '/product/listPagedProductInfoByQuery.json',
                'listPagedProductInfoFromSearch': productUrl + '/product/listPagedProductInfoFromSearch.json',
                'findProductDesc': productUrl + '/product/findProductDesc.json',
                'findProductSkuDTOForDetailByPromotion': productUrl + '/product/findProductSkuDTOForDetailByPromotion.json',
                'findProductWithSkuDTOWithPromotionInfoByPromotionId': productUrl + '/product/findProductWithSkuDTOWithPromotionInfoByPromotionId.json',
                'getPaymentInfoByQuery': productUrl + '/product/getPaymentInfoByQuery.json'
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