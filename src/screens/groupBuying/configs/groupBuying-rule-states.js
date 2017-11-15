/**
 * Created by fionaqin on 2017/8/23.
 */
define([
    'angular',
    'text!screens/groupBuying/views/rule-tpl.html',

    'ui-router',

    'screens/groupBuying/module',
    'screens/groupBuying/view-models/rule-ctrl'

], function (angular,
             groupBuyingRuleTpl) {
    'use strict';

    angular
        .module('screens.groupBuying.rule.states', [
            'ui.router',
            'screens.groupBuying'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
            // 我的-帮助中心
                .state('groupBuying-rule', {
                    url: '/groupBuying/rule',
                    spmb: 'groupBuying-rule',
                    title: '零零期-拼团玩法',
                    controller: 'groupBuyingRuleCtrl',
                    templateUrl: 'screens/groupBuying/views/rule-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/groupBuying/views/rule-tpl.html', groupBuyingRuleTpl);
        }]);
});