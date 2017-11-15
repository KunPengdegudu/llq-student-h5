/**
 * rechargeGame screens configs
 * @create 2017／05／15
 * @author dxw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.rechargeGame.main.states',
            'files': ['screens/rechargeGame/configs/rechargeGame-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.rechargeGame.detail.states',
            'files': ['screens/rechargeGame/configs/rechargeGame-detail-states']
        }, {
            'reconfig': true,
            'name': 'screens.rechargeGame.purchase.states',
            'files': ['screens/rechargeGame/configs/rechargeGame-purchase-states']
        }, {
            'reconfig': true,
            'name': 'screens.rechargeGame.widget.states',
            'files': ['screens/rechargeGame/configs/rechargeGame-widget-states']
        }, {
            'reconfig': true,
            'name': 'screens.rechargeGame.search.states',
            'files': ['screens/rechargeGame/configs/rechargeGame-search-states']
        }],
        'futureStatesConf': [{
            'stateName': 'rechargeGame-main',
            'urlPrefix': '/recharge/main/game',
            'type': 'ocLazyLoad',
            'module': 'screens.rechargeGame.main.states'
        }, {
            'stateName': 'rechargeGame-detail',
            'urlPrefix': '/recharge/game/details',
            'type': 'ocLazyLoad',
            'module': 'screens.rechargeGame.detail.states'
        }, {
            'stateName': 'rechargeGame-purchase',
            'urlPrefix': '/recharge/purchase',
            'type': 'ocLazyLoad',
            'module': 'screens.rechargeGame.purchase.states'
        }, {
            'stateName': 'rechargeGame-widget',
            'urlPrefix': '/recharge/widget',
            'type': 'ocLazyLoad',
            'module': 'screens.rechargeGame.widget.states'
        }, {
            'stateName': 'rechargeGame-search',
            'urlPrefix': '/recharge/search',
            'type': 'ocLazyLoad',
            'module': 'screens.rechargeGame.search.states'
        }]
    };

});
