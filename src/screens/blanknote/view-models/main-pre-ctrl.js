define([
    'screens/blanknote/module',
    'jq',
    'screens/blanknote/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('BlankNoteMainCtrl', BlankNoteMain);

    ////////
    BlankNoteMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        'httpRequest',
        'settingCache',
        '$loadingOverlay',
        '$timeout',
        'blankNoteUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function BlankNoteMain($rootScope, $scope, $location, $stateParams, $q, httpRequest, settingCache, $loadingOverlay, $timeout, urlHelper, constant, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/enter/main"
                },
                title: "信用钱包",
                isShow: true,
                isShowRightBtn: false,
                rightBtnType: "icon",
                rightBtnAttrs: {
                    icon: 'icon-help2',
                    fn: loanExplation
                }
            }, $location);
        }

        vm.LHHStatuse = null;
        vm.BYJStatuse = null;

        vm.loanExplation = loanExplation;
        vm.linkStuFn = linkStuFn;
        vm.linkGtFn = linkGtFn;

        vm.isGraduation = false;

        function linkStuFn() {
            console.log(vm.LHHStatuse);
            if (vm.LHHStatuse == 'passed') {
                utils.gotoUrl(utils.getUrlWithParams('/blanknote/product', {
                    name: '零花花',
                    userType: vm.LHHStatuse
                }));
            } else {
                utils.gotoUrl(utils.getUrlWithParams('/blanknote/productPre', {
                    name: '零花花',
                    userType: vm.LHHStatuse
                }));
            }
        }

        function linkGtFn() {
            console.log(vm.BYJStatuse);

            if (vm.BYJStatuse == 'passed') {
                utils.gotoUrl(utils.getUrlWithParams('/blanknote/product', {
                    name: '成人贷',
                    userType: vm.BYJStatuse
                }));
            } else {
                utils.gotoUrl(utils.getUrlWithParams('/blanknote/productPre', {
                    name: '成人贷',
                    userType: vm.BYJStatuse
                }));
            }
        }


        //获取毕业贷认证状态
        function checkFetchRequireU(productCode) {
            httpRequest.getReq(urlHelper.getUrl('checkProductCert'), {
                productCode: productCode
            }).then(function (d) {
                if (productCode == 'LHH') {
                    vm.LHHStatuse = d.censorStatus;
                }
                if (productCode == 'BYJ') {
                    vm.BYJStatuse = d.censorStatus;
                }
                if (vm.BYJStatuse == 'passed') {
                    vm.GtStatusStyle = {
                        backgroundColor: '#ccc'
                    };
                }
            }, function (err) {

            })
        }

        function loanExplation() {

        }

        function init() {
            if ($rootScope.loginStatus) {
                checkFetchRequireU('LHH');
                checkFetchRequireU('BYJ');
            }
        }

        init();

    }

});