/**
 * pull to refresh directive with hammer
 * @create 2014/12/16
 * @author zhaxi
 * @update 2015/01/08
 * @author zhaxi
 * @update 2015/01/12
 * @author zhaxi
 * @example
 * <elment pull-to-refresh on-refresh="xx"></element>
 * @param on-refresh - pull-to-refresh will trigger connected func
 */
define([
  'angular',
  'text!components/pull-to-refresh/views/pull-to-refresh-tpl.html'
  ], function(angular, pullToRefreshTpl) {

  'use strict';

  angular
      .module('components.pullToRefresh', [])
      .constant('pullToRefreshConfig', {
        distanceToRefresh : 70,
        maxSlideDistance  : 100,
        maxDetectDistance : 300
      })
      .directive('pullToRefresh', pullToRefreshDirective)
      .run(['$templateCache', function($templateCache) {
        $templateCache.put('components/pull-to-refresh/views/pull-to-refresh-tpl.html', pullToRefreshTpl);
      }]);

  ////////
  pullToRefreshDirective.$inject = [
    '$compile',
    '$timeout',
    '$q',
    'pullToRefreshConfig'
  ];
  function pullToRefreshDirective($compile, $timeout, $q, pullToRefreshConfig) {
    return {
      scope: {
        reload : '&onRefresh'
      },
      restrict: 'A',
      transclude: true,
      replace: true,
      templateUrl: function($element, $attribute) {
        return $attribute.templateUrl;
      },
      link: function($scope, $element, $attribute) {
        //scope related
        var vm = $scope;
        vm.ptrStatus = '';
        vm.$on('$destroy', function() {
          $element.unbind('touchstart');
          $element.unbind('touchmove');
          $element.unbind('touchend');
        });

        //save essential info of finger touch
        var refreshDataset = {
          status: 'idle', //four status: idle, dragging-down, loading & reseting
          distance: 0,
          startingPositionY: 0
        };

        // elems related
        var refreshElem = angular.element(document.querySelector('.pull-to-refresh'));
        var scrollElem = angular.element(document.body);
        // check scroll contetn id validilty
        if ($attribute.scrollContentId) {
          if (true === new RegExp('#-?[_a-zA-Z]+[_a-zA-Z0-9-]').test($attribute.scrollContentId)) {
            scrollElem = angular.element(document.querySelector($attribute.scrollContentId));
          } else {
            // console.log('scrollContentId is not valid.');
          }
        }
        // touchstart event
        $element.bind('touchstart', function(evt) {
          if (0 === scrollElem[0].scrollTop
              && 'loading' !== refreshDataset.status
              && 'reseting' !== refreshDataset.status
          ) {
            refreshDataset.enabled = true;
            refreshDataset.startingPositionY = evt.changedTouches[0].clientY;
          }
        });

        // touchmove event
        $element.bind('touchmove', function(evt) {
          if (0 !== scrollElem[0].scrollTop
              || 'loading' === refreshDataset.status
              || 'reseting' === refreshDataset.status
          ) {
            // android compatibility
            $element.triggerHandler('touchend');
            return;
          }
          var touchDistanceY = evt.changedTouches[0].clientY - refreshDataset.startingPositionY;
          if (touchDistanceY <= 0) {
            $element.triggerHandler('touchend');
            return;
          } else {
            evt.preventDefault();
            refreshDataset.status = 'dragging-down';
            // using the elliptical formula to achieve redardent feeling
            // @author zhaxi
            refreshDataset.distance = pullToRefreshConfig.maxSlideDistance * Math.sqrt(
                1 - Math.pow((touchDistanceY / pullToRefreshConfig.maxDetectDistance - 1), 2));

            refreshElem.css('transform',
                'translate3d( 0, ' + (touchDistanceY > pullToRefreshConfig.maxDetectDistance ? pullToRefreshConfig.maxSlideDistance : refreshDataset.distance) + 'px, 0 )');
            refreshElem.css('-webkit-transform',
                'translate3d( 0, ' + (touchDistanceY > pullToRefreshConfig.maxDetectDistance ? pullToRefreshConfig.maxSlideDistance : refreshDataset.distance) + 'px, 0 )');

            if (refreshDataset.distance > pullToRefreshConfig.distanceToRefresh) {
              refreshElem.addClass('ptr-refresh');
            } else {
              refreshElem.removeClass('ptr-refresh');
            }
          }
        });

        // touchend event
        $element.bind('touchend', function(evt) {
          if (0 !== scrollElem[0].scrollTop
              || 'reseting' === refreshDataset.status
              || 'loading' === refreshDataset.status
              || 'reseting' === refreshDataset.status
          ) {
            return;
          }
          refreshElem.css('transform', '');
          refreshElem.css('-webkit-transform', '');

          if (refreshElem.hasClass('ptr-refresh')) {
            _reload();
          } else {
            _reset();
          }
        });

        /**
         * Reload func triggered when reloading
         */
        function _reload() {
          refreshDataset.status = 'loading';
          refreshElem.addClass('ptr-loading');

          vm.reload().then($timeout(_reset,1000));
        }

        /**
         * Reset func triggered when reseting
         */
        function _reset() {
          refreshDataset.status = 'reseting';
          refreshElem.removeClass('ptr-loading');
          refreshElem.removeClass('ptr-refresh');
          refreshElem.addClass('ptr-reset');

          // transitionend couldn't trigger on uc mobile browser, use timeout instead
          // @author zhaxi
          // refreshElem.on('transitionend', _effectReset);
          // refreshElem.on('webkitTransitionEnd', _effectReset);

          $timeout(_effectReset, 250);
        }

        /**
         * Remove reset effect & restore pull-to-refresh status
         */
        function _effectReset() {
          refreshElem.removeClass('ptr-reset');
          // refreshElem.off('transitionend', _effectReset);
          // refreshElem.off('webkitTransitionEnd', _effectReset);
          refreshDataset.status = 'idle';
        }
      }
    };
  }
});
