define(['angular', 'iscroll'], function (angular, iscroll) {

  'use strict';

  angular.module('ng-iscroll', []).directive('ngIscroll', ['$rootScope', function ($rootScope) {
    return {
      replace: false,
      restrict: 'A',
      link: function (scope, element, attr) {
        // default timeout
        var ngiScroll_timeout = 5;

        // default options
        var ngiScroll_opts = {
          snap: true,
          momentum: true,
          hScrollbar: false,
          onScrollStart: function(){},
          onScroll: function() {},
          onScrollEnd: function(){}
        };

        // scroll key /id
        var scroll_key = attr.ngIscroll;

        if (scroll_key === '') {
          scroll_key = attr.id;
        }

        // if ng-iscroll-form='true' then the additional settings will be supported
        if (attr.ngIscrollForm !== undefined && attr.ngIscrollForm == 'true') {
          ngiScroll_opts.useTransform = false;
          ngiScroll_opts.onBeforeScrollStart = function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
              e.preventDefault();
          };
        }

        if (scope.myScrollOptions) {
          for (var i in scope.myScrollOptions) {
            if (i === scroll_key) {
              for (var k in scope.myScrollOptions[i]) {
                ngiScroll_opts[k] = scope.myScrollOptions[i][k];
              }
            } else {
              ngiScroll_opts[i] = scope.myScrollOptions[i];
            }
          }
        } else {
        }

        /**
         * safeApply
         */
        function safeApply(fn) {
          var phase = $rootScope.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            fn();
          } else {
            /**
             * 使用evalAsync在处理滚动事件的时候，效率会远高于apply
             * 因为不会重新digest函数队列
             */
            scope.$evalAsync(fn);
          }
        }

        // iScroll initialize function
        function setScroll () {
          if (scope.myScroll === undefined) {
            scope.myScroll = [];
          }

          scope.myScroll[scroll_key] = new IScroll(element[0], ngiScroll_opts);

          scope.myScroll[scroll_key].on('beforeScrollStart', function(){
            scope.myScroll[scroll_key].refresh();
            safeApply(ngiScroll_opts.onScrollStart);
          });

          scope.myScroll[scroll_key].on('scroll', function(){
            safeApply(ngiScroll_opts.onScroll);
          });

          scope.myScroll[scroll_key].on('scrollEnd', function(){
            safeApply(ngiScroll_opts.onScrollEnd);
          });
        }

        // new specific setting for setting timeout using: ng-iscroll-timeout='{val}'
        if (attr.ngIscrollDelay !== undefined) {
          ngiScroll_timeout = attr.ngIscrollDelay;
        }

        // watch for 'ng-iscroll' directive in html code
        scope.$watch(attr.ngIscroll, function () {
          setTimeout(setScroll, ngiScroll_timeout);
        });

        // add ng-iscroll-refresher for watching dynamic content inside iscroll
        if (attr.ngIscrollRefresher !== undefined) {
          scope.$watch(attr.ngIscrollRefresher, function () {
            if (scope.myScroll[scroll_key] !== undefined) scope.myScroll[scroll_key].refresh();
          });
        }

        scope.$watch('myScrollOptions', function(){
          if(scope.myScroll && scope.myScroll[scroll_key]){
            scope.myScroll[scroll_key].destroy();
            setScroll();
          }

        });

        scope.$on('$destroy', function(){
          scope.myScroll[scroll_key].destroy();
          scope.myScroll[scroll_key] = null;
        });
      }
    };

  }]);
});