define(['angular',
    'jq',
    'text!components/share/views/share-tpl.html'
], function (angular, jq, shareTpl) {

    'use strict';

    angular
        .module('components.share', [])
        .directive('share', shareProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/share/views/share-tpl.html', shareTpl);
        }]);

    shareProvider.$inject = [
        '$location',
        '$window',
        '$timeout',
        'httpRequest',
        '$loadingOverlay',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    function shareProvider($location, $window, $timeout, httpRequest, $loadingOverlay, constant, utils) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/share/views/share-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope;

                var allowShareItems = [{
                    img: "../../assets/imgs/share/weixin.png",
                    text: "微信好友",
                    allow: !!(navigator.wechat && navigator.wechat.share),
                    fn: function () {
                        var Wechat = navigator.wechat;
                        if (Wechat) {
                            Wechat.isInstalled(function (installed) {
                                if (installed) {

                                    var param = {};

                                    param.scene = Wechat.Scene.SESSION;

                                    param.message = {
                                        title: vm.$eval($attribute.title),
                                        description: vm.$eval($attribute.description),
                                        thumb: vm.$eval($attribute.thumb),
                                        media: {
                                            type: Wechat.Type.WEBPAGE,
                                            webpageUrl: vm.$eval($attribute.shareUrl)
                                        }
                                    };

                                    Wechat.share(param, function () {
                                    }, function (reason) {
                                        utils.alert("分享失败：" + reason);
                                    });

                                } else {
                                    utils.alert("亲，您没有安装微信App，请安装后再进行分享。");
                                }
                            });
                        }
                    }
                }, {
                    img: "../../assets/imgs/share/timeline.png",
                    text: "微信朋友圈",
                    allow: !!(navigator.wechat && navigator.wechat.share),
                    fn: function () {
                        var Wechat = navigator.wechat;
                        if (Wechat) {
                            Wechat.isInstalled(function (installed) {
                                if (installed) {

                                    var param = {};

                                    param.scene = Wechat.Scene.TIMELINE;

                                    param.message = {
                                        title: vm.$eval($attribute.title),
                                        description: vm.$eval($attribute.description),
                                        thumb: vm.$eval($attribute.thumb),
                                        media: {
                                            type: Wechat.Type.WEBPAGE,
                                            webpageUrl: vm.$eval($attribute.shareUrl)
                                        }
                                    };

                                    Wechat.share(param, function () {
                                    }, function (reason) {
                                        utils.alert("分享失败：" + reason);
                                    });

                                } else {
                                    utils.alert("亲，您没有安装微信App，请安装后再进行分享。");
                                }
                            });
                        }
                    }
                }, {
                    img: "../../assets/imgs/share/weibo.png",
                    text: "新浪微博",
                    allow: !!(navigator.weibo && navigator.weibo.share),
                    fn: function () {
                        var Weibo = navigator.weibo;
                        if (Weibo) {
                            Weibo.isInstalled(function () {
                                var param = {
                                    defaultText: vm.$eval($attribute.title),
                                    title: vm.$eval($attribute.title),
                                    description: vm.$eval($attribute.description),
                                    imageUrl: vm.$eval($attribute.thumb),
                                    url: vm.$eval($attribute.shareUrl)
                                };

                                Weibo.share(param, function (msg) {
                                }, function (msg) {
                                    utils.alert("分享失败: " + msg);
                                });
                            }, function () {
                                utils.alert("亲，您没有安装新浪微博App，请安装后再进行分享。");
                            });
                        }
                    }
                }, {
                    img: "../../assets/imgs/share/qzone.png",
                    text: "QQ空间",
                    allow: !!(navigator.qq && navigator.qq.shareToQzone),
                    fn: function () {
                        var QQ = navigator.qq;
                        if (QQ) {
                            QQ.checkClientInstalled(function () {
                                var param = {
                                    title: vm.$eval($attribute.title),
                                    description: vm.$eval($attribute.description),
                                    imageUrl: [vm.$eval($attribute.thumb)],
                                    url: vm.$eval($attribute.shareUrl)
                                };

                                QQ.shareToQzone(function (msg) {
                                }, function (msg) {
                                    utils.alert("分享失败: " + msg);
                                }, param);
                            }, function () {
                                utils.alert("亲，您没有安装QQ App，请安装后再进行分享。");
                            });
                        }
                    }
                }, {
                    img: "../../assets/imgs/share/qq.png",
                    text: "QQ",
                    allow: !!(navigator.qq && navigator.qq.shareToQQ),
                    fn: function () {
                        var QQ = navigator.qq;
                        if (QQ) {
                            QQ.checkClientInstalled(function () {
                                var param = {
                                    appName: "零零期分期",
                                    title: vm.$eval($attribute.title),
                                    description: vm.$eval($attribute.description),
                                    imageUrl: vm.$eval($attribute.thumb),
                                    url: vm.$eval($attribute.shareUrl)
                                };

                                QQ.shareToQQ(function (msg) {
                                }, function (msg) {
                                    utils.alert("分享失败: " + msg);
                                }, param);
                            }, function () {
                                utils.alert("亲，您没有安装QQ App，请安装后再进行分享。");
                            });
                        }
                    }
                }, {
                    img: "../../assets/imgs/share/favorite.png",
                    text: "微信收藏",
                    allow: !!(navigator.wechat && navigator.wechat.share),
                    fn: function () {
                        var Wechat = navigator.wechat;
                        if (Wechat) {
                            Wechat.isInstalled(function (installed) {
                                if (installed) {

                                    var param = {};

                                    param.scene = Wechat.Scene.FAVORITE;

                                    param.message = {
                                        title: vm.$eval($attribute.title),
                                        description: vm.$eval($attribute.description),
                                        thumb: vm.$eval($attribute.thumb),
                                        media: {
                                            type: Wechat.Type.WEBPAGE,
                                            webpageUrl: vm.$eval($attribute.shareUrl)
                                        }
                                    };

                                    Wechat.share(param, function () {
                                    }, function (reason) {
                                        utils.alert("收藏失败：" + reason);
                                    });

                                } else {
                                    utils.alert("亲，您没有安装微信App，请安装后再进行收藏。");
                                }
                            });
                        }
                    }
                }, {
                    img: "../../assets/imgs/share/txwb.png",
                    text: "腾讯微博",
                    allow: false,
                    fn: function () {

                    }
                }, {
                    img: "../../assets/imgs/share/renren.png",
                    text: "人人网",
                    allow: false,
                    fn: function () {

                    }
                }];

                vm.shareObject = {

                    items: new Array(),

                    isVisible: false,
                    dialogOpen: function () {
                        vm.shareObject.isVisible = true;
                    },
                    dialogClose: function () {
                        vm.shareObject.isVisible = false;
                    }
                };

                for (var i = 0; i < allowShareItems.length; i++) {
                    if (allowShareItems[i].allow) {
                        vm.shareObject.items.push(allowShareItems[i]);
                    }
                }
            }
        };
    }

});