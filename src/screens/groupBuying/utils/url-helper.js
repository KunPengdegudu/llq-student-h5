/**
 * urlhelper for groupBuying
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/groupBuying/module'], function (module) {
    'use strict';

    module
        .factory('groupBuyingUrlHelper', function () {
            var devUrl = '',
                productUrl = '/w',
                prefixUrl = '/m/s',
                msgUrl = '/m/p';

            var urlMap = {

                'main': prefixUrl + '/user/get_user_info.json',
                'res': prefixUrl + '/user/get_user_info.json',
                'queryUserInfor': "/credit/active/query_user_infor.json",

                'getOrderList': '/w/order/get_orders.json',

                'listSysNotice': '/m/s/user/listSysNotice.json',
                'listSysNotices': '/m/s/user/listSysNotices.json',

                //红包
                'getUsableList': '/user/red_envelope/get_usable_list.json',       //可用的红包
                'getUsedList': '/user/red_envelope/get_used_list.json',        //已使用红包
                'getExpiredList': '/user/red_envelope/get_expired_list.json',      //已失效的红包

                //我的店铺优惠券
                'shopCouponUsableList': '/user/shop_coupon/get_usable_list.json',      //我的可使用
                'shopCouponUsedList': '/user/shop_coupon/get_used_list.json',    //我的已使用
                'shopCouponExpiredList': '/user/shop_coupon/get_expired_list.json',     //我的已过期


                // 订单
                'getOrder': productUrl + "/order/get_order.json",
                'confirmOrderDelivery': productUrl + "/order/confirm_delivery.json", // order_id
                'cancelOrder': productUrl + "/order/close_order.json", // order_id
                'confirmOrder': productUrl + "/order/confirm_order.json", // order_id
                'showLogistics': productUrl + "/order/get_order_logistics.json", // order_id

                //账单
                'getAgingOrderList': productUrl + "/order/get_aging_order_list.json",
                'getAgingOrderSchedule': productUrl + "/order/get_aging_order_scheudule.json",
                'getBillDetail': "/bill/get_detail.json",

                'getCurrentBills': '/bill/get_current_bills.json',
                'getFinishedBills': '/bill/get_finished_bills.json',

                // 地址
                'showDeliveryList': prefixUrl + '/delivery/show_delivery_list.json',
                'getDelivery': prefixUrl + "/delivery/get_delivery.json",
                'addDelivery': prefixUrl + "/delivery/add_delivery.json",
                'modifyDelivery': prefixUrl + "/delivery/modify_delivery.json",
                'delDelivery': prefixUrl + "/delivery/del_delivery.json",

                'getAllProvinceList': "/register/getAllProvinceList.json",
                'getCityListByProvince': "/register/getCityListByProvince.json", // provinceCode

                // 消息
                'msgCount': msgUrl + '/a/count_push_msg.json',
                'msgList': msgUrl + '/a/query_push_msg.json',
                'flagPushMsg': msgUrl + '/a/flag_push_msg.json', // ids=1&read_flag=read

                //钱包
                'getEwallet': prefixUrl + '/ewallet/get_ewallet.json',   //账户余额
                'withdraw': prefixUrl + '/ewallet/withdraw.json',   //提现

                // 支付宝
                'getAlipayAccounts': prefixUrl + '/cash/getAlipayAccounts.json',

                'repaySign': '/w/yxt/sign.json',
                'repayCancelSign': '/w/yxt/cancel_sign.json',

                'getCashProduct': '/w/cash/get_cash_product.json',

                // 支付
                'alipayOrder': prefixUrl + "/pay/alipay_order.json",
                'alipayRepay': prefixUrl + "/pay/alipay_repay.json",
                'weixinOrder': prefixUrl + "/pay/webchatpay_order.json",
                'weixinRepay': prefixUrl + "/pay/webchatpay_repay.json",

                //交易密码
                'isPayPasswordSet': prefixUrl + '/ewallet/is_pay_password_set.json',   //查询支付密码
                'setPayPassword': prefixUrl + '/ewallet/set_pay_password.json',     //设置支付密码
                'resetPayPassword': prefixUrl + '/ewallet/reset_pay_password.json',     //修改支付密码

                // 加入我们
                'getJoinUs': productUrl + "/user/get_join_us.json",
                'joinUs': productUrl + "/user/join_us.json",

                // 用户
                'changeUserPassword': prefixUrl + '/user/change_user_password.json',
                'bindFundAccount': productUrl + '/acc/bind_fund_account.json',

                // 红包
                'listPagedUserCouponByUserId': productUrl + '/coupon/listPagedUserCouponByUserId.json',
                'updateUserCouponStatus': productUrl + '/coupon/updateUserCouponStatus.json',

                'getUserInfo': prefixUrl + '/user/get_user_info.json',    //用户信息
                'saveUserContactsInfos': prefixUrl + '/user/saveUserContactsInfos.json', //保存用户通讯录信息


                'doSaveUserSuggestion': prefixUrl + "/user/doSaveUserSuggestion.json",  //意见反馈

                'logout': '/login_out.json',

                //考拉海外购
                'realNameAuthList': '/user/real_name_auth/list.json',        //海外购实名认证列表
                'realNameAuthRemove': '/user/real_name_auth/remove.json',    //海外购实名认证删除     id

                // 物流
                'trace': '/trade/logistics/trace.json',

                // 客服
                'callCenterInfo': '/k/send_userJsonObject.json',

                //额度提升
                'countFetchCount': prefixUrl + '/credit/fetch/count_fetch_list.json',  //获得提升额度数量
                'getFetchList': prefixUrl + '/credit/fetch/get_fetch_list.json',      //获得额度可提升列表
                'updateCreditInfoSep': '/m/m/credit/update_credit_info_sep.json',        //更新信息列表
                'checkFetchRequire': prefixUrl + '/credit/fetch/check_fetch_require.json',   //判断信息完整度
                'fetchCredit': prefixUrl + '/credit/fetch/fetch_credit.json',  //领取信用额度

                'incCreditActive': '/m/s/market_activity/inc_credit_active.json',
                'applyActivity': '/m/s/market_activity/apply_act.json',
                'queryApplyActivity': '/m/s/market_activity/query_apply_activity.json',
                //忘记密码
                'getVerifyFrgPwdType': prefixUrl + '/ewallet/get_verify_frg_pwd_type.json',//获得验证条件的方式
                'verifyFrgPwd': prefixUrl + '/ewallet/verify_frg_pwd.json',//验证条件，并发送验证码
                'confirmVerifyFrgPwd': prefixUrl + '/ewallet/confirm_verify_frg_pwd.json',//确认验证码，和新密码接口
                'checkFetchRequireU': prefixUrl + '/credit/fetch/check_fetch_require_u.json',
                'getRepaymentInfo': '/m/s/repayment/getRepaymentInfo.json',
                'pickEntityCard': '/m/s/order/pick_entity_card.json',
                //取消订单原因
                'cancelReason': '/m/m/order/cancel_reason.json',
                //取消白条原因
                'cancelBlanknoteReason': '/m/m/order/cancel_cash_order_reason.json',
                //提交订单评价
                'submitEvaluation': '/trade/order/evaluate.json',
                //上传图片
                'imgUpload': '/common/image/upload.json',
                //获取评价
                'getEvaluate': '/trade/order/get_evaluate.json',
                //追加评价
                'additionalEvaluate': '/trade/order/additional_evaluate.json',
                'getStat': '/user/order/get_stat.json',
                'getUserEvaluates': '/evaluate/my_list.json',
                //订单统计
                'orderCalculate': '/trade/order/get_stat.json',
                //分享
                'getThemeResource': '/share/order/get_theme_resource.json',
                'getRepayThemeResource': '/share/repay/get_theme_resource.json',
                'getAvailableOne': '/share/theme/get_available_one.json',
                //提醒发货
                'remindSellerSendGoods': '/trade/order/remind_seller_send_goods.json',
                //获得认证列表
                'getCertProductList': prefixUrl + '/user/getCertProductList.json',

                //拼团
                'doQueryData': '/select/product/doQueryData.json',
                'doQueryWidgets':'/select/product/doQueryWidgets.json',
                'doQueryWidetNodetree': '/select/product/doQueryWidetNodetree.json',
                'getTimestamp':'/common/get_timestamp.json',    //  获得服务器时间


                'getPtCategory':'/mc/query_ptcategory_names.json',    //获取分类列表
                'getPtProductList':'/mc/pt_product/get_pt_product_list.json',   //查询拼团商品列表

                'getNextPtProductList':'/mc/pt_product/get_next_pt_product_list.json',    //明日上新
                'getMyOrder':'/w/order/get_orders.json',     //我的拼团
                'getForeshowInfos':'/mc/pt_tuan/get_pt_tuan_carousel_list.json',   //轮播接口
                'getGroupDetail':'/mc/pt_tuan/group_detail.json',    //团详情(参团详情页)
                'getMorePtProductList':'/mc/pt_product/get_more_pt_product_list.json',   //更多拼团（参团详情页）

                'getPtPproductDetail':'/mc/pt_product/get_pt_product_detail.json',   //商品详情
                'getPtTuanList':'/mc/pt_tuan/get_pt_tuan_list.json',     //当前商品开团列表（商品详情页、参团详情）
                'getEvaluateCount':'/product/get_evaluate_count.json',   //商品评价数量
                'getEvaluateList':'/product/get_evaluate_list.json',    //商品评价数据
                'findProductDesc': productUrl + '/product/findProductDesc.json',    //商品介绍、商品参数、包装售后
                'selectBanner': '/mc/banner/selectBanner.json',    //首页轮播banner



                //验证收货人是否已进行海外购实名认证
                'realNameAuthValidate': '/user/real_name_auth/validate.json',

                'tradePinTuan':'/trade/order/pintuan_settle.json',   //确认订单页(获取订单详情)
                'createPintuan':'/w/order/create_pintuan_order.json'   //确认订单页（开团/参团接口）

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