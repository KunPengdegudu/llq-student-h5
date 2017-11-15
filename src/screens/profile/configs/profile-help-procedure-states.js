define([
    'angular',
    'text!screens/profile/views/help-procedure-tpl.html',

    'ui-router',

    'screens/profile/module',
    'screens/profile/view-models/help-procedure-ctrl'

], function (angular,
             profileHelpProcedureTpl) {
    'use strict';

    angular
        .module('screens.profile.help.procedure.states', [
            'ui.router',
            'screens.profile'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 我的-个人中心-绑定手机号
                .state('profile-help-procedure', {
                    url: '/profile/help/procedure',
                    spmb: 'profile-help-procedure',
                    title: '零零期-我的-帮助中心-购物流程',
                    controller: 'ProfileHelpProcedureCtrl',
                    templateUrl: 'screens/profile/views/help-procedure-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/profile/views/help-procedure-tpl.html', profileHelpProcedureTpl);
        }]);
});