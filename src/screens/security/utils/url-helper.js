/**
 * urlhelper for security
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/security/module'], function (module) {
    'use strict';

    module
        .factory('securityUrlHelper', function () {
            var devUrl = '',
                prefixUrl = '/m/s',
                safetUrl = '/m/m/safe';

            var urlMap = {
                'changePassword': safetUrl + '/passward/check.json',                   //修改登录支付密码
                'getImgCode': prefixUrl + "/register/m_getimgcode.json?t=",         //获取图片验证码
                'validateImgCode': prefixUrl + "/register/m_validateImg.json",      //验证图片验证码是否有效
                'updatePhone': safetUrl + '/msgphone/update.json',                    //保存通讯手机
                'sendAuthCode': prefixUrl + '/register/m_sendAuthCode.json',        //发送手机验证码
                'sendEmailCode': '/sendemailcode.json',                             //发送邮箱验证码
                'updateEmail': safetUrl + '/useremail/update.json',                   //保存邮箱
                'getAllProvinceList': "/register/getAllProvinceList.json",
                'getCityListByProvince': "/register/getCityListByProvince.json",    // provinceCode
                'modifyDelivery': safetUrl + '/userattach/update.json',               // 修改地址
                'getAttach': safetUrl + '/userAttachs/get_attachs.json',                 // 获取不同地址
                'userEmailGet': safetUrl + '/useremail/get.json',
                'getMsgPhone': safetUrl + '/get_msgPhone.json',            //获取拨打手机号码

                'getGraduation':'/m/m/get_old_grad_end_time.json',        //获取当前用户的毕业时间
                'updateGraduation':'/m/m/update_grad_end_time.json',      //更新当前用户的毕业时间
                'isAutoRepay':'/m/s/withholding/isAutoRepay.json',         // 是否设置了代扣
                'listWithholdingInfoByUserId':'/m/s/withholding/listWithholdingInfoByUserId.json',   // 获取开启代扣和未开启代扣的银行卡
                'FailureRebindCard':'/m/s/pay/failure_rebind_card.json',        // 查询银行卡是否需要重新验证
                'setWithholding':'/m/s/withholding/setWithholding.json',
                'setAutoRepay':'/m/s/withholding/setAutoRepay.json',

                'weixinBindingAccount': '/weixin/binding_account.json',
                'getUserAttr':'/m/m/get_user_attr.json',     //获取用户以前的角色信息
                'updateUserAttr':'/m/m/update_user_attr.json'    //保存用户角色信息
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