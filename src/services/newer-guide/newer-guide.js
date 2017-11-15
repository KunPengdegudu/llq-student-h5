/**
 * newer-guide: 新手指引
 * @create 2015/1/19
 * @author dongjiu
 */
define(['angular', 'services/backdrop/backdrop', 'services/cache/setting-cache'], function(angular) {
  'use strict';

  angular.module('services.newerGuide', ['services.backdrop', 'services.settingCache'])
    .service('newerGuide', ['$rootScope', 'backdrop', 'settingCache', function ($rootScope, backdrop, settingCache) {
      var cacheKey = 'timepicker_isclicked_cache';

      this.getMaskNode = function($document) {
        var e = angular.element(document.querySelector('#' + this.id));
        if (e.length === 0) {
          $document.find('body').eq(0).append('<div id="' + this.id + '" class="timepicker-newerguide-mask" />');
          return angular.element(document.querySelector('#' + this.id));
        }
        return e;
      }

      $rootScope.$on('backdrop.click', function() {
        backdrop.hideMask();
        settingCache.set(cacheKey, '1');
        if (this.el === null) {
          this.el = this.getMaskNode($document);
        }
        this.el.removeClass('show').addClass('hide');
      });

      // newer guide for time picker
      this.timepicker = function() {
        // console.log('this.updown is running...');
        var updownCache = settingCache.get(cacheKey);
        // if not clicked
        if (!updownCache || updownCache == '0') {
          if (this.el === null) {
            this.el = this.getMaskNode($document);
          }
          this.el.removeClass('hide').addClass('show');
          backdrop.showMask();
        }

      };

    }]);

});
