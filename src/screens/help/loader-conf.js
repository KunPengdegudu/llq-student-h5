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
            'name': 'screens.help.main.states',
            'files': ['screens/help/configs/help-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'help-main',
            'urlPrefix': '/help/main',
            'type': 'ocLazyLoad',
            'module': 'screens.help.main.states'
        }]
    };

});
