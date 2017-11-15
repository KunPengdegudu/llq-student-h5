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
            'name': 'screens.blanknote.main.states',
            'files': ['screens/blanknote/configs/blank-note-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.blanknote.salary.states',
            'files': ['screens/blanknote/configs/blank-note-salary-states']
        }, {
            'reconfig': true,
            'name': 'screens.blanknote.product.states',
            'files': ['screens/blanknote/configs/blank-note-product-states']
        }, {
            'reconfig': true,
            'name': 'screens.blanknote.productPre.states',
            'files': ['screens/blanknote/configs/blank-note-productPre-states']
        }, {
            'reconfig': true,
            'name': 'screens.blanknote.applySuccess.states',
            'files': ['screens/blanknote/configs/blank-note-applySuccess-states']
        }],
        'futureStatesConf': [{
            'stateName': 'blanknote-main',
            'urlPrefix': '/blanknote/main',
            'type': 'ocLazyLoad',
            'module': 'screens.blanknote.main.states'
        }, {
            'stateName': 'blanknote-salary',
            'urlPrefix': '/blanknote/salary',
            'type': 'ocLazyLoad',
            'module': 'screens.blanknote.salary.states'
        }, {
            'stateName': 'blanknote-product',
            'urlPrefix': '/blanknote/product',
            'type': 'ocLazyLoad',
            'module': 'screens.blanknote.product.states'
        }, {
            'stateName': 'blanknote-productPre',
            'urlPrefix': '/blanknote/productPre',
            'type': 'ocLazyLoad',
            'module': 'screens.blanknote.productPre.states'
        }, {
            'stateName': 'blanknote-applySuccess',
            'urlPrefix': '/blanknote/applySuccess',
            'type': 'ocLazyLoad',
            'module': 'screens.blanknote.applySuccess.states'
        }]
    };

});
