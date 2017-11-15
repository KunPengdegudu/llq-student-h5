/**
 * security main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/security/module',
    'screens/security/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('SecurityMainCtrl', SecurityMain);

    ////////
    SecurityMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        '$interval',
        'httpRequest',
        '$loadingOverlay',
        'securityUrlHelper',
        'CONSTANT_UTILS'
    ];

    function SecurityMain($rootScope, $scope, $location, $q, $interval, httpRequest, $loadingOverlay, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "安全中心",
                isShowRightBtn: true,
                rightBtnType: 'icon',
                rightBtnAttrs: {
                    icon: 'icon-service',
                    fn: function () {
                        utils.contactUs();
                    }
                },
                isShow: true
            }, $location);
        }
        vm.emailStatus = false;
        vm.userDormStatus = false;

        vm.userDorm = {};

        vm.gotoUrl = gotoUrl;

        function gotoUrl(redirect) {
            utils.gotoUrl(redirect);
        }

        vm.loginPassword = function () {
            utils.gotoUrl('/security/main/loginPassword')
        };

        vm.doResetPayPassword = function () {
            if (vm.resetPayPassword) {
                vm.resetPayPassword.openDialog();
            } else {

            }
        };

        vm.payPassword = function () {
            utils.gotoUrl('/security/main/payPassword')
        };
        vm.confirmPhone = function () {
            utils.gotoUrl('/security/main/confirmPhone')
        };
        vm.confirmEmail = function () {
            utils.gotoUrl('/security/main/confirmEmail')
        };
        vm.gotoBankWithhold = function () {
            var url = utils.getUrlWithParams('security/main/bankWithhold', {
                goBack: '/security/main'
            });
            utils.gotoUrl(url);
        };

        vm.showContactUs = true;

        // bindPhone
        vm.bindPhone = {
            status: false
        };


        function getAttach() {

            httpRequest.getReq(urlHelper.getUrl('getAttach'))
                .then(function (d) {
                    if (d) {
                        if (d.msgPhone && d.msgPhone.status) {
                            vm.bindPhone.status = true;
                        }
                    }
                });

        }

        function getEmail() {
            httpRequest.getReq(urlHelper.getUrl('userEmailGet'))
                .then(function (d) {
                    if (d) {
                        vm.emailStatus = true;
                    } else {
                        vm.emailStatus = false;
                    }
                })
        }

        vm.applyBot = function () {
            httpRequest.getReq(urlHelper.getUrl('isAutoRepay'))
                .then(function (d) {
                    vm.applyBotInfo = d;
                })
        }

        function init() {
            getAttach();
            getEmail();
            vm.applyBot();
        }


        init();


    }

});