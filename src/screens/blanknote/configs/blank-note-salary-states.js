define([
    'angular',
    'text!screens/blanknote/views/salary-tpl.html',

    'ui-router',

    'screens/blanknote/module',
    'screens/blanknote/view-models/salary-ctrl'

], function(
    angular,
    salaryTpl
) {
    'use strict';

    angular
        .module('screens.blanknote.salary.states', [
            'ui.router',
            'screens.blanknote'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 圆梦贷款-预付工资
                .state('blanknote-salary', {
                    url: '/blanknote/salary',
                    title: '零零期-白条',
                    controller: 'BlankNoteSalaryCtrl',
                    templateUrl: 'screens/blanknote/views/salary-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/blanknote/views/salary-tpl.html', salaryTpl);
        }]);
});
