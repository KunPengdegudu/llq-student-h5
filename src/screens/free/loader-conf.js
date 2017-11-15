/**
 * screens - free
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.free.main.states',
            'files': ['screens/free/configs/free-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'free-main',
            'urlPrefix': '/free/main',
            'type': 'ocLazyLoad',
            'module': 'screens.free.main.states'
        }]
    };

});
