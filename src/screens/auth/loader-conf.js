/**
 * auth screens configs
 * @create 2017/03/06
 * @author dxw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.auth.main.states',
            'files': ['screens/auth/configs/auth-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.auth.credit.states',
            'files': ['screens/auth/configs/auth-credit-states']
        }],
        'futureStatesConf': [{
            'stateName': 'auth-main',
            'urlPrefix': '/auth/main',
            'type': 'ocLazyLoad',
            'module': 'screens.auth.main.states'
        }, {
            'stateName': 'auth-credit',
            'urlPrefix': '/auth/credit',
            'type': 'ocLazyLoad',
            'module': 'screens.auth.credit.states'
        }]
    };

});
