/**
 * Created by llq on 16-2-23.
 */

define([
    'screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('TaskDoCtrl', TaskDo);

    ////////
    TaskDo.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT_UTILS',
        'CONSTANT_STYLE_URL_PREFIX'
    ];
    function TaskDo($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils, urlPrefix) {
        var vm = $scope;

        var userTaskId = $stateParams.userTaskId;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "进行任务",
                isShow: true

            }, $location);
        }
        vm.stepItems = null;
        vm.lastStep = null;
        vm.fn = null;
        vm.cn = null;
        vm.stepId = null;
        vm.stepDescId = null;
        vm.textResultId = null;
        vm.item = {
            styles: {
                height: '1px'
            }
        };

        vm.commitTask = commitTask;

        //滚动
        vm.slides = [];
        vm.carouselIndex = 0;
        vm.userTaskId = userTaskId;

        //图片预览
        vm.picPre = {
            isVisible: false,
            item: [],
            closeDialog: function () {
                vm.picPre.isVisible = false
            }
        };

        //删除图片
        vm.deletePicObj = {
            isVisible: false,
            closeDialog: function () {
                vm.deletePicObj.isVisible = false;
            },
            openDialog: function (item, carouselIndex, fatherNumber, childNumber) {
                vm.picCarouselIndex = carouselIndex;
                vm.picPre.item = item;
                vm.deleteResultId = item.id;
                vm.deletePicObj.isVisible = true;
                vm.deleteFn = fatherNumber;
                vm.deleteCn = childNumber;
            }
        };
        vm.picCarouselIndex = 0;
        vm.picPreShow = picPreShow;
        vm.deletePic = deletePic;
        vm.deleteFn = null;
        vm.deleteCn = null;
        vm.deleteResultId = null;

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
                vm.picPre.closeDialog();
            }
        }

        vm.text = {
            content: null,
            fN: null,
            cN: null,
            isVisible: false,
            openDialog: function (content, fatherNumber, childNumber, stepId, stepDescId, resultId) {
                vm.text.content = content;
                vm.fn = fatherNumber;
                vm.cn = childNumber;
                vm.text.isVisible = true;
                vm.stepId = stepId;
                vm.stepDescId = stepDescId;
                if (!vm.textResultId) {
                    vm.textResultId = resultId;
                }
            },
            updateTextContent: function () {
                var params =
                {
                    indexStepId: vm.stepId,
                    userTaskId: vm.userTaskId,
                    userResultVOList: [{
                        stepId: vm.stepId,
                        stepDescId: vm.stepDescId,
                        context: vm.text.content,
                        userResultId: vm.textResultId
                    }]
                };
                if (vm.text.content) {
                    httpRequest.getReq(urlHelper.getUrl('savePromotionUserResults'), null, {
                        type: 'POST',
                        data: params,
                        withCredentials: true,
                        withToken: true,
                        domain: 'massfrog'
                    }).then(function (d) {
                        console.log(d);
                        if (d.items[0].id) {
                            vm.textResultId = d.items[0].id;
                        }
                        if (vm.slides[vm.fn].userTaskStepDescDTOList[vm.cn].promotionUserResults[0]) {
                            vm.slides[vm.fn].userTaskStepDescDTOList[vm.cn].promotionUserResults[0].content = vm.text.content
                        } else {
                            vm.slides[vm.fn].userTaskStepDescDTOList[vm.cn].tip = vm.text.content;
                        }
                        vm.text.isVisible = false;
                    }, function (d) {
                        utils.error('保存失败:' + d.msg)
                    });


                }
                else {
                    utils.error('输入内容不能为空！')
                }
            },
            closeDialog: function () {
                vm.text.isVisible = false;
            }
        };


        function picPreShow(item, carouselIndex, type, fatherNumber, childNumber) {
            vm.picCarouselIndex = carouselIndex;
            vm.picPre.item = item;
            vm.deleteResultId = vm.picPre.item[carouselIndex].id;
            vm.picPre.isVisible = true;
            vm.deleteFn = fatherNumber;
            vm.deleteCn = childNumber;
        }


        function deletePic() {
            httpRequest.getReq(urlHelper.getUrl('deleteUserPics'), {userResultId: vm.deleteResultId}, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                vm.slides[vm.deleteFn].userTaskStepDescDTOList[vm.deleteCn].promotionUserResults.splice(vm.picCarouselIndex, 1);
                vm.deletePicObj.isVisible = false;
            }, function (d) {
                utils.error('删除失败');
                vm.deletePicObj.isVisible = false;

            })
        }


        function commitTask() {
            var params = {
                "indexStepId": vm.stepItems[vm.lastStep].id,
                "userTaskId": vm.userTaskId,
                "userResultVOList": []
            };
            httpRequest.getReq(urlHelper.getUrl('commitPromotionUserResults'), null, {
                type: 'POST',
                data: params,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'

            }).then(function (d) {
                utils.confirm('提交成功，我们将尽快审核完成^_^', utils.gotoUrl('/works/mytask'))
            }, function (d) {

                utils.error('申请失败 : ' + d.msg);
                if (d.data.items[0].stepId) {
                    vm.carouselIndex = d.data.items[0].stepId;
                }
            });
        }

        // photo
        vm.openPhotoDialog = function (fatherNumber, childNumber, stepId, stepDescId) {
            vm.photo.dialogOpen({
                fn: fatherNumber,
                cn: childNumber,
                stepId: stepId,
                stepDescId: stepDescId
            })
        };

        vm.getPhotoUploadUrl = getPhotoUploadUrl;
        vm.onPhotoUploadSuccessFn = onPhotoUploadSuccessFn;

        function getPhotoUploadUrl(imgType, photo) {
            return urlPrefix + urlHelper.getUrl('uploadTaskFiles');
        }

        function onPhotoUploadSuccessFn(response, imgType, photo) {
            if (response.data && response.data.items && response.data.items[0]) {
                var item = response.data.items[0];
                var params =
                {
                    indexStepId: imgType.stepId,
                    userTaskId: vm.userTaskId,
                    userResultVOList: [{
                        stepId: imgType.stepId,
                        stepDescId: imgType.stepDescId,
                        context: item.bucketFileName,
                        userResultId: ''
                    }]
                };

                httpRequest.getReq(urlHelper.getUrl("savePromotionUserResults"), null, {
                    type: 'POST',
                    data: params,
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                    item.id = d.items[0].id;
                    vm.slides[imgType.fn].userTaskStepDescDTOList[imgType.cn].promotionUserResults.push(item);
                }, function (d) {
                    utils.error("亲，网络不好，请重新提交！");
                });
            }
        }

        function init() {
            var carouseHeight = jq($window).height();
            vm.item.styles.height = parseInt(carouseHeight) - 150 + "px";


            httpRequest.getReq(urlHelper.getUrl('queryUserTaskStepsByUserTaskIdUP'), {
                userTaskId: vm.userTaskId
            }, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                vm.stepItems = d.items;
                vm.slides = d.items;
                vm.lastStep = parseInt(d.items.length) - 1;
            });

        }

        init();
    }

});
