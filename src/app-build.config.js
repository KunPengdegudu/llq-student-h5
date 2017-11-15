/**
 * requirejs配置(打包用)
 * @auth guosheng.zhangs
 */

define(function () {
    'use strict';

    requirejs.config({
        // baseUrl: '.',
        // config.urlArgs = 'bust=v0.4.0', // set cache beater
        paths: {
            'angular': '../bower_components/angular/angular.min',
            'ui-router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
            'ui-router-extras': '../bower_components/ui-router-extras/release/ct-ui-router-extras.min',
            'oc-lazyLoad': '../bower_components/oclazyload/dist/ocLazyLoad.min',
            'moment': '../bower_components/moment/min/moment.min',
            'lodash': '../bower_components/lodash/lodash.min',
            'iscroll': '../bower_components/iscroll/build/iscroll-probe',
            'fastclick': '../bower_components/fastclick/lib/fastclick',
            'hammerjs': '../bower_components/hammerjs/hammer.min',
            'text': '../bower_components/requirejs-text/text',

            'angular-aria': '../bower_components/angular-aria/angular-aria.min',
            'angular-animate': '../bower_components/angular-animate/angular-animate.min',
            'angular-touch': '../bower_components/angular-touch/angular-touch.min',
            'angular-carousel': '../bower_components/angular-carousel/dist/angular-carousel.min',
            'angular-loading-overlay': '../bower_components/ng-loading-overlay/src/ng-loading-overlay.min',
            'jq': 'vendors/zepto/1.1.6/zepto',

            'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize.min',
            'angular-mocks': '../bower_components/angular-mocks/angular-mocks',

            'storex': 'libs/storex/storex',
            'hammer': 'libs/hammer-proxy/hammer-proxy',
            'qrcode': 'libs/qrcode/qrcode',

            'jsencrypt': 'libs/jsencrypt/jsencrypt',

            "chart": 'libs/chartjs/Chart'
        },
        shim: {
            'angular': {
                exports: 'angular'
            },
            'ui-router': {
                deps: ['angular']
            },
            'oc-lazyLoad': {
                deps: ['angular']
            },
            'ui-router-extras': {
                deps: ['ui-router']
            },
            'angular-mocks': {
                deps: ['angular']
            },
            'jq': {
                exports: '$'
            },
            'qrcode': {
                exports: 'QRCode'
            },
            'jsencrypt': {
                exports: 'JSEncrypt'
            },
            'lodash': {
                exports: '_'
            },
            'angular-animate': {
                deps: ['angular']
            },
            'angular-aria': {
                deps: ['angular']
            },
            'angular-touch': {
                deps: ['angular']
            },
            'angular-carousel': {
                deps: ['angular', 'angular-touch']
            },
            'angular-loading-overlay': {
                deps: ['angular']
            },
            'angular-sanitize': {
                deps: ['angular']
            }
        }
    });
});
