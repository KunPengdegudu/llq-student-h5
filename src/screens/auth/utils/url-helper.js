/**
 * urlhelper for enter
 * @create: 2017/03/06
 * @author: dxw
 */

define(['screens/auth/module'], function (module) {
    'use strict';

    module
        .factory('authUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w',
                userPrefixUrl = '/m/s',
                userCreditPrefixUrl = '/m/m';

            var urlMap = {
                'getUserLevel': userCreditPrefixUrl + '/vip/get_user_level.json',  //获取用户信用等级
                'getCertProductList': userPrefixUrl + '/user/getCertProductList.json', //获得认证列表
                'getUserInfo': userPrefixUrl + '/user/get_user_info.json',    //用户信息
                //贷款超市
                'getPlatformCate': '/dkcs/page/get_platform_cate.json',      //获取贷款平台种类
                'getPlatformList': '/dkcs/page/get_platforms_by_cateId.json',     //获取贷款平台列表
                'getRecommendLoan': '/dkcs/page/get_hot_platforms.json'   //获取推荐的贷款产品

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