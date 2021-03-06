/**
 * urlhelper for enter
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/activity/module'], function (module) {
    'use strict';

    module
        .factory('activityUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w';

            var urlMap = {
                'listSysNotices': '/m/s/user/listSysNotices.json',
                'listPagedProductInfoByQuery': productUrl + '/product/listPagedProductInfoByQuery.json',  //查询活动商品

                'listPagedProductInfoFromSearch': '/m/s/product/listProductInfoFromSearch.json',
                'doQueryWidgets': '/select/product/doQueryWidgets.json',
                'doQueryWidetNodetree': '/select/product/doQueryWidetNodetree.json',
                'doQueryData': '/select/product/doQueryData.json',
                'availableList': '/mc/coupon/get_all_available_list.json',
                'couponReceive': '/mc/coupon/receive.json',

                'getActivityInfo': productUrl + '/activity/get_activity_info.json', //获取活动ID
                'getSpreeSpreadUrl': productUrl + '/spread/get_spree_spread_url.json',  //获取分享链接
                'findProductsByPromotion': productUrl + '/product/findProductsByPromotion.json',        //  获取提额信息
                'countProOrderByPromotion': '/w/order/promotion/countProOrderByPromotion.json',       //获取购买人数
                'findProOrderByPromotion': '/w/order/promotion/findProOrdersByPromotion.json',        //获取提额活动购买列表
                'checkProductCert': '/m/s/user/checkProductCert.json'       //盘点用户认证状态(新)

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