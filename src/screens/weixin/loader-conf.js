/**
 * product screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.weixin.enroll.states',
            'files': ['screens/weixin/configs/enroll-states']
        }, {
            'reconfig': true,
            'name': 'screens.weixin.v1.states',
            'files': ['screens/weixin/configs/v1-states']
        }, {
            'reconfig': true,
            'name': 'screens.weixin.aging.states',
            'files': ['screens/weixin/configs/aging-states']
        }, {
            'reconfig': true,
            'name': 'screens.weixin.blanknote.states',
            'files': ['screens/weixin/configs/blanknote-states']
        }, {
            'reconfig': true,
            'name': 'screens.weixin.ticket.states',
            'files': ['screens/weixin/configs/ticket-states']
        }],
        'futureStatesConf': [{
            'stateName': 'weixin-enroll',
            'urlPrefix': '/weixin/enroll',
            'type': 'ocLazyLoad',
            'module': 'screens.weixin.enroll.states'
        }, {
            'stateName': 'weixin-v1',
            'urlPrefix': '/weixin/v1',
            'type': 'ocLazyLoad',
            'module': 'screens.weixin.v1.states'
        }, {
            'stateName': 'weixin-aging',
            'urlPrefix': '/weixin/aging',
            'type': 'ocLazyLoad',
            'module': 'screens.weixin.aging.states'
        }, {
            'stateName': 'weixin-blanknote',
            'urlPrefix': '/weixin/blanknote',
            'type': 'ocLazyLoad',
            'module': 'screens.weixin.blanknote.states'
        }, {
            'stateName': 'weixin-ticket',
            'urlPrefix': '/weixin/ticket',
            'type': 'ocLazyLoad',
            'module': 'screens.weixin.ticket.states'
        }]
    };

});
