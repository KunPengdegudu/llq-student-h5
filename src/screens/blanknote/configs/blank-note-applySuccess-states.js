define([
    'angular',
    'text!screens/blanknote/views/applySuccess-tpl.html',

    'ui-router',

    'screens/blanknote/module',
    'screens/blanknote/view-models/applySuccess-ctrl'

], function(
    angular,
    applySuccessTpl
) {
    'use strict';

    angular
        .module('screens.blanknote.applySuccess.states', [
            'ui.router',
            'screens.blanknote'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('blanknote-applySuccess', {
                    url: '/blanknote/applySuccess?money&time',
                    title: '零零期-白条',
                    controller: 'BlankNoteApplySuccess',
                    templateUrl: 'screens/blanknote/views/applySuccess-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/blanknote/views/applySuccess-tpl.html', applySuccessTpl);
        }]);
});
