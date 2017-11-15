/**
 * screens - shopActivity
 * @create 2016/08/28
 * @author D.xw
 */
define([
    'angular',
    'services/filters/filters',
    'angular-loading-overlay',
    'components/dropdown/directives/dropdown',
    'components/scroll-loader/directives/scroll-loader',
    'components/pull-to-refresh/directives/pull-to-refresh',
    'components/duplex-select-panel/directives/duplex-select-panel',
    'components/ng-iscroll/directives/ng-iscroll',
    'components/angular-chart/directives/angular-chart'
], function (angular) {

    'use strict';

    return angular
        .module('screens.shopActivity', [
            'services.filters',
            'ngLoadingOverlay',
            'components.dropdown',
            'components.scrollLoader',
            'components.pullToRefresh',
            'components.duplexSelectPanel',
            'ng-iscroll',
            'chart.js'
        ]);

});