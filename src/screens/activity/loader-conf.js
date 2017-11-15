/**
 * enter screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.activity.a915.states',
            'files': ['screens/activity/configs/activity-a915-states']
        }, {
            'reconfig': true,
            'name': 'screens.activity.a901.states',
            'files': ['screens/activity/configs/activity-a901-states']
        }, {
            'reconfig': true,
            'name': 'screens.activity.a719.states',
            'files': ['screens/activity/configs/activity-a719-states']
        }, {
            'reconfig': true,
            'name': 'screens.activity.cash.states',
            'files': ['screens/activity/configs/activity-cash-states']
        }, {
            'reconfig': true,
            'name': 'screens.activity.aQuota.states',
            'files': ['screens/activity/configs/activity-aQuota-states']
        }, {
            'reconfig': true,
            'name': 'screens.activity.xkh.states',
            'files': ['screens/activity/configs/activity-xkh-states']
        }, {
            'reconfig': true,
            'name': 'screens.activity.a828.states',
            'files': ['screens/activity/configs/activity-a828-states']
        }, {
            'reconfig': true,
            'name': 'screens.activity.a171001.states',
            'files': ['screens/activity/configs/activity-a171001-states']
        }],
        'futureStatesConf': [{
            'stateName': 'activity-a915',
            'urlPrefix': '/activity/a915',
            'type': 'ocLazyLoad',
            'module': 'screens.activity.a915.states'
        }, {
            'stateName': 'activity-a901',
            'urlPrefix': '/activity/a901',
            'type': 'ocLazyLoad',
            'module': 'screens.activity.a901.states'
        }, {
            'stateName': 'activity-a719',
            'urlPrefix': '/activity/a719',
            'type': 'ocLazyLoad',
            'module': 'screens.activity.a719.states'
        }, {
            'stateName': 'activity-cash',
            'urlPrefix': '/activity/cash',
            'type': 'ocLazyLoad',
            'module': 'screens.activity.cash.states'
        }, {
            'stateName': 'activity-aQuota',
            'urlPrefix': '/activity/aQuota',
            'type': 'ocLazyLoad',
            'module': 'screens.activity.aQuota.states'
        }, {
            'stateName': 'activity-xkh',
            'urlPrefix': '/activity/xkh',
            'type': 'ocLazyLoad',
            'module': 'screens.activity.xkh.states'
        }, {
            'stateName': 'activity-a828',
            'urlPrefix': '/activity/a828',
            'type': 'ocLazyLoad',
            'module': 'screens.activity.a828.states'
        }, {
            'stateName': 'activity-a171001',
            'urlPrefix': '/activity/a171001',
            'type': 'ocLazyLoad',
            'module': 'screens.activity.a171001.states'
        }]
    };

});
