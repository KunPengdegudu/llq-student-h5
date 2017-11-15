/**
 * urlhelper for login
 * @create: 2015/07/19
 * @author: panwei.pw
 */

define(['screens/login/module'], function (module) {
    'use strict';

    module
        .factory('loginUrlHelper', function () {
            var prefixUrl = '',
                userPrefixUrl = '/m/s',
                userCreditPrefixUrl = '/m/m';


            var urlMap = {
                'login': '/dologin.json',
                'logout': '/login_out.json',


                'getloginacount': '/getloginacount.json',       //获取登陆失败次数
                'getimgcode': '/getimgcode.do?t=',

                'getAllProvinceList': "/register/getAllProvinceList.json",
                'getCityListByProvince': "/register/getCityListByProvince.json", // provinceCode
                'getSchoolList': "/register/getSchoolList.json", // provinceCode, cityCode
                'getEduSysList': "/register/getEduSysList.json",

                'creditActiveUp': "/credit/active/m/credit_active_up.json",

                'doCheckUnPassReason': userCreditPrefixUrl + '/credit/doCheckUnPassReason.json',

                'getUserCertMaterialInfo': userCreditPrefixUrl + '/credit/getUserCertMaterialInfo.json',

                'getAuthorizeParam': userPrefixUrl + '/zhima/getAuthorizeParam.json',
                'getUserZhimaScore': userPrefixUrl + '/zhima/getUserZhimaScore.json',

                'getUserLevel': '/m/m/vip/get_user_level.json',  //获取用户信用等级

                'saveForget': "/forget/m_saveFoget.json",
                'sendAuthCodeForget': "/forget/m_sendAuthCode.json",
                'validateAuthCodeForget': '/forget/validateAuthCode.json', //验证验证码是否有效

                //毕业贷
                'sendEmal': userCreditPrefixUrl + '/grad/send_emal.json',      //发邮件到邮箱
                'checkEmail': userCreditPrefixUrl + '/grad/check_email.json',      //验证邮箱验证码
                'getGradUserCrditStatusByUserId': userCreditPrefixUrl + '/grad/getGradUserCrditStatusByUserId.json',      //判断是否是v2用户
                'getGradUserInfos': userCreditPrefixUrl + '/grad/getGradUserInfos.json',      //获取已经填写的信息
                'getGradUserBigPhoto': userCreditPrefixUrl + '/grad/getGradUserInfos.json?isBigSize=y',      //获取已经填写的信息
                'submitGradAttach': userCreditPrefixUrl + '/grad/submit_grad_attach.json',      //提交审核信息
                'saveGradUserCredit': userCreditPrefixUrl + '/grad/saveGradUserCredit.json',      //动态保存用户信息
                'doUploadCradCreditImage': userCreditPrefixUrl + '/grad/doUploadCradCreditImage.json',      //上传图片
                'monthlevel': userCreditPrefixUrl + '/grad/monthlevel.json',     //获取工资列表


                //登陆短信认证
                'dorisklogin': '/dorisklogin.json',
                'sendsmscode': '/sendsmscode.json',


                'getImgCode': userPrefixUrl + "/register/m_getimgcode.json?t=",  //    获取图片验证码
                'sandImgCode': userPrefixUrl + "/register/m_sendAuthCode.json",// 发送进行验证
                'validateImgCode': userPrefixUrl + "/register/m_validateImg.json", //验证图片验证码是否有效

                'sendAuthCode': userPrefixUrl + '/register/m_sendAuthCode.json', //发送验证码
                'checkUserRegister': userPrefixUrl + '/register/m_check_user_register.json', //判断用户是否注册
                'validateAuthCode': userPrefixUrl + '/register/validateAuthCode.json', //验证验证码是否有效
                'saveRegister': userPrefixUrl + '/register/m_saveRegister.json', //保存注册
                'getCreditCertInfo': userCreditPrefixUrl + '/credit/doGetCreditCertInfo.json', //获取用户上传信息
                'getCreditCertInfoBigPhoto': userCreditPrefixUrl + '/credit/doGetCreditCertInfo.json?isBigSize=y', //获取用户上传信息,大图片
                'uploadPhoto': userCreditPrefixUrl + '/credit/doUploadCreditImage.json', //上传信息
                'saveUserCreditInfo': userCreditPrefixUrl + '/credit/saveUserCreditInfo.json',  //保存用户信息
                'saveUserSeniorCreditInfo': userCreditPrefixUrl + '/credit/saveUserSeniorCreditInfo.json', //保存用户高级认证信息
                'saveUserContactsInfos': userPrefixUrl + '/user/saveUserContactsInfos.json', //保存用户通讯录信息
                'createLightCredit': '/credit/active/create_light_credit.json',  //提交轻认证
                'getMsgPhone': userCreditPrefixUrl + '/safe/get_msgPhone.json',  //获取用户认证时的手机号
                'getMobileAddress': userCreditPrefixUrl + '/get_mobile_address.json',  //判断运营商
                'getPhonetask': userCreditPrefixUrl + '/get_phone_task.json',  //提交服务密码,获取手机验证码
                'getSeniorStatus': userCreditPrefixUrl + '/get_senior_status.json',   //高级认证提交状态
                'saveUserCreditInfoWeChat': '/m/m/credit/saveUserCreditInfoWeChat.json'

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