define([
    'screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('TaskInformationCtrl', TaskInformation);

    ////////
    TaskInformation.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        '$interval',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT_UTILS'
    ];
    function TaskInformation($rootScope, $scope, $location, $stateParams, $q, $window, $interval, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope;

        var taskId = $stateParams.taskId,
            userTaskId = $stateParams.userTaskId;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "任务详情",
                isShow: true
            }, $location);
        }


        vm.item = {
            styles: {
                height: '1px'
            }
        };
        vm.plateForm = 'ios';
        //滚动
        vm.slides = [];
        vm.carouselIndex = 0;


        vm.queryTaskUrl = 'queryPromotionTaskByTaskId';

        vm.taskId = taskId;
        vm.userTaskId = userTaskId;
        vm.information = {
            promotionTaskDTO: null,
            promotionTaskDesc: null,
            taskPicAttr: null,
            promotionUserTask: null
        };
        vm.openApply = openApply;
        vm.canApply = canApply;
        vm.goOnApply = goOnApply;
        vm.openPreview = openPreview;

        vm.picPreShow = picPreShow;

        //倒计时
        vm.remainderTimeTimer = null;
        vm.remainderTime = null;
        vm.presentTime = null;
        vm.remainderText = null;


        //图片预览
        vm.picPre = {
            isVisible: false,
            item: [],
            closeDialog: function () {
                vm.picPre.isVisible = false
            }
        };
        vm.picCarouselIndex = 0;


        vm.taskPreview = {
            isVisible: false,
            closeDialog: function () {
                vm.taskPreview.isVisible = false;
            }

        };

        function picPreShow(item, carouselIndex) {
            vm.picCarouselIndex = carouselIndex;
            vm.picPre.item = item;
            vm.picPre.isVisible = true;
        }

        function openPreview() {
            vm.taskPreview.isVisible = true;
        }

        function canApply() {
            if (vm.information.promotionUserTask.status == 'processing') {
                return false;
            }
        }

        function openApply() {
            httpRequest.getReq(urlHelper.getUrl('createUserTask'), {taskId: vm.taskId, platform: vm.plateForm}, {
                ignoreLogin: true,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                    utils.gotoUrl('/works/task/do?userTaskId=' + d.id)
                }, function (d) {
                    utils.alert('申请失败 : ' + d.msg)
                }
            );
        }

        function goOnApply() {
            utils.gotoUrl('/works/task/do?taskId=' + taskId + '&userTaskId=' + vm.information.promotionUserTask.id)
        }


        //链接跳转
        vm.goOut = goOut;
        function goOut(outUrl) {
            if (navigator.appupdate) {
                navigator.appupdate.openUrl(outUrl);
            }

        }

        //识别图片
        vm.recognitionImg = recognitionImg;

        function recognitionImg(item) {
            if (item && item.memo) {
                if (utils.checkUrl(item.memo)) {
                    goOut(item.memo);
                }
                else {
                    vm.clipboard.setClipboard(item.memo)
                }
            }
            else {
                vm.picPre.closeDialog()
            }
        }

        vm.clipboard = {
            canCopy: navigator.appupdate && navigator.appupdate.setClipboard,
            hasCopy: false,
            setClipboard: function (text) {
                if (navigator.appupdate && navigator.appupdate.setClipboard) {
                    navigator.appupdate.setClipboard(text, function (data) {
                        vm.clipboard.hasCopy = true;
                        utils.alert("已复制到剪切板");
                    });
                }
            }
        };

        function showRemainderTime() {
            vm.remainderTime = vm.remainderTime - 1;
            if (vm.remainderTime > 0) {
                var text = "", time = vm.remainderTime;
                if (time >= 3600) {
                    text = parseInt(time / 3600) + "时";
                }
                time = time % 3600;
                if (time >= 60) {
                    text = text + parseInt(time / 60) + "分";
                }
                time = time % 60;
                if (text == "") {
                    text = parseInt(time) + "秒";
                }
                vm.remainderText = "(" + text + ")";
            } else {
                vm.remainderText = null;
                if (vm.information.promotionUserTask.status == 'auditing' || vm.information.promotionTaskDTO.status == 'off') {
                }
                else {
                    vm.information.promotionUserTask.status = "all";
                }

            }
        }

        function taskTime() {
            var presentTime = utils.stringToDate(vm.presentTime).getTime(),
                startTime = utils.stringToDate(vm.information.promotionUserTask.createTime).getTime(),
                limitTime = 0;
            if (vm.information.promotionTaskDTO.processTime) {
                limitTime = vm.information.promotionTaskDTO.processTime * 60 * 1000;
            }
            var endTime = startTime + limitTime;
            vm.remainderTime = (endTime - presentTime) / 1000;

            if (vm.remainderTimeTimer) {
                $interval.cancel(vm.remainderTimeTimer);
            }

            vm.remainderTimeTimer = $interval(showRemainderTime, 1000);
        }

        function init() {

            vm.plateForm = jq.os.ios ? "ios" : jq.os.android ? "android" : "all";


            var carouseHeight = jq($window).height();
            vm.item.styles.height = parseInt(carouseHeight) - 150 + "px";
            httpRequest.getReq(urlHelper.getUrl('queryPrePics'), {taskId: vm.taskId}, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                vm.slides = d.picUrls;
            });

            var params = {
                platForm: vm.plateForm
            };

            if (userTaskId) {
                vm.queryTaskUrl = 'queryUserTaskByUserTaskId';
                params.userTaskId = vm.userTaskId;
            }
            else {
                vm.queryTaskUrl = 'queryPromotionTaskByTaskId';
                params.taskId = vm.taskId;
            }
            httpRequest.getReq(urlHelper.getUrl(vm.queryTaskUrl), params, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                if (userTaskId) {
                    vm.taskId = d.promotionUserTask.taskId;
                }
                vm.presentTime = d.currentTime;
                vm.information.promotionTaskDTO = d.promotionTaskDTO;
                vm.information.promotionTaskDesc = d.promotionTaskDesc;
                vm.information.promotionUserTask = d.promotionUserTask;
                vm.information.taskPicAtter = d.taskPicAttr;
                if (d.promotionUserTask) {
                    taskTime();
                }
            }, function (d) {
            });

        }

        init();
    }

});
