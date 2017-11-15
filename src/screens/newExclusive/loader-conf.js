/**
 * newExclusive screens configs
 * @create 2016/07/18
 * @author D.xw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.newExclusive.main.states',
            'files': ['screens/newExclusive/configs/newExclusive-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'newExclusive-main',
            'urlPrefix': '/newExclusive/main',
            'type': 'ocLazyLoad',
            'module': 'screens.newExclusive.main.states'
        }]
    };

});
