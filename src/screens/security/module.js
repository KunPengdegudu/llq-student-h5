/**
 * screens - security
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'angular',
    'services/filters/filters',
    'angular-carousel',
    'components/dropdown/directives/dropdown',
    'components/dropdown/directives/dummy-dropdown',
    'components/scroll-loader/directives/scroll-loader',
    'components/pull-to-refresh/directives/pull-to-refresh',
    'components/duplex-select-panel/directives/duplex-select-panel'
], function (angular) {

    'use strict';

    return angular
        .module('screens.security', [
            'services.filters',
            'angular-carousel',
            'ngLoadingOverlay',
            'components.dropdown',
            'components.dummyDropdown',
            'components.scrollLoader',
            'components.pullToRefresh',
            'components.duplexSelectPanel'
        ]);

});