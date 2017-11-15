/**
 * splash service
 * @create 2015/01/20
 * @author zhaxi
 */
define([
  'angular',
  'text!services/splash/views/splash-container-tpl.html',
  'text!services/splash/views/splash-content-tpl.html',
  'text!services/splash/views/cut-scenes-container-tpl.html',
  'text!services/splash/views/cut-scenes-content-tpl.html',
  'services/modal/modal'
], function(
  angular,
  splashContainerTpl,
  splashContentTpl,
  cutScenesContainerTpl,
  cutScenesContenntTpl
) {

  'use strict';

  angular
      .module('services.splash', ['ui.bootstrap.modal'])
      .controller('splashCtrl', splashCtrl)
      .service('splash', splashService)
      .run(['$templateCache', function ($templateCache) {
        $templateCache.put('services/splash/views/splash-container-tpl.html', splashContainerTpl);
        $templateCache.put('services/splash/views/splash-content-tpl.html', splashContentTpl);
        $templateCache.put('services/splash/views/cut-scenes-container-tpl.html', cutScenesContainerTpl);
        $templateCache.put('services/splash/views/cut-scenes-content-tpl.html', cutScenesContenntTpl);
      }]);

  ////////
  splashCtrl.$inject = ['$scope', '$timeout'];
  function splashCtrl($scope, $timeout) {
    var vm = $scope;
    /**
     * Triggered by app splash ng-init
     * @return {[type]} [description]
     */
    vm.boot = function() {
      $timeout(vm.$close, 1300);
    };
    /**
     * Triggered by cutScenes ng-init
     */
    vm.cutScenes = function() {
      $timeout(vm.$close, 1000);
    };
  }

  splashService.$inject = ['$modal'];

  function splashService($modal) {
    return {
      /**
       * App boot splash service
       */
      boot: function (opts) {
        opts = angular.extend(opts || {}, {
          backdrop: false,
          controller: 'splashCtrl',
          templateUrl: 'services/splash/views/splash-content-tpl.html',
          windowTemplateUrl: 'services/splash/views/splash-container-tpl.html'
        });
        return $modal.open(opts);
      },
      /**
       * Screens cut scenes service
       */
      cutScenes: function(opts) {
        opts = angular.extend(opts || {}, {
          backdrop: false,
          controller: 'splashCtrl',
          templateUrl: 'services/splash/views/cut-scenes-content-tpl.html',
          windowTemplateUrl: 'services/splash/views/cut-scenes-container-tpl.html'
        });
        return $modal.open(opts);
      }
    };
  }

});