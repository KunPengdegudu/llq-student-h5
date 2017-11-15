/**
 * urlhelper for works
 * @create: 2015/12/30
 * @author: D.xw
 */
define(['screens/share/module'], function (module) {
    'use strict';

    module
        .factory('shareUrlHelper', function () {
            var devUrl = '',
                productUrl = "/w",
                prefixUrl = '/m/s';


            var urlMap = {

                //注册
                'getImgCode': prefixUrl + "/register/m_getimgcode.json?t=",  //    获取图片验证码
                'checkUserRegister': prefixUrl + '/register/m_check_user_register.json', //判断用户是否注册
                'validateImgCode': prefixUrl + "/register/m_validateImg.json", //验证图片验证码是否有效
                'sendAuthCode': prefixUrl + '/register/m_sendAuthCode.json', //发送验证码
                'saveRegister': prefixUrl + '/register/m_saveRegister.json', //保存注册
                'validateAuthCode': prefixUrl + '/register/validateAuthCode.json', //验证验证码是否有效

                //邀请有礼
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

                'getFinancialDetail': prefixUrl + '/ewallet/queryAccountBilling.json'  //资金明细

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