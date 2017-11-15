/**
 * urlhelper for enter
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/enter/module'], function (module) {
    'use strict';

    module
        .factory('enterUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w',
                prefixUrl = '/m/s',
                msgUrl = '/m/p';

            var urlMap = {
                'listPagedProductInfoByQuery': productUrl + '/product/listPagedProductInfoByQuery.json',
                'listPagedProductInfoFromSearch': productUrl + '/product/listPagedProductInfoFromSearch.json',         //原猜你喜欢
                'listPagedHotProductInfo': productUrl + '/product/listPagedHotProductInfo.json',
                'findProductDesc': productUrl + '/product/findProductDesc.json',
                'findProductSkuDTOForDetailByPromotion': productUrl + '/product/findProductSkuDTOForDetailByPromotion.json',
                'findProductWithSkuDTOWithPromotionInfoByPromotionId': productUrl + '/product/findProductWithSkuDTOWithPromotionInfoByPromotionId.json',
                'getPaymentInfoByQuery': productUrl + '/product/getPaymentInfoByQuery.json',

                'findPromtionInfoById': productUrl + '/product/findPromtionInfoById.json',

                'msgCount': msgUrl + '/a/count_push_msg.json',

                'listAllGategory': productUrl + '/product/listAllGategory.json',

                'queryBanners': productUrl + '/queryBanners.json?type=007_phone',
                'queryActivity': productUrl + '/queryBanners.json?type=007_phone_top',
                'queryAdMain': productUrl + '/queryBanners.json?type=007_phone_main',
                'queryMenuIcon': productUrl + '/queryBanners.json?type=007_phone_menu_icon',

                'doQueryWidgets': '/select/product/doQueryWidgets.json',      //今日必逛
                'doQueryWidetNodetree': '/select/product/doQueryWidetNodetree.json',          //查询二级目录

                //公告
                'querySysNotice': '/m/s/user/querySysNotice.json',
                'listSysNotice': '/m/s/user/listSysNotice.json',
                'listSysNotices': '/m/s/user/listSysNotices.json',


                'doQueryRecommandDataByUser': '/recommend/doQueryRecommandDataByUser.json',      //猜你喜歡商品列表

                'getSpreeSpreadUrl': productUrl + '/spread/get_spree_spread_url.json',  //获取分享链接
                'listSearchKeywordHistorys': '/w/product/listSearchKeywordHistorys.json',//历史搜索
                'clearSearchKeywordHistorys': '/w/product/clearSearchKeywordHistorys.json',//清空历史搜索

                'main': prefixUrl + '/user/get_user_info.json',    //

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