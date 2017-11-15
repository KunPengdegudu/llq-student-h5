/**
 * exception handler:
 * 1)JsTracker
 * @create 2014/01/25
 */

define(['angular'], function(angular) {

  'use strict';

  angular
      .module('services.exception', [])
      .provider('exceptionHandler', exceptionHandlerProvider)
      .config(exceptionConfig);

  ////////
  function exceptionHandlerProvider() {
    if (window.JSTracker){
      JSTracker.config('sampling', 10);
    }
    
    this.config = {
      'appErrorPrefix': undefined // app error prefix
    };

    this.configure = function (appErrorPrefix) {
      this.config.appErrorPrefix = appErrorPrefix;
    };

    this.$get = function() {
      return {
        config: this.config,
        error: error,
        send: send
      };

      ////////
      function error(msg) {
        if (window.JSTracker) {
          window.JSTracker.error(msg);
        }
      }
      function send(obj) {
        if (window.JSTracker) {
          window.JSTracker.send(obj);
        }
      }
    };
  }

  exceptionConfig.$inject = ['$provide'];
  /**
   * Extend exception handler
   */
  function exceptionConfig($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler'];
  /**
   * Send exception log back through jstracker
   */
  function extendExceptionHandler($delegate, exceptionHandler) {
    return function(exception, cause) {
      exception.message = (exceptionHandler.config.appErrorPrefix || '') + exception.message;
      $delegate(exception, cause);
      // var feVer;
      // if (document.getElementsByTagName('script')[0].src.split('sycm-c-phone/')[1]) {
      //   feVer = document.getElementsByTagName('script')[0].src.split('sycm-c-phone/')[1].split('/')[0];
      // }
      // var errorMsg = exception + '     feVer:' + feVer;
      exceptionHandler.error(exception.stack.substring(150));
      // exceptionHandler.send({msg:errorMsg,category: 'ERROR',sampling:1})
    };
  }

});