/**
 * states - overload
 * @create 2015/01/03
 * @author guosheng.zhangs
 */
define([
    'text!screens/error/views/overload-tpl.html',
    'angular',
    'ui-router',
    'screens/error/view-models/overload-ctrl'
], function (overloadTpl, angular) {

    'use strict';

    angular
        .module('screens.error.overload.states', [
            'ui.router',
            'screens.error'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('error-overload', {
                    url: '/error/overload?redirect',
                    spmb: 'error-overload',
                    title: '零零期',
                    controller: 'OverloadCtrl',
                    templateUrl: 'screens/error/views/overload-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/error/views/overload-tpl.html', overloadTpl);
        }]);

});
