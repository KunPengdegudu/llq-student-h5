/**
 * urlhelper for stage
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/stage/module'], function (module) {
    'use strict';

    module
        .factory('stageUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w';

            var urlMap = {
                'listPagedProductInfoByQuery': productUrl + '/product/listPagedProductInfoByQuery.json',
                'listPagedProductInfoFromSearch': '/m/s/product/listProductInfoFromSearch.json',
                'findProductDesc': productUrl + '/product/findProductDesc.json',
                'findProductSkuDTOForDetailByPromotion': productUrl + '/product/findProductSkuDTOForDetailByPromotion.json',
                'findProductWithSkuDTOWithPromotionInfoByPromotionId': productUrl + '/product/findProductWithSkuDTOWithPromotionInfoByPromotionId.json',
                'getPaymentInfoByQuery': productUrl + '/product/getPaymentInfoByQuery.json',
                'newListAllGategory': '/m/s/product/listAllGrantCategoryForIndexPage.json',
                'listAllGategory': productUrl + '/product/listAllGrantCategory.json',
                'newSearchBrandListByCategory': '/m/s/product/listSubCategoriesAndBrandsForIndexPage.json',
                'searchBrandListByCategory': productUrl + '/product/searchBrandListByCategory.json',
                'cartAdd': '/cart/add_product.json'    //添加商品到购物车接口
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