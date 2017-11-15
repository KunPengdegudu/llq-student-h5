/**
 * urlhelper for login
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/weixin/module'], function (module) {
    'use strict';

    module
        .factory('weixinUrlHelper', function () {
            var prefixUrl = '',
                productUrl = '/w',
                userPrefixUrl = '/m/s';


            var urlMap = {
                'login': '/dologin.json',
                'logout': '/login_out.json',

                'getAllProvinceList': "/register/getAllProvinceList.json",
                'getCityListByProvince': "/register/getCityListByProvince.json", // provinceCode
                'getSchoolList': "/register/getSchoolList.json", // provinceCode, cityCode
                'getEduSysList': "/register/getEduSysList.json",

                'queryUserInfor': "/credit/active/query_user_infor.json",
                'creditActiveUp': "/credit/active/m/credit_active_up.json",
                'creditActiveM': "/credit/active/m/credit_active_m.json",

                //aging
                'queryCreditActive': '/m/s/market_activity/query_credit_active.json',        //查询活动
                'applyActivityDo': '/m/s/market_activity/apply_activity_do.json',        //活动提交

                //毕业证项目
                'uploadPhoto': '/weChat/admissionTicket/upload.json',      //微信上传图片
                'admissionTicket': '/weChat/admissionTicket/base64.json',           //转化图片地址为base64

                'getImgCode': userPrefixUrl + "/register/m_getimgcode.json?t=",  //    获取图片验证码
                'sandImgCode': userPrefixUrl + "/register/m_sendAuthCode.json",// 发送进行验证
                'validateImgCode': userPrefixUrl + "/register/m_validateImg.json", //验证图片验证码是否有效

                'sendAuthCode': userPrefixUrl + '/register/m_sendAuthCode.json', //发送验证码
                'checkUserRegister': userPrefixUrl + '/register/m_check_user_register.json', //判断用户是否注册
                'validateAuthCode': userPrefixUrl + '/register/validateAuthCode.json', //验证验证码是否有效
                'saveRegister': userPrefixUrl + '/register/m_saveRegister.json', //保存注册
                'listPagedProductInfoByQuery': productUrl + '/product/listPagedProductInfoByQuery.json',
                'downloadApp': 'https://down-cdn.007fenqi.com/app/family/homepage/index.html',
                'getActivityInfo': productUrl + '/activity/get_activity_info.json', //获取活动ID
                'getSpreeSpreadUrl': productUrl + '/spread/get_spree_spread_url.json',  //获取分享链接

                //blanknote
                'getCashRepayments': '/w/cash/get_repayment_schedules.json',
                'queryBanners': productUrl + '/queryBanners.json?type=007_phone_blanknote',   //白条banner
                'getCashApplyAmountList': productUrl + '/cash/getCashApplyAmountList.json',   //获得金额列表
                'getCashLoanRuleByAmount': productUrl + '/cash/getCashLoanRuleByAmount.json'  //获得还款期限列表


            };

            return {
                getUrl: function (key) {
                    if (key) {
                        return prefixUrl + urlMap[key];
                    }
                    return null;
                }
            };
        });

});