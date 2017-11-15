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
            'name': 'screens.active.main.states',
            'files': ['screens/active/configs/active-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.active.kaola.states',
            'files': ['screens/active/configs/active-kaola-states']
        }, {
            'reconfig': true,
            'name': 'screens.active.yx.states',
            'files': ['screens/active/configs/active-yx-states']
        }],
        'futureStatesConf': [{
            'stateName': 'active-main',
            'urlPrefix': '/active/main',
            'type': 'ocLazyLoad',
            'module': 'screens.active.main.states'
        }, {
            'stateName': 'active-kaola',
            'urlPrefix': '/active/kaola',
            'type': 'ocLazyLoad',
            'module': 'screens.active.kaola.states'
        }, {
            'stateName': 'active-yx',
            'urlPrefix': '/active/yx',
            'type': 'ocLazyLoad',
            'module': 'screens.active.yx.states'
        }]
    };

});
