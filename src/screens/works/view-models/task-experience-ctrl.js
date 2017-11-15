
define([
    'screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('TaskExperienceCtrl', TaskExperience);

    ////////
    TaskExperience.$inject = [
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
    function TaskExperience($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex=1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "我的任务",
                isShow: true
            }, $location);
        }

        //加载
        vm.userId=null;
        vm.type='all';


        //加载
        vm.flushPage = flushPage;
        vm.reload = reload;
        vm.getMsg = getMsg;
        vm.loadItems = loadItems;
        vm.canLoad = true;
        vm.items = [];

        //选择
        vm.choseExperienceType=choseExperienceType;

        vm.getTaskInformation = getTaskInformation;


        function choseExperienceType(type){
            vm.type=type;
            flushPage();
        }

        function flushPage() {
            reload();
            vm.$emit('reload');
        }

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


        function getTaskInformation(userTaskId) {
            utils.gotoUrl('/works/task/information?userTaskId='+userTaskId);
        }

        //加载函数

        function loadItems() {
            var dtd = $q.defer();
            httpRequest.getReq(urlHelper.getUrl('queryUserTask'), {
                userId: vm.userId,
                type:vm.type,
                offset: (pageIndex - 1) * 10,
                limit: 10
            }, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                pageIndex++;
                var items = d.items;

                //if (items && items.length > 0) {
                //    for (var i = 0; i < items.length; i++) {
                //        if (items[i].corpBaseInfo) {
                //            items[i].corpBaseInfo.logoUrl = utils.string2Json(items[i].corpBaseInfo.logoUrl);
                //        } else {
                //
                //        }
                //    }
                //}
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

