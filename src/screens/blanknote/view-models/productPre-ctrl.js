/**
 * sale main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/blanknote/module',
    'jq',
    'screens/blanknote/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProductPreCtrl', ProductPre);

    ////////
    ProductPre.$inject = [
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
    function ProductPre($rootScope, $scope, $location, $stateParams, $q, httpRequest, settingCache, $loadingOverlay, $timeout, urlHelper, constant, utils) {
        var vm = $scope;
        vm.lock = false;

        var _userSource = $stateParams.userSource,
            _name = $stateParams.name;

        vm.userType = $stateParams.userType;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: '零花花',
                isShow: true,
                isShowRightBtn: true,
                rightBtnType: "icon",
                rightBtnAttrs: {
                    icon: "icon-service",
                    fn: loanExplation
                }
            }, $location);
        }

        if (_name) {
            $rootScope.navConfig.title = _name;
        }

        vm.userAuthType = $stateParams.userType;

        vm.loanExplation = loanExplation;
        function loanExplation() {
            utils.contactUs();
        }

        vm.loanAmount = 8000;
        vm.serviceCharge = 0;
        vm.amountByMonth = 0;

        vm.instalmentMonths = [{
            name: '1个月',
            selected: true,
            key: 1
        }, {
            name: '3个月',
            selected: false,
            key: 3
        }, {
            name: '6个月',
            selected: false,
            key: 6
        }, {
            name: '12个月',
            selected: false,
            key: 12
        }];


        vm.selectedMonth = vm.instalmentMonths[0];

        vm.selectMonth = function (item) {
            for (var i = 0; i < vm.instalmentMonths.length; i++) {
                vm.instalmentMonths[i].selected = false;
            }
            item.selected = true;
            vm.selectedMonth = item;
        };

        vm.selectAmount = function (item) {
            for (var i = 0; i < vm.accountList.length; i++) {
                vm.accountList[i].selected = false;
            }
            item.selected = true;
        };

        vm.calculate = calculate;
        function calculate(loanAmount) {
            var amount = typeof(loanAmount) == 'number' ? loanAmount : vm.loanAmount;
            vm.serviceCharge = parseInt(amount) * 0.03;
            vm.amountByMonth = parseInt(amount) / parseInt(vm.selectedMonth.key) + vm.serviceCharge;
            jq("#serviceCharge").html(vm.serviceCharge.toFixed(2));
            jq("#amountByMonth").html(vm.amountByMonth.toFixed(2));
        }

        vm.accountList = [{
            name: '银行卡',
            selected: true
        }, {
            name: '支付宝',
            selected: false
        }];

        vm.bankCardAmount = '**** **** **** 7772';
        vm.AlipayAmount = '135****8841';

        vm.gotoAuth = function () {
            utils.gotoUrl('auth/main');
        };


        //滑动借款
        vm.loanList = [{
            amount: 0
        }, {
            amount: 2000
        }, {
            amount: 4000
        }, {
            amount: 6000
        }, {
            amount: 8000
        }, {
            amount: 10000
        }];

        for (var i = 0; i < vm.loanList.length; i++) {
            var itemLeft = (vm.loanList[i].amount / vm.loanList[vm.loanList.length - 1].amount) * 100;
            vm.loanList[i].style = {
                left: itemLeft * 0.9 + '%'
            }
        }

        vm.loanAmountbtn = function () {
            var btn = document.getElementById("btn"),
                bar = document.getElementById("bar");
            btn.addEventListener('touchstart', function (e) {
                var x = (e || window.event).touches[0].clientX;
                var btnLeft = btn.offsetLeft + 8;
                document.addEventListener('touchmove', function (e) {
                    var thisX = (e || window.event).touches[0].clientX;
                    var max = bar.offsetWidth - btn.offsetWidth;

                    var to = ((btnLeft + (thisX - x)) / max) * 100;

                    if (to <= 0) {
                        to = 0;
                    } else if (to >= 100) {
                        to = 100;
                    }

                    ondrag(to);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

                });
            });
        };
        function ondrag(x) {
            var loanAmount = x * vm.loanList[vm.loanList.length - 1].amount / 90;
            var newList = [];
            vm.loanList.forEach(function (item, index) {
                newList.push(Math.abs(loanAmount - item.amount));
            });
            var min = Math.min.apply(Math, newList);
            var minIndex;
            newList.forEach(function (item, index) {
                if (item == min) {
                    minIndex = index;
                }
            });
            jq("#title").html(vm.loanList[minIndex].amount);
            jq("#btn").css({
                "left": minIndex / (newList.length - 1) * 100 + "%"
            });
            jq("#loan").css({
                "width": minIndex / (newList.length - 1) * 100 + "%"
            });
            vm.calculate(vm.loanList[minIndex].amount);
            vm.loanAmount = vm.loanList[minIndex].amount;
        }

        function init() {
            vm.calculate();

            var unSelected = vm.$watch('selectedMonth', vm.calculate, true);

            vm.$on('$destroy', function () {
                unSelected();
            });

        }

        init();


    }

});
