/**
 * stage screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.stage.main.states',
            'files': ['screens/stage/configs/stage-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'stage-main',
            'urlPrefix': '/stage/main',
            'type': 'ocLazyLoad',
            'module': 'screens.stage.main.states'
        }, {
            'stateName': 'stage-category',
            'urlPrefix': '/stage/category',
            'type': 'ocLazyLoad',
            'module': 'screens.stage.main.states'
        }]
    };

});
