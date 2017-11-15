/**
 * screens - error
 * @create 2015/01/06
 * @author guosheng.zhangs
 * @update 2015/01/14
 * @author zhaxi
 */
define([
  'angular',
  'services/exception-handler/exception-handler'
], function (angular) {

  'use strict';

  return angular
             .module('screens.error', ['services.exception']);

});
