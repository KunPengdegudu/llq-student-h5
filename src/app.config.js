/**
 * requirejs配置
 * @auth guosheng.zhangs
 */

define(function () {
    'use strict';

    // require抛出错误
    if (typeof requirejs === 'function') {
        requirejs.onError = function (err) {
            console.log(err.requireType);
            console.log('message:' + err.message + 'modules: ' + err.requireModules);
            throw err;
        };
    }

    requirejs.config({
        // baseUrl: window.__baseUrl__ ? window.__baseUrl__ : '.',
        // config.urlArgs = 'bust=v0.4.0', // set cache beater
        paths: {
            'angular': 'vendors/angular',
            'ui-router': 'vendors/angular',
            'ui-router-extras': 'vendors/angular',
            'oc-lazyLoad': 'vendors/angular',
            'moment': 'vendors/util',
            'lodash': 'vendors/util',
            'iscroll': 'vendors/util',
            'fastclick': 'vendors/util',
            'hammerjs': 'vendors/util',
            'text': 'vendors/util',
            'angular-aria': 'vendors/optional',
            'angular-animate': 'vendors/angular',

            'angular-touch': 'vendors/angular',
            'angular-carousel': 'vendors/carousel',
            'angular-loading-overlay': 'vendors/angular',

            'angular-sanitize': 'vendors/angular',

            'storex': 'app.config',
            'qrcode': 'libs/qrcode',
            'jsencrypt': 'libs/jsencrypt',
            'jq': 'libs/jq',
            'hammer': 'libs/jq',

            'chart': 'libs/chart'

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
