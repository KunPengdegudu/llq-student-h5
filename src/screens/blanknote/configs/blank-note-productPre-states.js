define([
    'angular',
    'text!screens/blanknote/views/productPre-tpl.html',

    'ui-router',

    'screens/blanknote/module',
    'screens/blanknote/view-models/productPre-ctrl'

], function(
    angular,
    productPreTpl
) {
    'use strict';

    angular
        .module('screens.blanknote.productPre.states', [
            'ui.router',
            'screens.blanknote'
        ])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                // 消息-首页
                .state('blanknote-productPre', {
                    url: '/blanknote/productPre?name&userType&userSource',
                    spmb: 'blanknote-productPre',
                    title: '零零期-白条',
                    controller: 'ProductPreCtrl',
                    templateUrl: 'screens/blanknote/views/productPre-tpl.html'
                });
        }])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('screens/blanknote/views/productPre-tpl.html', productPreTpl);
        }]);
});