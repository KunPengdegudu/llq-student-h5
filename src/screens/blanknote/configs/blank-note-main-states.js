define([
    'angular',
    'text!screens/blanknote/views/main-tpl.html',

    'ui-router',

    'screens/blanknote/module',
    'screens/blanknote/view-models/main-ctrl'

], function(
    angular,
    mainTpl
) {
    'use strict';

    angular
        .module('screens.blanknote.main.states', [
            'ui.router',
            'screens.blanknote'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('blanknote-main', {
                    url: '/blanknote/main',
                    spmb: 'blanknote-main',
                    title: '零零期-白条',
                    controller: 'BlankNoteMainCtrl',
                    templateUrl: 'screens/blanknote/views/main-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/blanknote/views/main-tpl.html', mainTpl);
        }]);
});