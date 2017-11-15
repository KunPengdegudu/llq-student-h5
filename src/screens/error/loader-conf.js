/**
 * screens configs -- error
 */
define([], function() {

  'use strict';

  return {
    'lazyloadConf': [{
      'reconfig': true,
      'name': 'screens.error.no-permission.states',
      'files': ['screens/error/configs/no-permission-states']
    }, {
      'reconfig': true,
      'name': 'screens.error.overload.states',
      'files': ['screens/error/configs/overload-states']
    }, {
      'reconfig': true,
      'name': 'screens.error.404.states',
      'files': ['screens/error/configs/404-states']
    }],
    'futureStatesConf': [{
      'stateName': 'error-no-permission',
      'urlPrefix': '/error/nopermission',
      'type': 'ocLazyLoad',
      'module': 'screens.error.no-permission.states'
    }, {
      'stateName': 'error-overload',
      'urlPrefix': '/error/overload',
      'type': 'ocLazyLoad',
      'module': 'screens.error.overload.states'
    }, {
      'stateName': 'error-404',
      'urlPrefix': '/error/404',
      'type': 'ocLazyLoad',
      'module': 'screens.error.404.states'
    }]
  };

});
