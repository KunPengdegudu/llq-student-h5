/**
 * Created by fionaqin on 2017/8/28.
 */
define([
    'screens/groupBuying/module',
    'jq'
], function (module, jq) {

    'use strict';

    module.controller('myOrderCtrl', myOrder);

    ////////
    myOrder.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        'CONSTANT_UTILS'
    ];
    function myOrder($rootScope, $scope, $location, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "我的拼团",
                isShow: true
            }, $location);
        }

        // top menu configs
        vm.configs = {
            'signIn': [{'entryUrl': '/login'}],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [{
                'entryUrl': '/groupBuying/myOrder/all',
                'activeReg': '/groupBuying/myOrder/all($|/*)',
                'text': '全部'
            }, {
                'entryUrl': '/groupBuying/myOrder/waitPay',
                'activeReg': '/groupBuying/myOrder/waitPay($|/*)',
                'text': '待付款'
            }, {
                'entryUrl': '/groupBuying/myOrder/deal',
                'activeReg': '/groupBuying/myOrder/deal($|/*)',
                'text': '拼团中'
            }, {
                'entryUrl': '/groupBuying/myOrder/deliver',
                'activeReg': '/groupBuying/myOrder/deliver($|/*)',
                'text': '待发货'
            }, {
                'entryUrl': '/groupBuying/myOrder/receive',
                'activeReg': '/groupBuying/myOrder/receive($|/*)',
                'text': '待收货'
            }]
        };

        vm.gotoMain = function () {
            utils.gotoUrl('/groupBuying/main');
        }

        vm.backToTop = function () {
            jq('#activeMain').scrollTop(0);
        }
    }

});