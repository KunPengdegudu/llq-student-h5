/**
 * profile screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.profile.introduction.states',
            'files': ['screens/profile/configs/guide-introduction-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.main.states',
            'files': ['screens/profile/configs/profile-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.myorder.states',
            'files': ['screens/profile/configs/profile-myorder-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.mybill.states',
            'files': ['screens/profile/configs/profile-mybill-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.mybill.detail.states',
            'files': ['screens/profile/configs/profile-mybill-detail-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.red.states',
            'files': ['screens/profile/configs/profile-red-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.coupon.states',
            'files': ['screens/profile/configs/profile-coupon-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.lifting.states',
            'files': ['screens/profile/configs/profile-lifting-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.help.states',
            'files': ['screens/profile/configs/profile-help-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.help.who.states',
            'files': ['screens/profile/configs/profile-help-who-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.help.limit.states',
            'files': ['screens/profile/configs/profile-help-limit-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.help.material.states',
            'files': ['screens/profile/configs/profile-help-material-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.help.procedure.states',
            'files': ['screens/profile/configs/profile-help-procedure-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.help.question.states',
            'files': ['screens/profile/configs/profile-help-question-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.joinus.states',
            'files': ['screens/profile/configs/profile-joinus-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.msg.states',
            'files': ['screens/profile/configs/profile-msg-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.feedback.states',
            'files': ['screens/profile/configs/profile-feedback-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.quota.states',
            'files': ['screens/profile/configs/profile-quota-states']
        }, {
            //    'reconfig': true,
            //    'name': 'screens.profile.res.states',
            //    'files': ['screens/profile/configs/profile-res-states']
            //}, {
            'reconfig': true,
            'name': 'screens.profile.res.card.states',
            'files': ['screens/profile/configs/profile-res-card-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.setting.states',
            'files': ['screens/profile/configs/profile-setting-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.setting.address.states',
            'files': ['screens/profile/configs/profile-setting-address-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.setting.outsourcing.states',
            'files': ['screens/profile/configs/profile-setting-outsourcing-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.setting.about.states',
            'files': ['screens/profile/configs/profile-setting-about-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.setting.us.states',
            'files': ['screens/profile/configs/profile-setting-us-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.setting.service.states',
            'files': ['screens/profile/configs/profile-setting-service-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.setting.connectus.states',
            'files': ['screens/profile/configs/profile-setting-connectus-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.wallet.states',
            'files': ['screens/profile/configs/profile-wallet-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.promotion.states',
            'files': ['screens/profile/configs/profile-promotion-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.myCategory.states',
            'files': ['screens/profile/configs/profile-myCategory-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.payResult.states',
            'files': ['screens/profile/configs/profile-pay-result-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.orderAssess.states',
            'files': ['screens/profile/configs/profile-order-assess-states']
        }, {
            'reconfig': true,
            'name': 'screens.profile.all-assess.states',
            'files': ['screens/profile/configs/profile-all-assess-states']
        }],
        'futureStatesConf': [{
            'stateName': 'profile-introduction',
            'urlPrefix': '/profile/introduction',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.introduction.states'
        }, {
            'stateName': 'profile-main',
            'urlPrefix': '/profile/main',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.main.states'
        }, {
            'stateName': 'profile-myorder',
            'urlPrefix': '/profile/myorder',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.myorder.states'
        }, {
            'stateName': 'profile-myorder-all',
            'urlPrefix': '/profile/myorder/orderall',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.myorder.states'
        }, {
            'stateName': 'profile-myorder-sale',
            'urlPrefix': '/profile/myorder/ordersale',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.myorder.states'
        }, {
            'stateName': 'profile-myorder-stage',
            'urlPrefix': '/profile/myorder/orderstage',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.myorder.states'
        }, {
            'stateName': 'profile-myorder-cash',
            'urlPrefix': '/profile/myorder/ordercash',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.myorder.states'
        }, {
            'stateName': 'profile-mybill',
            'urlPrefix': '/profile/mybill',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.mybill.states'
        }, {
            'stateName': 'profile-mybill-current',
            'urlPrefix': '/profile/mybill/billcurrent',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.mybill.states'
        }, {
            'stateName': 'profile-mybill-next',
            'urlPrefix': '/profile/mybill/billnext',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.mybill.states'
        }, {
            'stateName': 'profile-mybill-detail',
            'urlPrefix': '/profile/billdetail',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.mybill.detail.states'
        }, {
            'stateName': 'profile-red',
            'urlPrefix': '/profile/red',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.red.states'
        }, {
            'stateName': 'profile-red-notUsed',
            'urlPrefix': '/profile/red/notUsed',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.red.states'
        }, {
            'stateName': 'profile-red-used',
            'urlPrefix': '/profile/red/used',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.red.states'
        }, {
            'stateName': 'profile-red-failures',
            'urlPrefix': '/profile/red/failures',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.red.states'
        }, {
            'stateName': 'profile-coupon',
            'urlPrefix': '/profile/coupon',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.coupon.states'
        }, {
            'stateName': 'profile-coupon-notUsed',
            'urlPrefix': '/profile/coupon/notUsed',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.coupon.states'
        }, {
            'stateName': 'profile-coupon-used',
            'urlPrefix': '/profile/coupon/used',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.coupon.states'
        }, {
            'stateName': 'profile-coupon-failures',
            'urlPrefix': '/profile/coupon/failures',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.coupon.states'
        }, {
            'stateName': 'profile-lifting',
            'urlPrefix': '/profile/lifting',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.lifting.states'
        }, {
            'stateName': 'profile-help',
            'urlPrefix': '/profile/help',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.help.states'
        }, {
            'stateName': 'profile-help-who',
            'urlPrefix': '/profile/help/who',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.help.who.states'
        }, {
            'stateName': 'profile-help-limit',
            'urlPrefix': '/profile/help/limit',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.help.limit.states'
        }, {
            'stateName': 'profile-help-material',
            'urlPrefix': '/profile/help/material',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.help.material.states'
        }, {
            'stateName': 'profile-help-procedure',
            'urlPrefix': '/profile/help/procedure',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.help.procedure.states'
        }, {
            'stateName': 'profile-help-question',
            'urlPrefix': '/profile/help/question',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.help.question.states'
        }, {
            'stateName': 'profile-joinus',
            'urlPrefix': '/profile/joinus',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.joinus.states'
        }, {
            'stateName': 'profile-msg',
            'urlPrefix': '/profile/msg',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.msg.states'
        }, {
            'stateName': 'profile-feedback',
            'urlPrefix': '/profile/feedback',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.feedback.states'
        }, {
            'stateName': 'profile-quota',
            'urlPrefix': '/profile/quota',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.quota.states'
        }, {
            'stateName': 'profile-quota-waitingFetch',
            'urlPrefix': '/profile/quota/waitingFetch',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.quota.states'
        }, {
            'stateName': 'profile-quota-fetched',
            'urlPrefix': '/profile/quota/fetched',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.quota.states'
        }, {
            'stateName': 'profile-quota-expired',
            'urlPrefix': '/profile/quota/expired',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.quota.states'
        }, {
            //    'stateName': 'profile-res',
            //    'urlPrefix': '/profile/res',
            //    'type': 'ocLazyLoad',
            //    'module': 'screens.profile.res.states'
            //}, {
            'stateName': 'profile-res-card',
            'urlPrefix': '/profile/res/card',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.res.card.states'
        }, {
            'stateName': 'profile-setting',
            'urlPrefix': '/profile/setting',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.setting.states'
        }, {
            'stateName': 'profile-setting-address',
            'urlPrefix': '/profile/setting/address',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.setting.address.states'
        }, {
            'stateName': 'profile-setting-outsourcing',
            'urlPrefix': '/profile/setting/outsourcing',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.setting.outsourcing.states'
        }, {
            'stateName': 'profile-setting-about',
            'urlPrefix': '/profile/setting/about',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.setting.about.states'
        }, {
            'stateName': 'profile-setting-us',
            'urlPrefix': '/profile/setting/us',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.setting.us.states'
        }, {
            'stateName': 'profile-setting-service',
            'urlPrefix': '/profile/setting/service',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.setting.service.states'
        }, {
            'stateName': 'profile-setting-connectus',
            'urlPrefix': '/profile/setting/connectus',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.setting.connectus.states'
        }, {
            'stateName': 'profile-wallet',
            'urlPrefix': '/profile/wallet',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.wallet.states'
        }, {
            'stateName': 'profile-promotion',
            'urlPrefix': '/profile/promotion',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.promotion.states'
        }, {
            'stateName': 'profile-myCategory',
            'urlPrefix': '/profile/myCategory',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.myCategory.states'
        }, {
            'stateName': 'profile-myCategory-status',
            'urlPrefix': '/profile/myCategory/status',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.myCategory.states'
        }, {
            'stateName': 'profile-pay-result-status',
            'urlPrefix': '/profile/pay/result',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.payResult.states'
        }, {
            'stateName': 'profile-order-assess-status',
            'urlPrefix': '/profile/orderAssess',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.orderAssess.states'
        }, {
            'stateName': 'profile-all-assess-status',
            'urlPrefix': '/profile/allAssess',
            'type': 'ocLazyLoad',
            'module': 'screens.profile.all-assess.states'
        }]
    };

});