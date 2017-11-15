/**
 * urlhelper for rechargeMobile
 * @create: 2017/05/15
 * @author: dxw
 */

define(['screens/rechargeMobile/module'], function (module) {
    'use strict';

    module
        .factory('mobileUrlHelper', function () {
            var devUrl = '',
                productUrl = '/m/s',
                virtualUrl = '/virtual/charge';

            var urlMap = {
                'getUserInfo': productUrl + '/user/get_user_info.json',
                'queryPhoneAttr': virtualUrl + '/queryPhoneAttr.json',      //查询手机号信息
                'queryPhoneSkuInfo': virtualUrl + '/queryPhoneSkuInfo.json',         //查询话费充值列表
                'queryTrafficSkuInfo': virtualUrl + '/queryTrafficSkuInfo.json',        //查询流量充值列表

                'trafficChargeCheck': virtualUrl + '/trafficChargeCheck.json',           //流量
                'phoneChargeCheck': virtualUrl + '/phoneChargeCheck.json',           //话费
                'createOrder': productUrl + '/create_single_order.json'         //下单

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