
define(['screens/free/module'], function (module) {
    'use strict';

    module
        .factory('freeUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w';

            var urlMap = {
                'listPagedProductInfoByQuery': productUrl + '/product/listPagedProductInfoByQuery.json',
                'findProductDesc': productUrl + '/product/findProductDesc.json',
                'findProductSkuDTOForDetailByPromotion': productUrl + '/product/findProductSkuDTOForDetailByPromotion.json',
                'findProductWithSkuDTOWithPromotionInfoByPromotionId': productUrl + '/product/findProductWithSkuDTOWithPromotionInfoByPromotionId.json',
                'getPaymentInfoByQuery': productUrl + '/product/getPaymentInfoByQuery.json',
                'listPagedProductInfoFromSearch':'/w/product/listPagedProductInfoFromSearch.json',
                'listAllGategory': productUrl + '/product/listAllGategory.json',
                'searchBrandListByCategory': productUrl + '/product/searchBrandListByCategory.json'
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