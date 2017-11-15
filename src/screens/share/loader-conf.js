/**
 * screens - share
 * @create 2015/12/30
 * @author D.xw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{//邀请有礼主页面
            'reconfig': true,
            'name': 'screens.share.taskShare.states',
            'files': ['screens/share/configs/task-share-states']
        }, {//邀请有礼__好友列表页
            'reconfig': true,
            'name': 'screens.share.friendsList.states',   //模块名
            'files': ['screens/share/configs/share-friendsList-states']   //states文件的路径
        }, {//邀请有礼__往期好友列表页
            'reconfig': true,
            'name': 'screens.share.preFriends.states',   //模块名
            'files': ['screens/share/configs/share-preFriends-states']   //states文件的路径
        }, {//邀请有礼__资金明细
            'reconfig': true,
            'name': 'screens.share.financial.states',   //模块名
            'files': ['screens/share/configs/share-financial-states']   //states文件的路径
        }],

        'futureStatesConf': [{//邀请有礼主页面
            'stateName': 'task-share',
            'urlPrefix': '/works/task/share',
            'type': 'ocLazyLoad',
            'module': 'screens.share.taskShare.states'
        }, {//邀请有礼__好友列表页
            'stateName': 'share-friendsList',
            'urlPrefix': '/share/friendsList',
            'type': 'ocLazyLoad',
            'module': 'screens.share.friendsList.states'
        }, {//邀请有礼__往期好友列表
            'stateName': 'share-preFriends',
            'urlPrefix': '/share/preFriends',
            'type': 'ocLazyLoad',
            'module': 'screens.share.preFriends.states'
        }, {//邀请有礼__资金明细
            'stateName': 'share-financial',
            'urlPrefix': '/share/financial',
            'type': 'ocLazyLoad',
            'module': 'screens.share.financial.states'
        }, {//邀请有礼__资金明细
            'stateName': 'share-financial-all',
            'urlPrefix': '/share/financial/all',
            'type': 'ocLazyLoad',
            'module': 'screens.share.financial.states'
        }, {//邀请有礼__资金明细
            'stateName': 'share-financial-out',
            'urlPrefix': '/share/financial/out',
            'type': 'ocLazyLoad',
            'module': 'screens.share.financial.states'
        }, {//邀请有礼__资金明细
            'stateName': 'share-financial-in',
            'urlPrefix': '/share/financial/in',
            'type': 'ocLazyLoad',
            'module': 'screens.share.financial.states'
        }]
    };

});
