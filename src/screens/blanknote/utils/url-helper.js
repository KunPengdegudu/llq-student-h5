/**
 * urlhelper for blanknote
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/blanknote/module'], function (module) {
    'use strict';

    module
        .factory('blankNoteUrlHelper', function () {
            var devUrl = '',
                productUrl = "/w",
                prefixUrl = '/m/s',
                homeUrl = 'https://m.007fenqi.com/app/family/homepage/index.html#';

            var urlMap = {

                'checkUserGraduate': prefixUrl + '/user/checkUserGraduate.json',     //判断用户是否已经毕业
                'getCertProductList': prefixUrl + '/user/getCertProductList.json',      //获得认证列表

                'getUserContactsStatus': prefixUrl + '/user/getUserContactsStatus.json',      //查询用户通讯录是否失效

                'checkFetchRequireU': prefixUrl + '/credit/fetch/check_fetch_require_u.json',     //判断用户认证状态

                'checkProductCert': prefixUrl + '/user/checkProductCert.json',       //盘点用户认证状态(新)

                // 订单
                'cancelOrder': productUrl + "/order/close_order.json", // order_id

                'createCashOrderContract': prefixUrl + '/cash/create_order_contract.json',
                'getUserInfo': prefixUrl + '/user/get_user_info.json',    //用户信息
                'bindFundAccount': productUrl + '/acc/bind_fund_account.json',
                'getCashRepayment': prefixUrl + '/cash/get_repayment_schedule_list.json',
                'getCashRepayments': '/w/cash/get_repayment_schedules.json',

                'queryUserInfor': '/credit/active/query_user_infor.json',

                'saveUserContactsInfos': prefixUrl + '/user/saveUserContactsInfos.json', //保存用户通讯录信息

                // 支付宝
                'getAlipayAccounts': prefixUrl + '/cash/getAlipayAccounts.json',

                // 居间协议
                'jujianContract': prefixUrl + '/fdd/contract/jujian_contract.json ',

                // 圆梦贷款
                'backBlanknote': homeUrl + '/blanknote/main',


                'queryBanners': productUrl + '/queryBanners.json',   //白条banner 007_phone_blanknote
                'isAutoRepay': '/m/s/withholding/isAutoRepay.json',

                // 获取额度提升礼券数量
                'countFetchList': prefixUrl + '/credit/fetch/count_fetch_list.json',    //获取额度数量
                'checkFetchRequire': prefixUrl + '/credit/fetch/check_fetch_require.json',   //判断信息完整度
                'getFetchList': prefixUrl + '/credit/fetch/get_fetch_list.json',        //获取额度提升券列表
                'fetchCredit': prefixUrl + '/credit/fetch/fetch_credit.json',    //领取信用额度

                'getGradUserCreditStatus': '/m/m/grad/getGradUserCreditStatus.json',  //获取毕业贷认证状态

                //转化灰名单用户
                'getCashLoanType': '/w/cash/cut/getCashLoanType.json',      //判断用户状态     product_cash灰名单 normal_cash 正常用户
                'getCashProduct': '/w/cash/get_cash_product.json',     //获取砍头息商品


                'getCashApplyAmountList': productUrl + '/cash/getCashApplyAmountList.json',   //获得金额列表
                'getCashLoanRuleByAmount': productUrl + '/cash/getCashLoanRuleByAmount.json',  //获得还款期限列表
                // 运营商密码
                'getPhoneOperationPwd': prefixUrl + '/cash/getPhoneOperationPwd.json',
                'updateCreditInfoSep': '/m/m/credit/update_credit_info_sep.json',
                'getAllServiceCoupons': '/mc/get_all_service_coupons.json'

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
