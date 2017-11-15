define([
    'angular',
    'text!screens/mobileTribe/views/main-tpl.html',

    'ui-router',

    'screens/mobileTribe/module',
    'screens/mobileTribe/view-models/main-ctrl'

], function(
    angular,
    mainTpl
) {
    'use strict';

    angular
        .module('screens.mobileTribe.main.states', [
            'ui.router',
            'screens.mobileTribe'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('mobileTribe-main', {
                    url: '/mobileTribe/main',
                    spmb:'mobileTribe-main',
                    title: '零零期',
                    controller: 'mobileTribeMainCtrl',
                    templateUrl: 'screens/mobileTribe/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/mobileTribe/views/main-tpl.html', mainTpl);
        }]);
});