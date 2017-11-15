/**
 * screens - rechargeGame
 * @create 2017/05/25
 * @author dxw
 */
define([
    'angular',
    'services/filters/filters',
    'angular-carousel',
    'components/dropdown/directives/dropdown',
    'components/scroll-loader/directives/scroll-loader',
    'components/pull-to-refresh/directives/pull-to-refresh',
    'components/duplex-select-panel/directives/duplex-select-panel'
], function (angular) {

    'use strict';

    return angular
        .module('screens.rechargeGame', [
            'ngLoadingOverlay',
            'services.filters',
            'angular-carousel',
            'components.dropdown',
            'components.scrollLoader',
            'components.pullToRefresh',
            'components.duplexSelectPanel'
        ]);

});