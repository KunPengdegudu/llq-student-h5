/**
 * sale screens configs
 * @create 2015/07/18
 * @author Dxw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.mobileTribe.main.states',
            'files': ['screens/mobileTribe/configs/mobileTribe-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'mobileTribe-main',
            'urlPrefix': '/mobileTribe/main',
            'type': 'ocLazyLoad',
            'module': 'screens.mobileTribe.main.states'
        }]
    };

});
