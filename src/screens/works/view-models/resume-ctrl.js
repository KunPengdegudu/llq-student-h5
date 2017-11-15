/**
 * screens - works- resume
 * @create 2015/12/30
 * @author D.xw
 */
define([
    'screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WorksResumeCtrl', WorksResume);

    ////////
    WorksResume.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$interval',
        '$stateParams',
        '$q',
        '$window',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT_UTILS',
        'CONSTANT_STYLE_URL_PREFIX'
    ];
    function WorksResume($rootScope, $scope, $location, $interval, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils, urlPrefix) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "我的简历",
                isShow: true
            }, $location);
        }


        vm.cityCode = null;
        vm.data = {
            id: '',
            name: '',
            identityNo: '',
            sex: '',
            email: '',
            schoolCode: '',
            eduSysType: '',
            beginTime: '',
            speciality: '',
            birthday: ''
        };


        vm.porsonInfo = {};
        vm.porsonInfo.headImg = null;

        vm.personResume = {};

        vm.personResumeNames = ['work_ex', 'edu_bak', 'skill', 'self_intro'];

        vm.personPhoto = [false, false, false];
        vm.personPhotoItems = [{}, {}, {}];

        vm.confirm = confirm;
        vm.gotoIntern = gotoIntern;
        vm.gotoPartTime = gotoPartTime;

        function gotoPartTime() {
            utils.gotoUrl('/works/work?pageType=partTime&cityCode=' + vm.cityCode)
        }

        function gotoIntern() {
            utils.gotoUrl('/works/work?pageType=intern');
        }

        vm.resumeInfo = {
            isVisible: false,
            type: null,
            itemTitle: null,
            resume: {},
            init: function (type) {
                vm.resumeInfo.type = type;
                if (type == "work_ex") {
                    vm.resumeInfo.itemTitle = "工作经历";
                    vm.resumeInfo.resume = vm.personResume.work_ex;
                }
                if (type == "edu_bak") {
                    vm.resumeInfo.itemTitle = "校内经历";
                    vm.resumeInfo.resume = vm.personResume.edu_bak;
                }
                if (type == "skill") {
                    vm.resumeInfo.itemTitle = "技能证书";
                    vm.resumeInfo.resume = vm.personResume.skill;
                }
                if (type == "self_intro") {
                    vm.resumeInfo.itemTitle = "自我评价";
                    vm.resumeInfo.resume = vm.personResume.self_intro;
                }
            },
            openDialog: function (type) {
                vm.resumeInfo.isVisible = true;
                vm.resumeInfo.init(type);
            },
            closeDialog: function () {
                vm.resumeInfo.isVisible = false;
            },
            updateResume: function () {
                if (vm.resumeInfo.resume && vm.resumeInfo.resume.content
                    && vm.resumeInfo.resume.content.length > 0) {
                    var data = jq.extend({
                        type: vm.resumeInfo.type,
                        userId: vm.porsonInfo.userId,
                        content: ''
                    }, vm.resumeInfo.resume);

                    httpRequest.getReq(urlHelper.getUrl("updateUserAttachInfo"), null, {
                        type: 'POST',
                        data: data,
                        isForm: true,
                        withCredentials: true,
                        withToken: true,
                        domain: 'massfrog'
                    }).then(function (d) {
                        vm.personResume[vm.resumeInfo.type] = d;
                        vm.resumeInfo.closeDialog();
                    }, function (d) {
                        utils.error("亲，网络不好，请重新提交！");
                    });

                } else {
                    utils.error("亲，内容为空，无法提交！");
                }
            }
        };

        // photo

        vm.idx = null;
        vm.item = null;
        vm.openPhotoDialog = function (idx, item) {

            vm.idx = idx;
            vm.item = item;

            if (idx == 'headImg') {
                vm.photo.dialogOpen({
                    type: idx
                });
            } else {
                if (!item.id) {
                    vm.photo.dialogOpen({
                        idx: idx,
                        item: item
                    });
                } else {
                    vm.photoView.dialogOpen({
                        idx: idx,
                        item: item
                    });
                }
            }
        };

        vm.openPhotoDialogRest = function (idx, item) {
            vm.photoView.dialogClose();
            vm.photo.dialogOpen({
                idx: idx,
                item: item
            });
        };

        vm.photoView = {
            isVisible: false,
            dialogBeforeHide: function () {
                return true;
            },
            dialogOpen: function () {
                if (vm.photoView.lock) {
                    return;
                }
                vm.idxNo = Number(vm.idx) + 1;

                vm.photoView.isVisible = true;
            },
            dialogClose: function () {
                vm.photoView.isVisible = false;
            }
        };

        vm.getPhotoUploadUrl = getPhotoUploadUrl;
        vm.onPhotoUploadSuccessFn = onPhotoUploadSuccessFn;

        function getPhotoUploadUrl(imgType, photo) {
            return urlPrefix + urlHelper.getUrl('uploadFiles');
        }

        function onPhotoUploadSuccessFn(response, imgType, photo) {
            if (response.data && response.data.items && response.data.items[0]) {
                var item = response.data.items[0];
                var content = utils.htmlDecode(JSON.stringify(item));
                if (imgType.type == 'headImg') {
                    var contentJson = utils.string2Json(content);
                    var data = {
                        type: 'head_img',
                        userId: vm.porsonInfo.userId,
                        content: {
                            bucketFileName: contentJson.bucketFileName,
                            fileSize: contentJson.fileSize,
                            fileName:contentJson.fileName
                        }
                    };
                    httpRequest.getReq(urlHelper.getUrl('updateUserAttachInfo'), null, {
                        type: 'POST',
                        data: data,
                        isForm: true,
                        withCredentials: true,
                        withToken: true,
                        domain: 'massfrog'
                    }).then(function (d) {

                        vm.porsonInfo.headImg = contentJson.compressUrl;
                    }, function (d) {
                        utils.error('上传头像失败:' + d.msg);
                    })
                }
                else {
                    saveResumePhotoInfo(content, imgType.idx, imgType.item.id);
                }
            }
        }


        function saveResumePhotoInfo(url, idx, id) {
            var data = {
                type: "photo",
                userId: vm.porsonInfo.userId,
                indexId: idx,
                content: url
            };

            if (id) {
                data.id = id;
            }

            httpRequest.getReq(urlHelper.getUrl("updateUserAttachInfo"), null, {
                type: 'POST',
                data: data,
                isForm: true,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                reflushPhotos();
            }, function (d) {
                utils.error("亲，网络不好，请重新提交！");
            });
        }

        function confirm() {
            var params = {
                userId: vm.porsonInfo.userId,
                realName: vm.data.name,
                idNo: vm.data.identityNo,
                sex: vm.data.sex,
                email: vm.data.email,
                phone: vm.data.phone,
                schoolCode: vm.data.eduInfo.schoolCode,
                headImg: null,
                webSite: null
            };
            httpRequest.getReq(urlHelper.getUrl("updateUserBasicInfo"), null, {
                type: "POST",
                data: params,
                isForm: true,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                utils.alert('亲，您的简历保存成功，去寻找自己喜欢的兼职', vm.gotoPartTime);
            }, function () {
                utils.error("网络错误，请您重新保存！")
            })
        }

        function reflushPhotos() {
            httpRequest.getReq(urlHelper.getUrl("queryUserAttachInfos"), {
                userId: vm.porsonInfo.userId,
                type: 'photo'
            }, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {

                vm.personPhoto = [false, false, false];
                vm.personPhotoItems = [{}, {}, {}];

                if (d && d.items && d.items.length > 0) {
                    var content, contentJson;
                    for (var i = 0; i < d.items.length; i++) {
                        content = utils.htmlDecode(d.items[i].content);
                        contentJson = utils.string2Json(content);
                        vm.personPhoto[i] = true;
                        vm.personPhotoItems[i] = contentJson;
                        vm.personPhotoItems[i]['id'] = d.items[i].id;
                    }
                }

            });
        }


        function init() {

            httpRequest.getReq(urlHelper.getUrl("queryUserInfor")
            ).then(function (d) {
                vm.data = d;
                if (d && d.identityNo) {
                    vm.data.birthday = d.identityNo.substr(6, 4) + "." + d.identityNo.substr(10, 2) + "." + d.identityNo.substr(12, 2);
                    vm.blankBalanceCreditAmount = d.blankBalanceCreditAmount;
                    vm.blankTotalCreditAmount = d.blankTotalCreditAmount;
                }
            });


            httpRequest.getReq(urlHelper.getUrl("getUserInfo"), {}, {
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                vm.porsonInfo = d;
                if (vm.porsonInfo.headImg) {
                    vm.porsonInfo.headImg = utils.htmlDecode(vm.porsonInfo.headImg);
                    vm.porsonInfo.headImg = utils.string2Json(vm.porsonInfo.headImg).compressUrl;
                }
                if (d.lastCityCode != null) {
                    vm.cityCode = d.lastCityCode;
                }
                else {
                    vm.cityCode = 330100;
                }
                for (var i = 0; i < vm.personResumeNames.length; i++) {
                    var prName = vm.personResumeNames[i];
                    var proxy = function (prName) {
                        httpRequest.getReq(urlHelper.getUrl("queryUserAttachInfos"), {
                            userId: vm.porsonInfo.userId,
                            type: prName
                        }, {
                            withCredentials: true,
                            withToken: true,
                            domain: 'massfrog'
                        }).then(function (d) {
                            if (d && d.items && d.items.length > 0) {
                                vm.personResume[prName] = d.items[0];
                            } else {
                                vm.personResume[prName] = {};
                            }

                        });
                    };

                    proxy(prName);
                }

                reflushPhotos();
            });

        }

        init();
    }

});