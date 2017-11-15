/**
 * urlhelper for enter
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/product/module'], function (module) {
    'use strict';

    module
        .factory('productUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w',
                prefixUrl = '/m/s/charge',
                orderUrl = '/m/s';

            var urlMap = {


                //游戏接口
                'queryGameServer': prefixUrl + '/queryGameServer.json',         //获取游戏服务器
                'listOnlineProByCategoryId': prefixUrl + '/listOnlineProByCategoryId.json',         //获取类目下的游戏商品
                'findPro': prefixUrl + '/findPro.json',                  //查找具体商品
                'createGameOrder': prefixUrl + '/create_game_order.json',          //游戏下单

                'listPagedHotProductInfo': 'listPagedHotProductInfo.json',
                'listPagedProductInfoByQuery': productUrl + '/product/listPagedProductInfoByQuery.json',
                'listPagedProductInfoFromSearch': productUrl + '/product/listPagedProductInfoFromSearch.json',
                'findProductDesc': productUrl + '/product/findProductDesc.json',
                'findProductSkuDTOForDetailByPromotion': productUrl + '/product/findProductSkuDTOForDetailByPromotion.json',
                'findProductWithSkuDTOWithPromotionInfoByPromotionId': productUrl + '/product/findProductWithSkuDTOWithPromotionInfoByPromotionId.json',
                'getPaymentInfoByQuery': productUrl + '/product/getPaymentInfoByQuery.json',
                'getUserArayacak': productUrl + "/delivery/get_user_arayacak.json",
                'createOrder': orderUrl + "/order/create_order.json",
                //'createOrderContract': orderUrl + "/order/create_order_contract.json",
                'createOrderContractUp': '/m/s/order/create_order_contract_up.json',
                'createMulitOrder': '/w/order/create_mulit_order.json',
                'getSearchKeywordRecoms': '/w/product/getSearchKeywordRecoms.json',

                'doQueryRecommandDataByUser': '/recommend/doQueryRecommandDataByUser.json',      //猜你喜歡商品列表

                'searchShopIsEvent': '/mc/activity/get_product.json',  //查询商品是否有活动

                'getAllProvinceList': "/register/getAllProvinceList.json",
                'getCityListByProvince': "/register/getCityListByProvince.json", // provinceCode
                'getSchoolList': "/register/getSchoolList.json", // provinceCode, cityCode
                'getEduSysList': "/register/getEduSysList.json",

                //库存
                'getStockInfo': '/m/s/product/get_stock_info.json',


                //灰名单用户
                'getUserProductCash': '/w/cash/get_user_product_cash.json',    //支付


                //验证收货人是否已进行海外购实名认证
                'realNameAuthValidate': '/user/real_name_auth/validate.json',


                // 地址
                'showDeliveryList': orderUrl + '/delivery/show_delivery_list.json',
                'getDelivery': orderUrl + "/delivery/get_delivery.json",
                'addDelivery': orderUrl + "/delivery/add_delivery.json",
                'modifyDelivery': orderUrl + "/delivery/modify_delivery.json",
                'delDelivery': orderUrl + "/delivery/del_delivery.json",

                'buyNowSettle': '/trade/order/buy_now_settle.json',


                'checkProductCert': prefixUrl + '/user/checkProductCert.json',       //盘点用户认证状态(新)

                // 订单
                'getOrder': productUrl + "/order/get_order.json",
                'confirmOrderDelivery': productUrl + "/order/confirm_delivery.json", // order_id
                'cancelOrder': productUrl + "/order/close_order.json", // order_id
                'confirmOrder': productUrl + "/order/confirm_order.json", // order_id
                'showLogistics': productUrl + "/order/get_order_logistics.json", // order_id
                'logisticsTrace':'/trade/logistics/trace.json',         //orderId   物流信息

                //商家优惠券
                'couponListAndPromotion': '/mc/get_coupon_list_and_promotion.json',        //获取可领取优惠券信息   shopId
                'shopCouponReceive': '/mc/shop_coupon/receive.json',      //领取商家优惠券   couponId

                // 物流
                'trace': '/trade/logistics/trace.json',

                // cart
                'cart': '/cart.json',
                'cartAdd': '/cart/add_product.json',    //添加商品到购物车接口
                'cartDelete': '/cart/delete_product.json',      //删除购物车商品
                'cartDeleteMore': '/cart/delete_products.json',     //删除多个商品
                'cartDeleteInvalid': '/cart/delete_invalid_products.json',      //删除失效的商品
                'cartUpdateCount': '/cart/update_product_quantity.json',        //修改购物车商品数量
                'cartConfirm': '/trade/order/cart_confirm.json',
                'calCards': '/w/order/aging/cal_cards.json',
                'cartSettle': '/trade/order/cart_settle.json',

                'getActivityAndCouponsForOrder': '/mc/get_activity_and_coupons_for_order.json',
                'isAutoRepay':'/m/s/withholding/isAutoRepay.json',
                // 支付
                'alipayOrder': orderUrl + "/pay/alipay_order.json",
                'alipayRepay': orderUrl + "/pay/alipay_repay.json",
                'weixinOrder': orderUrl + "/pay/webchatpay_order.json",
                'weixinRepay': orderUrl + "/pay/webchatpay_repay.json",

                // 身份证
                'queryUserInfor': "/credit/active/query_user_infor.json",
                'getUserInfo': productUrl + "/user/get_user_info.json",
                'updateUserInfo': productUrl + "/user/update_user_id_no.json",// id_no

                'repaySign': '/w/yxt/sign.json',
                'repayCancelSign': '/w/yxt/cancel_sign.json',
                'getBillDetail': "/bill/get_detail.json",
                'pickEntityCard': '/m/s/order/pick_entity_card.json',
                //分享
                'getThemeResource': '/share/order/get_theme_resource.json',
                'getRepayThemeResource': '/share/repay/get_theme_resource.json',
                'getAvailableOne': '/share/theme/get_available_one.json',
                //评价
                'getEvaluateCount': '/product/get_evaluate_count.json',
                'getEvaluateList': '/product/get_evaluate_list.json',

                //公告详细
                'listSysNotices': '/m/s/user/listSysNotices.json'

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