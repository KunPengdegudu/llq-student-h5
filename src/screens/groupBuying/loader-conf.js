/**
 * groupBuying screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.groupBuying.main.states',
            'files': ['screens/groupBuying/configs/groupBuying-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.groupBuying.rule.states',
            'files': ['screens/groupBuying/configs/groupBuying-rule-states']
        }, {
            'reconfig': true,
            'name': 'screens.groupBuying.foreshow.states',
            'files': ['screens/groupBuying/configs/groupBuying-foreshow-states']
        },{
            'reconfig': true,
            'name': 'screens.groupBuying.product.states',
            'files': ['screens/groupBuying/configs/groupBuying-product-states']
        },{
            'reconfig': true,
            'name': 'screens.groupBuying.orderConfirm.states',
            'files': ['screens/groupBuying/configs/groupBuying-order-confirm-states']
        },{
            'reconfig': true,
            'name': 'screens.groupBuying.myOrder.states',
            'files': ['screens/groupBuying/configs/groupBuying-myOrder-states']
        },{
            'reconfig': true,
            'name': 'screens.groupBuying.details.states',
            'files': ['screens/groupBuying/configs/groupBuying-details-states']
        }],
        'futureStatesConf': [{
            'stateName': 'groupBuying-main',
            'urlPrefix': '/groupBuying/main',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.main.states'
        },{
            'stateName': 'groupBuying-rule',
            'urlPrefix': '/groupBuying/rule',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.rule.states'
        },{
            'stateName': 'groupBuying-foreshow',
            'urlPrefix': '/groupBuying/foreshow',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.foreshow.states'
        },{
            'stateName': 'groupBuying-product',
            'urlPrefix': '/groupBuying/product',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.product.states'
        },{
            'stateName': 'groupBuying-orderConfirm',
            'urlPrefix': '/groupBuying/orderConfirm',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.orderConfirm.states'
        },{
            'stateName': 'groupBuying-myOrder',
            'urlPrefix': '/groupBuying/myOrder',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.myOrder.states'
        }, {
            'stateName': 'groupBuying-myOrder-all',
            'urlPrefix': '/groupBuying/myOrder/all',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.myOrder.states'
        }, {
            'stateName': 'groupBuying-myOrder-waitPay',
            'urlPrefix': '/groupBuying/myOrder/waitPay',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.myOrder.states'
        }, {
            'stateName': 'groupBuying-myOrder-deal',
            'urlPrefix': '/groupBuying/myOrder/deal',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.myOrder.states'
        }, {
            'stateName': 'groupBuying-myOrder-deliver',
            'urlPrefix': '/groupBuying/myOrder/deliver',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.myOrder.states'
        }, {
            'stateName': 'groupBuying-myOrder-receive',
            'urlPrefix': '/groupBuying/myOrder/receive',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.myOrder.states'
        }, {
            'stateName': 'groupBuying-details',
            'urlPrefix': '/groupBuying/details',
            'type': 'ocLazyLoad',
            'module': 'screens.groupBuying.details.states'
        }]
    };

});
