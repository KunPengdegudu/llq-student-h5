/**
 * shop screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.shop.main.states',
            'files': ['screens/shop/configs/shop-main-states']
        },{
            'reconfig': true,
            'name': 'screens.shop.search.states',
            'files': ['screens/shop/configs/shop-search-states']
        }],
        'futureStatesConf': [{
            'stateName': 'shop-main',
            'urlPrefix': '/shop/main',
            'type': 'ocLazyLoad',
            'module': 'screens.shop.main.states'
        },{
            'stateName': 'shop-search',
            'urlPrefix': '/shop/search',
            'type': 'ocLazyLoad',
            'module': 'screens.shop.search.states'
        }]
    };

});
