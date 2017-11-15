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
            'name': 'screens.enter.main.states',
            'files': ['screens/enter/configs/enter-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'enter-main',
            'urlPrefix': '/enter/main',
            'type': 'ocLazyLoad',
            'module': 'screens.enter.main.states'
        }]
    };

});
