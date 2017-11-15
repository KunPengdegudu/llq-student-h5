/**
 * states - 404
 * @create 2015/01/03
 * @author guosheng.zhangs
 */
define([
    'text!screens/error/views/404-tpl.html',
    'angular',
    'ui-router'
], function (error404Tpl, angular) {

    'use strict';

    angular
        .module('screens.error.404.states', [
            'ui.router'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('error-404', {
                    url: '/error/404',
                    spmb: 'error-404',
                    title: '零零期',
                    templateUrl: 'screens/error/views/404-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/error/views/404-tpl.html', error404Tpl);
        }]);

});
