/**
 * rechargeGame main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/rechargeGame/module',
    'jq',
    'qrcode',
    'screens/rechargeGame/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('gameWidgetCtrl', gameWidget);

    ////////
    gameWidget.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$location',
        '$q',
        '$window',
        '$loadingOverlay',
        '$timeout',
        '$interval',
        'httpRequest',
        'settingCache',
        'rechargeGameUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function gameWidget($rootScope, $scope, $stateParams, $location, $q, $window, $loadingOverlay, $timeout, $interval, httpRequest, settingCache, urlHelper, constant, utils) {
        var vm = $scope,
            pageNo = 1,
            selectItem;

        var _widgetId = $stateParams.widgetId,
            _name = $stateParams.name;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: _name,
                isShow: true
            }, $location);
        }

        vm.tebList = [];
        vm.hotList = [];

        vm.isAbnormal = false;

        vm.selectedItem = null;

        vm.gotoDetail = gotoDetail;

        vm.selectTeb = selectTeb;
        function selectTeb(item) {
            for (var i = 0; i < vm.tebList.length; i++) {
                vm.tebList[i].selected = false;
            }
            if (vm.selectedItem != item) {
                queryWidgetNodeProdDescInfo(item);
                queryWidgetNodeProdInfo(item)
            }
            item.selected = true;
            vm.selectedItem = item;
        }

        function queryWidgetNodeInfo() {
            httpRequest.getReq(urlHelper.getUrl('queryWidgetNodeInfo'), {
                'widgetId': _widgetId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items.length > 0) {
                    vm.tebList = d.items;
                    vm.selectTeb(vm.tebList[0]);
                }
            })
        }

        function queryWidgetNodeProdInfo(item) {
            var params = {
                pageNo: 1,
                pageSize: 30,
                nodeId: item.nodeId
            };
            httpRequest.getReq(urlHelper.getUrl('queryWidgetNodeProdInfo'), params, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items && d.items.length > 0) {
                    vm.items = d.items;
                    vm.isAbnormal = true;
                } else {
                    vm.isAbnormal = false;
                }
            }, function () {

            })
        }

        function queryWidgetNodeProdDescInfo(item) {
            httpRequest.getReq(urlHelper.getUrl('queryWidgetNodeProdDescInfo'), {
                'nodeId': item.nodeId,
                'DataSize': 8
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items.length > 0) {
                    vm.hotList = d.items;
                }
            })
        }

        function gotoDetail(item) {
            var prodId = item.prodId ? item.prodId : item.id;
            var url = utils.getUrlWithParams('/recharge/game/details', {
                'prodId': prodId
            });
            utils.gotoUrl(url);
        }

        function init() {
            queryWidgetNodeInfo();
        }

        init();

    }

})
;
