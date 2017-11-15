/**
 * template main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/template/module',
    'jq',
    'screens/template/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('commonStyleCtrl', commonStyle);

    ////////
    commonStyle.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$location',
        '$stateParams',
        '$q',
        'httpRequest',
        'templateUrlHelper',
        'CONSTANT_UTILS'
    ];
    function commonStyle($rootScope, $scope, $state, $location, $stateParams, $q, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        var widgetCode = $stateParams.widgetCode;

        var nodeId = $stateParams.nodeId;

        var name = $stateParams.name;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: name,
                isShow: true
            }, $location);
        }

        vm.templateList = null;
        vm.orderFactorId = '';
        vm.orderType = '';
        vm.ascendShow = false;
        vm.descendShow = false;
        vm.bannerImgUrlList = null;
        vm.asc = 'asc';
        vm.desc = 'desc';
        vm.flushPage = flushPage;
        vm.gotoProductDetail = gotoProductDetail;

        vm.getNewGoodsSort = function (orderType) {
            vm.orderType = orderType;
            flushPage();
        };

        function flushPage() {
            reload();
            vm.$emit('reload');
        }

        function gotoProductDetail(productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('#/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            location.replace(url);
        }


        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        vm.gotoOperation = function () {
            utils.gotoUrl("/operation/christmas");
        }

        function loadItems() {
            var dtd = $q.defer();
            var param = {};
            if (!vm.orderType) {
                param = {
                    offset: pageIndex,
                    limit: 10,
                    nodeId: nodeId,
                    widgetCode: widgetCode
                };
            } else {
                param = {
                    offset: pageIndex,
                    limit: 10,
                    widgetCode: widgetCode,
                    nodeId: nodeId,
                    orderType: vm.orderType,
                    orderFactorId: vm.orderFactorId
                }
            }
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), param, {
                ignoreLogin: true
            }).then(function (d) {
                pageIndex++;
                var items = d ? d.items : [];

                if (items && items.length === 0) {
                    vm.canLoad = false;
                }
                vm.items = vm.items.concat(items);
                if (vm.items.length === 0) {
                    vm.isAbnormal = true;
                }
                dtd.resolve();
            }, function () {
                dtd.reject();
            });
            return dtd.promise;
        }

        function getMsg() {
            if (!vm.items || vm.items.length === 0) {
                return ' ';
            }
        }

        vm.hasSortBtn = false;
        function init() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), {
                widgetCode: widgetCode
            }, {
                ignoreLogin: true
            }).then(function (d) {
                vm.templateList = d.nodeTree;
                if (d.orderFactor && d.orderFactor.length > 0) {
                    vm.orderType = d.orderFactor[0].orderType;
                    vm.hasSortBtn = true;
                } else {
                    vm.hasSortBtn = false;
                }
                if (vm.orderType == 'ASC' || vm.orderType == 'asc') {
                    vm.ascendShow = true;
                }
                if (vm.orderType == 'DESC' || vm.orderType == 'desc') {
                    vm.descendShow = true;
                }
                if (vm.orderType == 'AD' || vm.orderType == 'ad') {
                    vm.ascendShow = true;
                    vm.descendShow = true;
                }

            });
        }

        init();
    }

});