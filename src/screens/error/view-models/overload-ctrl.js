/**
 * screens - overload
 * @create 2015/01/03
 * @author guosheng.zhangs
 */
define(['screens/error/module'], function(module) {

  'use strict';

  module.controller('OverloadCtrl', OverloadCtrl);

  OverloadCtrl.$inject = [
    '$scope',
    '$stateParams',
    '$location',
    'exceptionHandler'
  ];
  function OverloadCtrl($scope, $stateParams, $location, exceptionHandler) {
    var redirect = $stateParams.redirect ? window.decodeURIComponent($stateParams.redirect): '/';
    try {
      exceptionHandler.send({
        category: 'ERROR',
        msg: 'error-overload, redirect = ' + redirect,
        sampling: 1
      });
    }catch(e){
      console.log('error', e);
    }

    $scope.retry = function() {
      if (/^http(s)?:\/\//.test(redirect)) {
        window.location.href = redirect;
      } else {
        $location.url(redirect);
      }
    };
  }

});
