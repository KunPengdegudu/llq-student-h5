define([
  'angular',
  'fastclick',
  'app/family/error/screens-conf',
  'services/utils/constant',
  'services/route-helper/ui-route-helper',
  'services/exception-handler/exception-handler',
  'components/route-tabs/directives/route-tabs',
  'components/custom-head/directives/custom-head-ui-route'
], function(angular, fastclick, screensConf) {

  'use strict';

  angular
      .module('error-webApp', [
        'services.constant',
        'services.exception',
        'services.ui-route-helper',
        'components.routeTabs',
        'components.customHead'
      ])
      .controller('AppCtrl', AppCtrl)
      .config(appConfig)
      .run(function() {
        // attach fastclick
        fastclick.attach(document.body);
      });

  AppCtrl.$inject = ['$scope'];

  function AppCtrl($scope) {
    $scope.configs = screensConf.navConf;
  }

  appConfig.$inject = [
    '$injector',
    'customHeadProvider',
    'lazyloadRouteProvider',
    'exceptionHandlerProvider'
  ];

  function appConfig(
    $injector,
    customHeadProvider,
    lazyloadRouteProvider,
    exceptionHandlerProvider
  ) {
    // custom-head配置
    customHeadProvider.configure(screensConf);
    // exception handler配置
    exceptionHandlerProvider.configure('error-webApp error-> ');
    // 路由配置
    lazyloadRouteProvider.configure($injector, 'error-webApp', screensConf);
  }

});
