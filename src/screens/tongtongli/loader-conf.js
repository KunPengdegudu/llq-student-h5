/**
 * sale screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.tongtongli.main.states',
            'files': ['screens/tongtongli/configs/tongtongli-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'tongtongli-main',
            'urlPrefix': '/tongtongli/main',
            'type': 'ocLazyLoad',
            'module': 'screens.tongtongli.main.states'
        }]
    };

});
