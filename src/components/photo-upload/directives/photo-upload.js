define(['angular',
    'jq',
    'text!components/photo-upload/views/photo-upload-tpl.html'
], function (angular, jq, photoUploadTpl) {

    'use strict';

    angular
        .module('components.photoUpload', [])
        .directive('photoUpload', photoUploadProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/photo-upload/views/photo-upload-tpl.html', photoUploadTpl);
        }]);

    photoUploadProvider.$inject = [
        '$location',
        '$window',
        '$timeout',
        '$interval',
        'httpRequest',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    function photoUploadProvider($location, $window, $timeout, $interval, httpRequest, constant, utils) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: function ($element, $attribute) {
                return $attribute.templateUrl || 'components/photo-upload/views/photo-upload-tpl.html';
            },
            link: function ($scope, $element, $attribute) {
                var vm = $scope;

                var successFn = vm.$eval($attribute.onSuccessFn),
                    failFn = vm.$eval($attribute.onFailFn),
                    getPhotoUploadUrlFn = vm.$eval($attribute.getUrlFn);
                var WX_DOWNLOAD_FILE = '/sns/weixin/download_file.json';

                function wxGetImg(id) {
                    httpRequest.getReq(WX_DOWNLOAD_FILE, {mediaId: id}).then(function (d) {
                        if (successFn) {
                            successFn(d, vm.photo.tmp.imgType, vm.photo);
                        }
                    }, function (d) {
                    })
                }

                function uploadPhoto(imageURI) {
                    vm.photo.doLock();
                    //此处执行文件上传的操作，上传成功后执行下面代码
                    var options = new FileUploadOptions(); //文件参数选项
                    options.fileKey = "file";//向服务端传递的file参数的parameter name
                    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);//文件名
                    options.mimeType = "image/jpeg";//文件格式，默认为image/jpeg

                    var ft = new FileTransfer();//文件上传类
                    ft.onprogress = function (progressEvt) {//显示上传进度条
                        if (progressEvt.lengthComputable) {
                            var per = Math.round(( progressEvt.loaded / progressEvt.total ) * 100);
                            navigator.notification.progressValue(vm.photo.fixedPercent(per));
                        }
                    };

                    navigator.notification.progressStart("提醒", "当前上传进度");
                    ft.upload(imageURI, encodeURI(getPhotoUploadUrlFn(vm.photo.tmp.imgType, vm.photo)), function (result) {
                        var response = $scope.$eval(result.response);
                        if (response && response.code === 200) {
                            if (successFn) {
                                successFn(response, vm.photo.tmp.imgType, vm.photo);
                            }
                            navigator.notification.progressStop();//停止进度条
                            utils.alert("文件上传成功");
                        } else {
                            if (failFn) {
                                failFn();
                            }
                            navigator.notification.progressStop();//停止进度条
                            utils.error("文件上传失败：" + response.msg);
                        }
                        vm.photo.unLock();
                        vm.photo.tmp.imgType = null;
                    }, function (err) {
                        if (failFn) {
                            failFn();
                        }
                        navigator.notification.progressStop();//停止进度条
                        utils.error("文件上传失败");
                        vm.photo.unLock();
                        vm.photo.tmp.imgType = null;
                    }, options, true);

                }

                function fromAlbum() {
                    if (navigator.camera) {
                        navigator.camera.getPicture(uploadPhoto, function (msg) {
                            //utils.error("获取图片失败:" + msg);
                        }, {
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            destinationType: Camera.DestinationType.FILE_URI
                        });
                    }

                    vm.photo.isVisible = false;
                }

                function fromCamera() {


                    if (utils.isMM()) {

                        if (window.WEIXIN_READY) {
                            wx.chooseImage({
                                count: 1,
                                sizeType: ['original', 'compressed'],
                                sourceType: ['camera'],
                                success: function (ids) {
                                    var localIds = ids.localIds;
                                    if (localIds && localIds.length > 0) {
                                        wx.uploadImage({
                                            localId: localIds[0],
                                            isShowProgressTips: 1,
                                            success: function (up) {
                                                var serverId = up.serverId;
                                                wxGetImg(serverId);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    } else if (navigator.camera) {
                        var maskType = vm.$eval($attribute.maskType);
                        navigator.camera.getPicture(uploadPhoto, function (msg) {
                            //utils.error("获取图片失败:" + msg);
                        }, {
                            quality: 80,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            destinationType: Camera.DestinationType.FILE_URI,
                            maskType: maskType
                        });
                    }

                    vm.photo.isVisible = false;
                }

                //phone 上传
                vm.photo = {
                    isVisible: false,
                    maskType: null,
                    dialogBeforeHide: function () {
                        return true;
                    },
                    dialogOpen: function (type, text, maskType) {
                        if (vm.photo.lock) {
                            return;
                        }
                        vm.photo.tmp.imgType = type;
                        vm.photo.tmp.text = text;

                        vm.photo.maskType = maskType;
                        vm.photo.isVisible = true;
                    },
                    dialogClose: function () {
                        vm.photo.isVisible = false;
                    },

                    fromAlbum: fromAlbum,
                    fromCamera: fromCamera,

                    lock: false,

                    timer: {
                        addTimer: null,
                        tmpLastPercent: 0,
                        lastPercent: 0
                    },

                    addPercent: function () {
                        // 如果没有变化增加
                        if (vm.photo.timer.lastPercent == vm.photo.timer.tmpLastPercent) {
                            vm.photo.timer.tmpLastPercent = vm.photo.timer.lastPercent = vm.photo.timer.lastPercent + 1;
                            if (vm.photo.lock) {
                                navigator.notification.progressValue(Math.min(vm.photo.timer.lastPercent, 99));
                            }
                        } else {
                            vm.photo.timer.tmpLastPercent = vm.photo.timer.lastPercent;
                        }
                    },

                    doLock: function () {
                        vm.photo.unLock();
                        vm.photo.lock = true;
                        vm.photo.timer.addTimer = $interval(vm.photo.addPercent, 1000);
                    },
                    unLock: function () {
                        vm.photo.lock = false;
                        vm.photo.timer.lastPercent = 0;
                        vm.photo.timer.tmpLastPercent = 0;
                        if (vm.photo.timer.addTimer) {
                            $interval.cancel(vm.photo.timer.addTimer);
                            vm.photo.timer.addTimer = null;
                        }
                    },

                    fixedPercent: function (per) {
                        var fixed = per;
                        if (fixed >= 40) {
                            fixed = fixed / 2 + 20;
                        }

                        fixed = Math.floor(Math.max(fixed, vm.photo.timer.lastPercent));
                        vm.photo.timer.lastPercent = Math.min(fixed, 99);
                        return vm.photo.timer.lastPercent;
                    },

                    tmp: {
                        imgType: null,
                        text: null
                    }
                };
            }
        };
    }

});