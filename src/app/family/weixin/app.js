define([
    'angular',
    'fastclick',
    'app/family/weixin/screens-conf',
    'services/utils/constant',
    'services/filters/filters',
    'services/utils/class-factory',
    'services/cache/setting-cache',
    'services/network/http-request',
    'services/network/http-interceptor',
    'services/route-helper/ui-route-helper',
    'services/exception-handler/exception-handler',
    'components/ngtoast/directives/ngtoast',
    'components/dialog/directives/dialog',
    'components/route-tabs/directives/route-tabs',
    'components/header-bar/directives/header-bar',
    'components/custom-head/directives/custom-head-ui-route',
    'components/custom-body/directives/custom-body-ui-route',
    'components/multi-attr-picker/directives/multi-attr-picker',
    'components/pay/directives/pay',
    'components/pay-password/directives/pay-password',
    'components/photo-upload/directives/photo-upload',
    'components/sys-notice/directives/sys-notice',
    'components/fly/directives/fly',
    'components/card-manager-ebao/directives/card-manager',
    'components/picture-show/directives/picture-show',
    'components/search-dialog/directives/search-dialog',
    'components/shop-search-dialog/directives/shop-search-dialog',
    'components/share/directives/share',
    'components/address/directives/address'
], function (angular, fastclick, screensConf) {

    'use strict';

    angular
        .module('weixin-webApp', [
            'services.filters',
            'services.constant',
            'services.exception',
            'services.httpRequest',
            'services.classFactory',
            'services.settingCache',
            'services.httpInterceptor',
            'services.ui-route-helper',
            'components.ngToast',
            'components.dialog',
            'components.routeTabs',
            'components.headerBar',
            'components.customHead',
            'components.customBody',
            'components.multiAttrPicker',
            'components.pay',
            'components.payPassword',
            'components.photoUpload',
            'components.sysNotice',
            'components.fly',
            'components.cardManager',
            'components.pictureShow',
            'components.searchDialog',
            'components.shopSearchDialog',
            'components.share',
            'components.address'
        ])
        .controller('WeixinAppCtrl', App)
        .config(appConfig)
        .run(function () {
            // attach fastclick
            fastclick.attach(document.body);
        });

    ////////
    App.$inject = ['$scope'];

    function App($scope) {
        $scope.configs = screensConf.navConf;
    }

    appConfig.$inject = [
        '$injector',
        'customHeadProvider',
        'lazyloadRouteProvider',
        'exceptionHandlerProvider'
    ];

    function appConfig($injector,
                       customHeadProvider,
                       lazyloadRouteProvider,
                       exceptionHandlerProvider) {
        // custom-head配置
        customHeadProvider.configure(screensConf);
        // exception handler配置
        exceptionHandlerProvider.configure('weixin-webApp error-> ');
        // 路由配置
        lazyloadRouteProvider.configure($injector, 'weixin-webApp', screensConf);
    }
});
