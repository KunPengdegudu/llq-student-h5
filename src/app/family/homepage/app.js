define([
    'angular',
    'fastclick',
    'jq',
    'app/family/homepage/screens-conf',
    'services/splash/splash',
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
    'components/address/directives/address',
    'components/active-goods-inline/directives/active-goods-inline'
], function (angular, fastclick, jq, screensConf) {

    'use strict';

    angular
        .module('homepage-webApp', [
            'services.splash',
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
            'components.address',
            'components.activeGoodsInline'
        ])
        .controller('AppCtrl', App)
        .config(appConfig)
        .run(appRun);

    ////////
    App.$inject = ['$scope'];

    function App($scope) {
        $scope.configs = screensConf.navConf;
    }

    appConfig.$inject = [
        '$injector',
        '$httpProvider',
        'customHeadProvider',
        'lazyloadRouteProvider',
        'exceptionHandlerProvider'
    ];

    function appConfig($injector,
                       $httpProvider,
                       customHeadProvider,
                       lazyloadRouteProvider,
                       exceptionHandlerProvider) {
        // custom-head配置
        customHeadProvider.configure(screensConf);
        // 设置http拦截器
        $httpProvider.interceptors.push('httpInterceptor');
        // exception handler配置
        exceptionHandlerProvider.configure('homepage-webApp error-> ');
        // 路由配置
        lazyloadRouteProvider.configure($injector, 'homepage-webApp', screensConf);
    }

    appRun.$inject = ['$location', 'splash', 'settingCache', 'CONSTANT', 'CONSTANT_UTILS'];
    function appRun($location, splash, settingCache, constant, utils) {
        // attach fastclick
        fastclick.attach(document.body);

        // 检查新版本
        utils.checkAndUpdate();

        // 设置设备信息到body
        setDeviceInfo();

        if ('' !== screensConf.introKey
            && '' !== screensConf.introPoint
            && !settingCache.get(screensConf.introKey)
        ) {
            settingCache.set(screensConf.introKey, true);
            $location.path(screensConf.introPoint);
        }
    }

    function setDeviceInfo() {
        var appCss = ["phone", "tablet", "ios", "android"],
            body = jq("body"),
            cls = "";

        for (var i = 0; i < appCss.length; i++) {
            if (jq.os[appCss[i]]) {
                cls = cls + appCss[i] + " ";
            }
        }

        var deviceType = (jq.os.ios) ? "ios" : (jq.os.android) ? "android" : "ver",
            deviceVersion = parseInt(jq.os.version);

        cls = cls + deviceType + deviceVersion;
        if (jq.os.ios && deviceVersion >= 7) {
            cls = cls + " ios-has-head";
        }
        if (jq.os.ios && deviceVersion < 9) {
            cls = cls + " ios-overflow-scrolling-bug-fix";
        }

        body.addClass(cls);
    }
});