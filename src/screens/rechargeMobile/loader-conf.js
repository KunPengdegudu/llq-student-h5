/**
 * rechargeMobile screens configs
 * @create 2017／05／15
 * @author dxw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.rechargeMobile.main.states',
            'files': ['screens/rechargeMobile/configs/rechargeMobile-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'rechargeMobile-main',
            'urlPrefix': '/recharge/main/mobile',
            'type': 'ocLazyLoad',
            'module': 'screens.rechargeMobile.main.states'
        }]
    };

});
