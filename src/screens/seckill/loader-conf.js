/**
 * seckill screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.seckill.main.states',
            'files': ['screens/seckill/configs/seckill-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'seckill-main',
            'urlPrefix': '/seckill/main',
            'type': 'ocLazyLoad',
            'module': 'screens.seckill.main.states'
        }]
    };

});
