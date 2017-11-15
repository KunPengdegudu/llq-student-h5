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
            'name': 'screens.sale.main.states',
            'files': ['screens/sale/configs/sale-main-states']
        }],
        'futureStatesConf': [{
            'stateName': 'sale-main',
            'urlPrefix': '/sale/main',
            'type': 'ocLazyLoad',
            'module': 'screens.sale.main.states'
        }]
    };

});
