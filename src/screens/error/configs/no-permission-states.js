/**
 * states - no-permission
 * @create 2015/01/03
 * @author guosheng.zhangs
 */
define([
    'text!screens/error/views/no-permission-tpl.html',
    'angular',
    'ui-router'
  ], function(noPermissionTpl, angular) {

  'use strict';

  angular
      .module('screens.error.no-permission.states', [
        'ui.router'
      ])
      .config(['$stateProvider', function($stateProvider) {
        $stateProvider
          .state('error-no-permission', {
            url: '/error/nopermission',
            spmb: '7634043',
            title: '零零期',
            templateUrl: 'screens/error/views/no-permission-tpl.html'
          });
      }])
      .run(['$templateCache', function($templateCache) {
        $templateCache.put('screens/error/views/no-permission-tpl.html', noPermissionTpl);
      }]);

});
