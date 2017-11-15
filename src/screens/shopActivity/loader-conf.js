/**
 * enter screens configs
 * @create 2016//08/28
 * @author D.xw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.shopActivity.groupBuy.states',
            'files': ['screens/shopActivity/configs/shopActivity-groupBuy-states']
        }],
        'futureStatesConf': [{
            'stateName': 'shopActivity-groupBuy',
            'urlPrefix': '/shopActivity/groupBuy',
            'type': 'ocLazyLoad',
            'module': 'screens.shopActivity.groupBuy.states'
        }]
    };

});
