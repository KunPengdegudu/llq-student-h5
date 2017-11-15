/**
 * screens - works-bill -income
 * @create 2016/1/11
 * @author D.xw
 */
define([
    'screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WorksMyTaskCtrl', WorksMyTask);

    ////////
    WorksMyTask.$inject = [
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
    function WorksMyTask($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "任务",
                isShow: true,
                isShowRightBtn: true,
                rightBtnType: 'text',
                rightBtnAttrs: {
                    text: '我的任务',
                    fn: gotoTaskExperience
                }
            }, $location);
        }

        vm.choseType = null;
        vm.order = null;
        vm.type = null;

        vm.plateForm = 'android';
        //dialog
        vm.dialogBeforeHide = dialogBeforeHide;
        vm.dialogClose = dialogClose;

        //加载
        vm.flushPage = flushPage;
        vm.reload = reload;
        vm.getMsg = getMsg;
        vm.loadItems = loadItems;
        vm.canLoad = true;
        vm.items = [];


        vm.gotoTaskSpreed=gotoTaskSpreed;

        function gotoTaskSpreed(){
            utils.gotoUrl('/works/task/spreed');
        }
        //详情跳转
        vm.getTaskInformation = getTaskInformation;


        function getTaskInformation(taskId) {
            utils.gotoUrl('/works/task/information?taskId=' + taskId);
        }

        function gotoTaskExperience() {
            utils.gotoUrl('/works/task/experience')
        }

        vm.task = {
            clickType: function (name) {
                vm.choseType = name;
                if (name == 'type') {
                    dialogClose();
                    vm.typeDialog.isVisible = true;
                }
                else {
                    dialogClose();
                    vm.orderDialog.isVisible = true;
                }
                jq("body").children("data-header-bar").css("z-index", 570);
                jq("body").find(".mytask-main").css("z-index", 570);
            }
        };

        vm.typeDialog = {
            isVisible: false,
            typeName: '全部',
            choseOne: function (type, name) {
                vm.typeDialog.typeName = name;
                vm.type = type;
                dialogClose();
                flushPage();
            }
        };

        vm.orderDialog = {
            isVisible: false,
            orderName: '默认',
            choseOne: function (type, name) {
                vm.orderDialog.orderName = name;
                vm.order = type;
                dialogClose();
                flushPage();
            }
        };

        function dialogBeforeHide() {
            jq("body").children("data-header-bar").css("z-index", null);
            jq("body").find(".mytask-main").css("z-index", null);
            return true;
        }

        function dialogClose() {
            vm.typeDialog.isVisible = false;
            vm.orderDialog.isVisible = false;
            jq("body").children("data-header-bar").css("z-index", null);
            jq("body").find(".mytask-main").css("z-index", null);
        }

        function flushPage() {
            reload();
            vm.$emit('reload');
        }

        function gotoAuthV1(idx) {
            if (idx == 2) {
                utils.gotoUrl("/auth/main");
            } else {
                utils.gotoUrl("/");
            }
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

        vm.gotoTaskSpreed = gotoTaskSpreed;
        function gotoTaskSpreed() {
            utils.gotoUrl('/works/task/spreed')
        }

        //加载函数

        function loadItems() {


            vm.plateForm = jq.os.ios ? "ios" : jq.os.android ? "android" : "all";


            var dtd = $q.defer();
            httpRequest.getReq(urlHelper.getUrl('queryPromotionTasks'), {
                order: vm.order,
                type: vm.type,
                offset: (pageIndex - 1) * 10,
                limit: 10,
                platForm: vm.plateForm
            }, {
                ignoreLogin: true,
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
            httpRequest.getReq(urlHelper.getUrl('queryUserInfor'), null, {ignoreLogin: true})
                .then(function (d) {
                    vm.data = d;

                    //免登录
                    if (d.completeStatus == "un_completed") {
                        utils.customDialog('亲，您未完成认证', '请先完成注册成为我们的会员！', '先逛逛,去注册', gotoAuthV1); // 去认证V1
                    }

                });

        }

        init();
    }

});