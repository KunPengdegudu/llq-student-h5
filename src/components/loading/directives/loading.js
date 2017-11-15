define([
  'angular',
  'text!components/loading/views/loading-tpl.html'
], function(angular, loadingTpl) {
  'use strict';

  angular.module('components.loading', [])
      .directive('loading', loadingDirective)
      .run(['$templateCache', function ($templateCache) {
        $templateCache.put('components/loading/views/loading-tpl.html', loadingTpl);
      }]);

  loadingDirective.$inject = [
    '$rootScope',
    '$timeout'
  ];
  function loadingDirective () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'components/loading/views/loading-tpl.html'
    }
  }
});