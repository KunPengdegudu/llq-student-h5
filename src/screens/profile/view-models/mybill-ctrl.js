/**
 * profile my bill controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileMyBillCtrl', ProfileMyBill);

    ////////
    ProfileMyBill.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileMyBill($rootScope, $scope, $location, httpRequest, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "我的账单",
                isShow: true
            }, $location);
        }

        // top menu configs
        vm.configs = {
            'signIn': [{'entryUrl': '/login'}],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [
                {
                    'entryUrl': '/profile/mybill/billcurrent',
                    'activeReg': '/profile/mybill/billcurrent($|/*)',
                    'text': '本期账单'
                },
                {
                    'entryUrl': '/profile/mybill/billnext',
                    'activeReg': '/profile/mybill/billnext($|/*)',
                    'text': '往期账单'
                }]
        };
        vm.applyBotGotto = function () {
            var url = utils.getUrlWithParams('security/main/bankWithhold', {
                goBack: 'profile/mybill/billcurrent'
            });
            utils.gotoUrl(url);
        }
        function init() {
            vm.imgSrc = '../../../app/assets/imgs/security/autoDeduct.png';
            httpRequest.getReq(urlHelper.getUrl('isAutoRepay'))
                .then(function (d) {
                    if (d) {
                        vm.imgSrc = '../../../app/assets/imgs/security/unAutoDeduc.png';
                    }
                })
        }

        init();

    }

});