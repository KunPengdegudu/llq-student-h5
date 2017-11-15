/**
 * screens - auth
 * @create 2017/03/06
 * @author dxw
 */
define([
    'angular',
    'services/filters/filters',
    'components/dropdown/directives/dropdown',
    'components/scroll-loader/directives/scroll-loader',
    'components/pull-to-refresh/directives/pull-to-refresh',
    'components/duplex-select-panel/directives/duplex-select-panel',
    'components/ng-iscroll/directives/ng-iscroll',
    'components/angular-chart/directives/angular-chart'
], function (angular) {

    'use strict';

    return angular
        .module('screens.auth', [
            'services.filters',
            'components.dropdown',
            'components.scrollLoader',
            'components.pullToRefresh',
            'components.duplexSelectPanel',
            'ng-iscroll',
            'chart.js'
        ]);

});