/**
 * component: ngTranscludeReplace based on original ngTransclude
 * @create  2014/12/17
 * @author  zhaxi
 */
define(['angular'], function(angular) {

  'use strict';

  angular
      .module('components.ngTranscludeReplace', [])
      .directive('ngTranscludeReplace', TranscludeReplace);

  ////////
  TranscludeReplace.$inject =['$log'];

  function TranscludeReplace($log) {
    return {
      terminal: true,
      restrict: 'EAC',
      link: function ($scope, $element, $attr, controller, $transclude) {
        if (!$transclude) {
          // original error info
          $log.error('orphan',
            'Illegal use of ngTransclude directive in the template! ' +
            'No parent directive that requires a transclusion found.'
          );
          return;
        }
        $transclude(function (clone) {
          if (clone.length) {
            $element.replaceWith(clone);
          }
          else {
            $element.remove();
          }
        });
      }
    };
  }

});
