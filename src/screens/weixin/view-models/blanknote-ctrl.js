/**
 * login login controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/weixin/module',
    'jq',
    'screens/weixin/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WeixinBlanknoteCtrl', WeixinBlanknote);

    ////////
    WeixinBlanknote.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        'httpRequest',
        'settingCache',
        '$loadingOverlay',
        '$timeout',
        'weixinUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    function WeixinBlanknote($rootScope, $scope, $location, $stateParams, httpRequest, settingCache, $loadingOverlay, $timeout, urlHelper, constant, utils) {
        var vm = $scope;

        vm.blankNote = {
            loanAmount: 0
        };

        if($stateParams.spreadCode){
            var _spreadCode = $stateParams.spreadCode;
        }

        if($stateParams.comeFrom){
            var _comeFrom = $stateParams.comeFrom;
        }

        vm.bannerImgSrc = 'queryBanners';
        vm.bannerSrc = null;


        vm.blankNoteAmountList = [500,1000,1500,2000,3000,5000,10000,20000,40000,50000,100000,200000];

        vm.isSelectAmount = function (amount) {
            return amount == vm.blankNote.loanAmount;
        };
        vm.selectBlankNoteAmount = function (amount) {
            if (vm.blankNote.loanAmount != amount) {
                vm.blankNote.loanAmount = amount;
            }
        };

        vm.doApply = function () {
            var url = utils.getUrlWithParams("/weixin/enroll", {
                spreadParam: _spreadCode,
                comeFrom: _comeFrom
            });
            utils.gotoUrl(url);
        };

        function bannerSrc() {
            if (vm.bannerImgSrc) {
                httpRequest.getReq(urlHelper.getUrl(vm.bannerImgSrc), null, {
                    ignoreLogin: true
                }).then(function (d) {
                    if (d.items && d.items.length != 0) {
                        vm.bannerSrc = d.items[0].imgUrl;
                    }
                });
            }
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
            bannerSrc();
        }

        init();

    }

});
