define([
    'angular',
    'text!screens/newExclusive/views/main-tpl.html',

    'ui-router',

    'screens/newExclusive/module',
    'screens/newExclusive/view-models/main-ctrl'

], function(
    angular,
    mainTpl
) {
    'use strict';

    angular
        .module('screens.newExclusive.main.states', [
            'ui.router',
            'screens.newExclusive'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('newExclusive-main', {
                    url: '/newExclusive/main?feedback',
                    spmb:'newExclusive-main',
                    title: '新人专享',
                    controller: 'newExclusiveMainCtrl',
                    templateUrl: 'screens/newExclusive/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/newExclusive/views/main-tpl.html', mainTpl);
        }]);
});

