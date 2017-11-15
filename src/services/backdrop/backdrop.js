/**
 * backdrop: 图层蒙版
 * @create 2014/12/18
 * @author guosheng.zhangs
 * service 方法注释：
 * @service newMask: 新建蒙版
 * @service showMask: 显示蒙版
 * @service hideMask: 隐藏蒙版
 * @event backdrop.click 蒙版点击时发送的事件名称, @param 蒙版实例
 */
define(['angular'], function(angular) {
  'use strict';

  angular.module('services.backdrop', [])
    .provider('backdrop', function() {

      /**
       * 蒙版构造函数
       * @param id
       * @param zIndex
       * @param noBgScroll - false:允许背景滚动，否则，禁止背景滚动
       */
      function Backdrop(id, zIndex, noBgScroll) {
        var self = this;
        this.id = id;
        this.zIndex = zIndex;
        this.noBgScroll = noBgScroll !== false;
        this.el = null;
        this.$rootScope = null;
        this.onClick = function() {
          if (self.$rootScope) {
            self.$rootScope.$emit('backdrop.click', self);
          }
        };

        /**
         * 阻止默认事件
         */
        this.preventDefaultEvent = function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.returnValue = false;
        };

        this.getMaskNode = function($document) {
          var e = angular.element(document.querySelector('#' + this.id));
          if (e.length === 0) {
            $document.find('body').eq(0).append('<div id="' + this.id + '" class="ui-backdrop-mask" />');
            return angular.element(document.querySelector('#' + this.id));
          }
          return e;
        };
      }
      Backdrop.prototype.show = function($document, $rootScope) {
        if (this.el === null) {
          this.el = this.getMaskNode($document);
          this.el.css('z-index', this.zIndex);
        }
        if (this.$rootScope === null) {
          this.$rootScope = $rootScope;
        }
        this.el.removeClass('hide').addClass('show');
        this.el.bind('click', this.onClick);

        if (this.noBgScroll === true && this.checkNoBgScroll !== true) {
          this.el.bind('touchmove', this.preventDefaultEvent);
          this.checkNoBgScroll = true;
        }
      };
      Backdrop.prototype.hide = function() {
        if (this.el !== null) {
          this.el.removeClass('show').addClass('hide');
          this.el.unbind('click', this.onClick);
          if (this.checkNoBgScroll === true) {
            this.el.unbind('touchmove', this.preventDefaultEvent);
            this.checkNoBgScroll = false;
          }
        }
      };
      Backdrop.prototype.remove = function() {
        if (this.el !== null) {
          this.el.unbind('click', this.onClick);
          if (this.checkNoBgScroll === true) {
            this.el.unbind('touchmove', this.preventDefaultEvent);
            this.checkNoBgScroll = false;
          }
          this.el.remove();
          this.el = null;
        }
      };

      var globalId = 0
        , idPrefix = 'ui-backdrop-mask'
        , defaultZIndex = 500
        , defaultBackdrop = new Backdrop(idPrefix+globalId, defaultZIndex);

      this.$get = ['$document', '$rootScope', function($document, $rootScope) {
        return {
          /**
           * 新建蒙版实例
           */
          newMask: function(zIndex, noBgScroll) {
            globalId += 1;
            return new Backdrop(idPrefix + globalId, zIndex || defaultZIndex, noBgScroll);
          },
          /**
           * 显示蒙版，
           * @param maskObj：可选，如果要显示自己new的一个蒙版，则传递该示例；否则，不传的话显示默认的模板
           */
          showMask: function(maskObj) {
            if (maskObj && maskObj instanceof Backdrop) {
              maskObj.show($document, $rootScope);
            } else {
              defaultBackdrop.show($document, $rootScope);
            }
          },
          /**
           * 隐藏蒙版
           * @param maskObj：可选，如果要隐藏自己new的一个蒙版，则传递该实例；否则，不传的话隐藏默认的模板
           */
          hideMask: function(maskObj) {
            if (maskObj && maskObj instanceof Backdrop) {
              maskObj.remove(); // 删除dom节点
            } else {
              defaultBackdrop.hide();
            }
          }
        };
      }];

    });

});
