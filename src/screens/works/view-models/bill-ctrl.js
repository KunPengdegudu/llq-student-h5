/**
 * screens - works
 * @create 2015/12/30
 * @author D.xw
 */
define([
    'screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WorksBillCtrl', WorksBill);

    ////////
    WorksBill.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT_UTILS'
    ];
    function WorksBill($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "资金明细",
                isShow: true
            }, $location);
        }

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.getMsg = getMsg;
        vm.loadItems = loadItems;

        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        //加载函数

        function loadItems() {
            var dtd = $q.defer();

            httpRequest.getReq(urlHelper.getUrl("queryBilling"), {
                offset: pageIndex,
                limit: 10
            }).then(function (d) {
                pageIndex++;
                var items = d.items;
                for (var i = 0; i < items.length; i++) {
                    items[i].createTime = new Date(parseInt(items[i].createTime));
                }
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

        function init() {

        }

        init();
    }

});