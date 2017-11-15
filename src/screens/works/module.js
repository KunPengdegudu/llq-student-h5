/**
 * screens - works
 * @create 2015/12/30
 * @author D.xw
 */
define([
    'angular',
    'services/filters/filters',
    'angular-carousel',
    'angular-loading-overlay',
    'components/dropdown/directives/dropdown',
    'components/scroll-loader/directives/scroll-loader',
    'components/pull-to-refresh/directives/pull-to-refresh',
    'components/duplex-select-panel/directives/duplex-select-panel',
    'components/ng-iscroll/directives/ng-iscroll'
], function (angular) {

    'use strict';

    return angular
        .module('screens.works', [
            'services.filters',
            'angular-carousel',
            'ngLoadingOverlay',
            'components.dropdown',
            'components.scrollLoader',
            'components.pullToRefresh',
            'components.duplexSelectPanel',
            'ng-iscroll'
        ]);

});