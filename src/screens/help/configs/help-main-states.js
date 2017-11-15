define([
    'angular',
    'text!screens/profile/views/help-tpl.html',

    'ui-router',

    'screens/help/module',
    'screens/help/view-models/main-ctrl'

], function(
    angular,
    mainTpl
) {
    'use strict';

    angular
        .module('screens.help.main.states', [
            'ui.router',
            'screens.help'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('help-main', {
                    url: '/help/main',
                    spmb:'help-main',
                    title: '零零期',
                    controller: 'HelpMainCtrl',
                    templateUrl: 'screens/profile/views/help-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/profile/views/help-tpl.html', mainTpl);
        }]);
});