/**
 * product screens configs
 * @create 2015/07/18
 * @author panwei.pw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.product.detail.states',
            'files': ['screens/product/configs/product-detail-states']
        }, {
            'reconfig': true,
            'name': 'screens.product.orderconfirm.states',
            'files': ['screens/product/configs/product-order-confirm-states']
        }, {
            'reconfig': true,
            'name': 'screens.product.orderdetail.states',
            'files': ['screens/product/configs/product-order-detail-states']
        }, {
            'reconfig': true,
            'name': 'screens.product.car.states',
            'files': ['screens/product/configs/product-car-states']
        }, {
            'reconfig': true,
            'name': 'screens.product.carconfirm.states',
            'files': ['screens/product/configs/product-car-confirm-states']
        }, {
            'reconfig': true,
            'name': 'screens.product.buyNowConfirm.states',
            'files': ['screens/product/configs/product-buyNow-confirm-states']
        }, {
            'reconfig': true,
            'name': 'screens.product.paysuccess.states',
            'files': ['screens/product/configs/product-pay-success-states']
        }, {
            'reconfig': true,
            'name': 'screens.product.assesssuccess.states',
            'files': ['screens/product/configs/product-assess-success-states']
        }, {
            'reconfig': true,
            'name': 'screens.product.noticeInfo.states',
            'files': ['screens/product/configs/product-noticeInfo-states']
        }],
        'futureStatesConf': [{
            'stateName': 'product-detail',
            'urlPrefix': '/product/detail',
            'type': 'ocLazyLoad',
            'module': 'screens.product.detail.states'
        }, {
            'stateName': 'product-order-confirm',
            'urlPrefix': '/product/orderconfirm',
            'type': 'ocLazyLoad',
            'module': 'screens.product.orderconfirm.states'
        }, {
            'stateName': 'product-order-detail',
            'urlPrefix': '/product/orderdetail',
            'type': 'ocLazyLoad',
            'module': 'screens.product.orderdetail.states'
        }, {
            'stateName': 'product-car',
            'urlPrefix': '/product/car',
            'type': 'ocLazyLoad',
            'module': 'screens.product.car.states'
        }, {
            'stateName': 'product-car-confirm',
            'urlPrefix': '/product/carconfirm',
            'type': 'ocLazyLoad',
            'module': 'screens.product.carconfirm.states'
        }, {
            'stateName': 'product-buyNow-confirm',
            'urlPrefix': '/product/buyNowConfirm',
            'type': 'ocLazyLoad',
            'module': 'screens.product.buyNowConfirm.states'
        }, {
            'stateName': 'product-pay-success',
            'urlPrefix': '/product/paysuccess',
            'type': 'ocLazyLoad',
            'module': 'screens.product.paysuccess.states'
        }, {
            'stateName': 'product-assess-success',
            'urlPrefix': '/product/assesssuccess',
            'type': 'ocLazyLoad',
            'module': 'screens.product.assesssuccess.states'
        }, {
            'stateName': 'product-noticeInfo',
            'urlPrefix': '/product/noticeInfo',
            'type': 'ocLazyLoad',
            'module': 'screens.product.noticeInfo.states'
        }]
    };

});
