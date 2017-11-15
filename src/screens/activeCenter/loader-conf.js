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
            'name': 'screens.activeCenter.main.states',
            'files': ['screens/activeCenter/configs/activeCenter-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.activeCenter.goods.states',
            'files': ['screens/activeCenter/configs/activeCenter-goods-states']
        }, {
            'reconfig': true,
            'name': 'screens.activeCenter.coupon.states',
            'files': ['screens/activeCenter/configs/activeCenter-coupon-states']
        }, {
            'reconfig': true,
            'name': 'screens.activeCenter.jd.states',
            'files': ['screens/activeCenter/configs/activeCenter-jd-states']
        }, {
            'reconfig': true,
            'name': 'screens.activeCenter.yx.states',
            'files': ['screens/activeCenter/configs/activeCenter-yx-states']
        }, {
            'reconfig': true,
            'name': 'screens.activeCenter.kaola.states',
            'files': ['screens/activeCenter/configs/activeCenter-kaola-states']
        }],
        'futureStatesConf': [{
            'stateName': 'activeCenter-main',
            'urlPrefix': '/activeCenter/main',
            'type': 'ocLazyLoad',
            'module': 'screens.activeCenter.main.states'
        }, {
            'stateName': 'activeCenter-goods',
            'urlPrefix': '/activeCenter/goods',
            'type': 'ocLazyLoad',
            'module': 'screens.activeCenter.goods.states'
        }, {
            'stateName': 'activeCenter-coupon',
            'urlPrefix': '/activeCenter/coupon',
            'type': 'ocLazyLoad',
            'module': 'screens.activeCenter.coupon.states'
        }, {
            'stateName': 'activeCenter-jd',
            'urlPrefix': '/activeCenter/jd',
            'type': 'ocLazyLoad',
            'module': 'screens.activeCenter.jd.states'
        }, {
            'stateName': 'activeCenter-yx',
            'urlPrefix': '/activeCenter/yx',
            'type': 'ocLazyLoad',
            'module': 'screens.activeCenter.yx.states'
        }, {
            'stateName': 'activeCenter-kaola',
            'urlPrefix': '/activeCenter/kaola',
            'type': 'ocLazyLoad',
            'module': 'screens.activeCenter.kaola.states'
        }]
    };

});
