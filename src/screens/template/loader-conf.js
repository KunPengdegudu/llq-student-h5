/**
 * template screens configs
 * @create 2016/07/18
 * @author D.xw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.template.main.states',
            'files': ['screens/template/configs/template-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.template.floorStyle.states',
            'files': ['screens/template/configs/template-floorStyle-states']
        }, {
            'reconfig': true,
            'name': 'screens.template.commonStyle.states',
            'files': ['screens/template/configs/template-commonStyle-states']
        }, {
            'reconfig': true,
            'name': 'screens.template.productList.states',
            'files': ['screens/template/configs/template-productList-states']
        }],
        'futureStatesConf': [{
            'stateName': 'template-main',
            'urlPrefix': '/template/main',
            'type': 'ocLazyLoad',
            'module': 'screens.template.main.states'
        }, {
            'stateName': 'template-floorStyle',
            'urlPrefix': '/template/floorStyle',
            'type': 'ocLazyLoad',
            'module': 'screens.template.floorStyle.states'
        }, {
            'stateName': 'template-commonStyle',
            'urlPrefix': '/template/commonStyle',
            'type': 'ocLazyLoad',
            'module': 'screens.template.commonStyle.states'
        }, {
            'stateName': 'template-productList',
            'urlPrefix': '/template/productList',
            'type': 'ocLazyLoad',
            'module': 'screens.template.productList.states'
        }]
    };

});
