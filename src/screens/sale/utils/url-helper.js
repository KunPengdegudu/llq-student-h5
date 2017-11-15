/**
 * urlhelper for sale
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/sale/module'], function (module) {
    'use strict';

    module
        .factory('saleUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w';

            var urlMap = {
                'listPagedProductInfoByQuery': productUrl + '/product/listPagedProductInfoByQuery.json',
                'listPagedProductInfoFromSearch': productUrl + '/product/listPagedProductInfoFromSearch.json',
                'findProductDesc': productUrl + '/product/findProductDesc.json',
                'findProductSkuDTOForDetailByPromotion': productUrl + '/product/findProductSkuDTOForDetailByPromotion.json',
                'findProductWithSkuDTOWithPromotionInfoByPromotionId': productUrl + '/product/findProductWithSkuDTOWithPromotionInfoByPromotionId.json',
                'getPaymentInfoByQuery': productUrl + '/product/getPaymentInfoByQuery.json',
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