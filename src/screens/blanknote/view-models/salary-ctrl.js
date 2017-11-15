define([
    'screens/blanknote/module',
    'jq',
    'screens/blanknote/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('BlankNoteSalaryCtrl', BlankNoteSalary);

    ////////
    BlankNoteSalary.$inject = [
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
    function BlankNoteSalary($rootScope, $scope, $location, $stateParams, $q, httpRequest, settingCache, $loadingOverlay, $timeout, urlHelper, constant, utils) {
        var vm = $scope;
        vm.lock = false;

        var loadingTimer;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                currentUrl: "/blanknote/salary",
                title: "预支工资",
                isShow: true
            }, $location);
        }
        vm.blankNote = {
            loanAmount: 500,
            source: "app",
            peroid: 1,
            accountType: null,
            purpose: '生活',
            userFundAccountId: null
        };
        vm.doApply = doApply;
        vm.firstRepay = {
            amountOutstanding: null,
            amountPrinciple: null,
            amountInterest: null
        };
        vm.bannerImgSrc = 'queryBanners';
        vm.bannerSrc = '/app/assets/imgs/banner/salary-banner.png';
        vm.blankNoteAmountList = [500, 600, 700, 800, 900, 1000, 1500, 2000,3000];
        vm.cashApplyPurposeVOList = ['生活','购物', '教育', '旅游'];
        vm.cashInterestRuleList = [
            1, 3, 6
        ];
        vm.supportAccountFundTypeList = null;
        vm.isSelectAmount = function (amount) {
            return amount == vm.blankNote.loanAmount;
        };
        vm.selectBlankNoteAmount = function (amount) {
            if (vm.blankNote.loanAmount != amount) {
                vm.blankNote.loanAmount = amount;
            }
            vm.changeRepayMoney();
        };


        // 用途
        vm.isSelectPurpose = function (purpose) {
            return purpose == vm.blankNote.purpose;
        };
        vm.selectBlankNotePurpose = function (purpose) {
            if (vm.blankNote.purpose != purpose) {
                vm.blankNote.purpose = purpose
            }
        };


        vm.isSelectPeriod = function (myPeriod) {
            return myPeriod == vm.blankNote.peroid;
        };

        vm.selectCashInterestRule = function (myPeriod) {
            if (vm.blankNote.peroid != myPeriod) {
                vm.blankNote.peroid = myPeriod;
            }
            vm.changeRepayMoney();
        };

        vm.changeRepayMoney = function () {
            vm.firstRepay.amountPrinciple = vm.blankNote.loanAmount / vm.blankNote.peroid;
            if(vm.blankNote.loanAmount<=1000){
                vm.firstRepay.amountInterest=0;
            }else{
                vm.firstRepay.amountInterest = vm.blankNote.loanAmount * 0.03;
            }
            vm.firstRepay.amountOutstanding = vm.firstRepay.amountPrinciple + vm.firstRepay.amountInterest;
        };

        function gotoEnroll(btnIdx) {
            if (btnIdx == 1) {
                window.location.href = 'http://www.007fenqi.com/w/common/register_redirect_page.html?spreadParam=MKOYBQRE'
            }
        }

        function doApply() {
            utils.customDialog("提示", "亲，您的账户还没认证，请前往认证！", "立即认证,关闭", gotoEnroll);
        }

        vm.getBlanknotExplain = getBlanknotExplain;
        vm.blanknoteType = false;
        function getBlanknotExplain() {
            if (!vm.blanknoteType) {
                vm.blanknoteType = true;
                vm.iconRightArrow = {
                    transform: 'rotate(90deg)',
                    transformOrigin: 'left center',
                    marginTop: '-10px'
                }
            } else if (vm.blanknoteType) {
                vm.blanknoteType = false;
                vm.iconRightArrow = {
                    transform: 'rotate(0)',
                    transformOrigin: 'left center'
                }
            }
        }


        function init() {
            vm.changeRepayMoney();
        }

        init();

    }

});