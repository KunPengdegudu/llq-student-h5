/**
 * screens - sale
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'angular',
    'services/filters/filters',
    'components/dropdown/directives/dropdown',
    'components/scroll-loader/directives/scroll-loader',
    'components/pull-to-refresh/directives/pull-to-refresh',
    'components/duplex-select-panel/directives/duplex-select-panel'
], function (angular) {

    'use strict';

    return angular
        .module('screens.help', [
            'services.filters',
            'components.dropdown',
            'components.scrollLoader',
            'components.pullToRefresh',
            'components.duplexSelectPanel'
        ]);

});