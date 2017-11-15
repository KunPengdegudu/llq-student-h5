/**
 * urlhelper for works
 * @create: 2015/12/30
 * @author: D.xw
 */
define(['screens/works/module'], function (module) {
    'use strict';

    module
        .factory('worksUrlHelper', function () {
            var devUrl = '',
                productUrl = "/w",
                prefixUrl = '/m/s',
                userCreditPrefixUrl = '/m/m',
                massfrog = '/massfrog',
                homeUrl = 'https://m.007fenqi.com/app/family/homepage/index.html#';


            var urlMap = {
                'queryUserInfor': "/credit/active/query_user_infor.json",
                'res': prefixUrl + '/user/get_user_info.json',  //用户资料详情
                'bindFundAccount': productUrl + '/acc/bind_fund_account.json',
                'getCreditCertInfo': userCreditPrefixUrl + '/credit/doGetCreditCertInfo.json', //获取用户上传信息
                'createLightCredit': '/credit/active/create_light_credit.json',   //提交轻认证

                'queryBanners': productUrl + '/queryBanners.json?type=007_phone_task',   //任务banner

                //发现
                'queryBannersByExplore': productUrl + '/queryBanners.json?type=explore',   //发现首页banner
                'doQueryWidetNodetree': '/select/product/doQueryWidetNodetree.json?widgetCode=FX002',        //精选话题
                'doQueryData': '/select/product/doQueryData.json',

                'getCashRepayment': prefixUrl + '/cash/get_repayment_schedule_list.json',
                'withdraw': prefixUrl + '/ewallet/withdraw.json',//个人提现

                //钱包
                'getEwallet': prefixUrl + '/ewallet/get_ewallet.json',   //账户余额

                // 支付宝
                'getAlipayAccounts': prefixUrl + '/cash/getAlipayAccounts.json',

                //资金流
                'queryBilling': prefixUrl + '/ewallet/queryBilling.json',

                //注册
                'getImgCode': prefixUrl + "/register/m_getimgcode.json?t=",  //    获取图片验证码
                'checkUserRegister': prefixUrl + '/register/m_check_user_register.json', //判断用户是否注册
                'validateImgCode': prefixUrl + "/register/m_validateImg.json", //验证图片验证码是否有效
                'sendAuthCode': prefixUrl + '/register/m_sendAuthCode.json', //发送验证码
                'saveRegister': prefixUrl + '/register/m_saveRegister.json', //保存注册
                'validateAuthCode': prefixUrl + '/register/validateAuthCode.json', //验证验证码是否有效


                // 蛙社

                'insertBjobSign': massfrog + '/bull/job/insert_bjob_sign.json',
                'updateUserAttachInfo': massfrog + '/bull/user/updateUserAttachInfo.json',     //更新或新增用户其他信息
                'queryUserAttachInfos': massfrog + '/bull/user/queryUserAttachInfos.json',     //获取用户其他信息
                'queryAllFRequirementTypes': massfrog + '/bull/require/queryAllFRequirementTypes.json',       //工作种类列表
                'queryPersonSummary': massfrog + '/bull/ewallet/person/queryPersonSummary.json',    //查询个人账户信息
                'getOpenCityList': massfrog + '/common/get_opencity_list.json',       //获取城市列表
                'selectRequirements': massfrog + '/bull/require/select_requirements.json', //获取兼职需求列表
                'queryOrderDetail': massfrog + '/bull/order/person/query_order_detail.json',//获取工作详情
                'sendApplyForRequirement': massfrog + '/bull/feedback/sendApplyForRequirement.json',
                'selectDetailRequirements': massfrog + '/bull/require/select_detail_requirements.json',//获取工作详情
                'getQingtuansheApplyListUrl': massfrog + '/bull/feedback/getQingtuansheApplyListUrl.json',//跳转到青团社

                // 上传图片
                'uploadFiles': massfrog + '/bull/upload/uploadFiles.json',

                'getAreasCityCode': massfrog + '/common/get_areas_citycode.json',

                'getUserInfo': massfrog + '/bull/user/get_user_info.json',         //查询娃社用户
                'updateFeedbackStatus': massfrog + '/bull/feedback/updateFeedbackStatus.json',//修改申请状态
                'listRequirementApplys': massfrog + '/bull/feedback/listRequirementApplys.json',//查询兼职申请列表
                'inquiryPersonOrder': massfrog + '/bull/order/person/inquiry_person_order.json',//用户确认上岗
                'updateUserBasicInfo': massfrog + '/bull/user/updateUserBasicInfo.json',           //向蛙社提交个人信息
                'queryCorpDetailInfo': massfrog + '/bull/corp/queryCorpDetailInfo.json',//查询商家详情
                'updateLastCityCode': massfrog + '/bull/user/updateLastCityCode.json',// 更新当前用户登录的城市
                //任务
                'queryPromotionTasks': massfrog + '/m/promotion/queryPromotionTasks.json',//查询任务列表
                'queryPromotionTaskByTaskId': massfrog + '/m/promotion/queryPromotionTaskByTaskId.json',
                'queryUserTaskStepsByUserTaskIdUP': massfrog + '/m/user/promotion/queryUserTaskStepsByUserTaskIdUP.json',//查询单个任务
                'queryUserTask': massfrog + '/m/user/promotion/query_user_task.json',//查询我的任务记录
                'queryTaskStepsByTaskId': massfrog + '/m/promotion/queryTaskStepsByTaskId.json', //进行任务
                'savePromotionUserResults': massfrog + '/m/user/promotion/savePromotionUserResults.json',//保存输入信息
                'createUserTask': massfrog + '/m/user/promotion/create_user_task.json',//创建任务
                'commitPromotionUserResults': massfrog + '/m/user/promotion/commitPromotionUserResults.json',//提交任务
                'uploadTaskFiles': massfrog + '/m/promotion/uploadFiles.json',//上传图片
                'deleteUserPics': massfrog + '/m/user/promotion/deleteUserPics.json',//删除图片
                'queryPrePics': massfrog + '/m/promotion/queryPrePics.json',//预览图片
                'queryUserTaskByUserTaskId': massfrog + '/m/user/promotion/queryUserTaskByUserTaskId.json',//我的任务进入任务详情
                'backWorkExperience': homeUrl + '/works/experience?pageType=intern',
                //师带徒
                'getSpreadInfo': '/user/get_spread_info.json',   //获取推广码
                'info': massfrog + '/m/rebate/info.json',
                'querySysNotice': prefixUrl + '/user/querySysNotice.json',
                //邀请有礼
                'getAllInviteFriends': productUrl + '/invite/friends/get_all_invite_friends_num.json', //主页面__我的好友
                'getInviteSpreadCode': productUrl + '/invite/friends/get_invite_spread_code.json',  //获取邀请码
                'getUserWithdrawAmount': prefixUrl + '/ewallet/getUserHisIncrAmount.json',   //个人通过活动获得的返现总额（首页）
                'getTotalInviteFriends': productUrl + '/friends/get_register_num_from_invite_activity.json',  //用户活动邀请总人数(登录)
                'getInviteFriends': productUrl + '/friends/get_register_num_of_one_from_invite_activity.json',  //通过邀请活动注册的总人数(登录)
                'getAllHisIncrAmount': prefixUrl + '/ewallet/getAllHisIncrAmount.json',   //活动总返现
                'getRankDay': productUrl + '/friends/get_friend_charts_of_day.json',  //日排行
                'getRankWeek': productUrl + '/friends/get_friend_charts_of_week.json',  //周排行
                'getRankMonth': productUrl + '/friends/get_friend_charts_of_month.json',  //月排行
                'getBroadcast': productUrl + '/invite/friends/get_return_cash_list.json',   //播报
                'getDiffStateFriendsNum': productUrl + '/friends/get_friend_num_from_invite_activity.json',   //不同的几个状态下的好友数量
                'getFriendsList': productUrl + '/friends/get_friend_list.json',  //获取好友列表
                'getHistoryFriendslist': productUrl + '/friends/get_history_friend_list.json',  //获取往期好友列表
                'getActivityInfo': '/mc/invite/get_activity_info.json', //查询活动规则
                'getFinancialDetail': prefixUrl + '/ewallet/queryAccountBilling.json',   //资金明细
                'getUserHistoryAmount': prefixUrl + '/ewallet/getAccHisIncrAmount.json',   //提现（总返现）
                'getUserCouponInfo': '/mc/invite/get_user_coupon_info.json',
                'addInviteRecord': productUrl + '/invite/friends/add_invite_record.json',   //添加邀请记录

                'getAppPopWithdrawMinAmount': prefixUrl + '/ewallet/getAppPopWithdrawMinAmount.json',      //查询任务账户最小提现金额
                'getCertProductList':'/m/s/user/getCertProductList.json',

                //交易密码
                'isPayPasswordSet': prefixUrl + '/ewallet/is_pay_password_set.json',   //查询支付密码
                'setPayPassword': prefixUrl + '/ewallet/set_pay_password.json',     //设置支付密码
                'resetPayPassword': prefixUrl + '/ewallet/reset_pay_password.json'     //修改支付密码

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