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
            'name': 'screens.login.login.states',
            'files': ['screens/login/configs/login-states']
        }, {
            'reconfig': true,
            'name': 'screens.login.new.states',
            'files': ['screens/login/configs/login-new-states']
        }, {
            'reconfig': true,
            'name': 'screens.login.check.states',
            'files': ['screens/login/configs/login-check-states']
        }],
        'futureStatesConf': [{
            'stateName': 'login-login',
            'urlPrefix': '/login',
            'type': 'ocLazyLoad',
            'module': 'screens.login.login.states'
        }, {
            'stateName': 'login-new',
            'urlPrefix': '/login/new',
            'type': 'ocLazyLoad',
            'module': 'screens.login.new.states'
        }, {
            'stateName': 'login-check',
            'urlPrefix': '/login/check',
            'type': 'ocLazyLoad',
            'module': 'screens.login.check.states'
        }]
    };

});
