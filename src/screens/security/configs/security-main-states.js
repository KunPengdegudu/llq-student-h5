define([
    'angular',
    'text!screens/security/views/main-tpl.html',

    'ui-router',

    'screens/security/module',
    'screens/security/view-models/main-ctrl'

], function(
    angular,
    mainTpl
) {
    'use strict';

    angular
        .module('screens.security.main.states', [
            'ui.router',
            'screens.security'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 零零期-安全中心
                .state('security-main', {
                    url: '/security/main',
                    spmb:'security-main',
                    title: '零零期-安全中心',
                    controller: 'SecurityMainCtrl',
                    templateUrl: 'screens/security/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/security/views/main-tpl.html', mainTpl);
        }]);
});