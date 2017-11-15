/**
 * route helper
 * @create 2014/11/24
 * @author zhaxi
 * @update 2015/01/03
 * @summary switched to provider
 * @author guosheng.zhangs
 * @update 2015/01/04
 * @author zhaxi
 * @update 2015/01/14
 * @author zhaxi
 * @summary add state change error handling
 */
define([
  'angular',
  'ui-router',
  'ui-router-extras',
  'oc-lazyLoad'
], function(angular) {

  'use strict';

  angular
    .module('services.ui-route-helper', [
      'ui.router',
      'ct.ui.router.extras',
      'oc.lazyLoad'
    ])
    .provider('lazyloadRoute', lazyloadRouteProvider)
    .run(lazyloadRun);

  ////////
  function lazyloadRouteProvider() {
    var appModuleName, appScreensConf;

    this.$get = function() {
      return {screensConf: appScreensConf};
    };

    this.configure = function($injector, appName, screensConf) {
      appModuleName = appName;
      appScreensConf = screensConf;
      $injector.invoke(lazyloadConfigs);
    };

    lazyloadConfigs.$inject = [
      '$urlRouterProvider',
      '$ocLazyLoadProvider',
      '$futureStateProvider'
    ];

    /**
     * Lazyload Configs
     */
    function lazyloadConfigs(
      $urlRouterProvider,
      $ocLazyLoadProvider,
      $futureStateProvider
    ) {
      // initate entrypoint, homepage config & invalid routes redirect,
      // must be state name not url
      // @author zhaxi
      $urlRouterProvider.otherwise(appScreensConf.entryPoint);

      $ocLazyLoadProvider.config({
        debug: false,
        jsLoader: requirejs,
        loadedModules: [appModuleName],
        modules: appScreensConf.lazyloadConf
      });

      $futureStateProvider.stateFactory('ocLazyLoad', ocLazyLoadStateFactory);
      $futureStateProvider.addResolve(['$injector', function($injector) {
        return $injector.invoke(function() {
          var futureStatesConfLen = appScreensConf.futureStatesConf.length;
          for (var i = 0; i < futureStatesConfLen; ++i) {
            $futureStateProvider.futureState(appScreensConf.futureStatesConf[i]);
          }
        });
      }]);
    }

    ocLazyLoadStateFactory.$inject = [
      '$q',
      '$ocLazyLoad',
      'futureState'
    ];

    /**
     * Lazyload state factory
     */
    function ocLazyLoadStateFactory(
      $q,
      $ocLazyLoad,
      futureState
    ) {
      var deferred = $q.defer();
      $ocLazyLoad.load(futureState.module).then(function() {
        deferred.resolve();
      }, function() {
        deferred.reject();
      });
      return deferred.promise;
    }
  }

  lazyloadRun.$inject = [
    '$rootScope',
    '$state',
    '$timeout',
    'lazyloadRoute'
  ];

  function lazyloadRun($rootScope, $state, $timeout, lazyloadRoute) {
    // state change error handle
    $rootScope.$on('$stateChangeError', function(
      evt,
      toState,
      toParams,
      fromState,
      fromParams,
      error) {
      // if homepage can't be visited, will wait 1000ms to retry
      if (-1 !== lazyloadRoute.screensConf.entryPoint.indexOf(toState.url)) {
        $timeout($state.go(toState.name), 1000);
      }
      var destination = toState.name || 'unknown target';
      // var errorLog = 'Error routing to ' + destination + ': ' + (error.msg || '');
      // console.log(errorLog);
    });
  }

});
