define([
    'screens/blanknote/module',
    'jq',
    'screens/blanknote/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('BlankNoteMainCtrl', BlankNoteMain);

    ////////
    BlankNoteMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        'httpRequest',
        'settingCache',
        '$loadingOverlay',
        '$timeout',
        'blankNoteUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function BlankNoteMain($rootScope, $scope, $location, $stateParams, $q, httpRequest, settingCache, $loadingOverlay, $timeout, urlHelper, constant, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "icon",
                leftBtnAttrs: {
                    icon: 'icon-service',
                    fn: function () {
                        utils.contactUs();
                    }
                },
                title: "信用钱包",
                isShow: true
            }, $location);
        }

        vm.isGraduation = false;

        function checkLogin() {
            if (!$rootScope.loginStatus) {
                utils.alert('未登录不能使用,请登录', function () {
                    utils.gotoUrl("/login");
                });
                return false;
            }
            return true;
        }

        vm.LHHStatus = null;
        vm.BYJStatus = null;

        function getCertProductList() {
            httpRequest.getReq(urlHelper.getUrl('getCertProductList'), null, {
                ignoreLogin: true
            }).then(function (d) {
                if (d) {
                    d.items.forEach(function (item, index) {
                        if (item.certProCode == 'LHH') {
                            vm.LHHStatus = item.censorResult.censorStatus;
                        }
                        if (item.certProCode == 'BYJ') {
                            vm.BYJStatus = item.censorResult.censorStatus;
                        }
                    });

                    if (vm.BYJStatus == 'passed') {
                        vm.disable = {
                            backgroundColor: '#ccc'
                        }
                    }
                }
            }, function (err) {
                utils.error(err.msg || '服务器忙，请稍后再试');
            })
        }

        vm.userGraduateStatue = false;
        vm.userGraduateError = null;
        function checkUserGraduateApply() {
            httpRequest.getReq(urlHelper.getUrl('checkUserGraduate'), null, {
                ignoreLogin: true
            }).then(function (d) {
                if (d) {
                    vm.userGraduateStatue = d;
                }
            }, function (err) {
                if (err.code == 748) {
                    vm.userGraduateError = err.msg;
                }

            })
        }

        vm.gotoLHH = function () {
            if ($rootScope.loginStatus) {
                if (vm.BYJStatus != 'passed') {
                    if (vm.LHHStatus == 'passed') {
                        if (vm.BYJStatus != 'passed') {
                            if (vm.userGraduateStatue) {
                                utils.customDialog("温馨提示", "系统检测到您已毕业，请在App中进行成人贷相关认证", "我知道了,下载App", function (idx) {
                                    if (idx == 2) {
                                        utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                                    }
                                });

                            } else {
                                if (vm.userGraduateError) {
                                    utils.alert(vm.userGraduateError);
                                } else {
                                    utils.gotoUrl(utils.getUrlWithParams('/blanknote/product', {
                                        name: '零花花',
                                        productType: 'LHH'
                                    }));
                                }
                            }
                        }
                    } else {
                        utils.customDialog("亲，您未完成认证", "您的认证未申请或暂未通过，当前无可用额度哦。请在APP中【我的认证】页查看当前认证状态。", "我知道了,下载App", function (idx) {
                            if (idx == 2) {
                                utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                            }
                        });
                    }
                }
            } else {
                utils.gotoUrl('/login');
            }
        };
        vm.gotoBYJ = function () {
            if ($rootScope.loginStatus) {
                if (vm.BYJStatus == 'passed') {
                    utils.gotoUrl(utils.getUrlWithParams('/blanknote/product', {
                        name: '成人贷',
                        productType: 'BYJ'
                    }))
                } else {
                    utils.customDialog("亲，您未完成认证", "您的认证在审核中或暂未通过，当前无可用额度哦。请在APP中【我的认证】页查看当前认证状态。", "我知道了,下载App", function (idx) {
                        if (idx == 2) {
                            utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                        }
                    });
                }
            } else {
                utils.gotoUrl('/login');
            }
        };

        vm.banner = {};
        function queryBanners() {
            httpRequest.getReq(urlHelper.getUrl('queryBanners'), {
                type: 'credit_wallet'
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items && d.items.length > 0) {
                    vm.banner = d.items[0];
                }
            })
        }

        vm.bannerClick = function () {
            if (vm.banner && vm.banner.href) {
                utils.gotoUrl('__browser://http://jieba-m.wodai.com/user/Propaganda?channelid=31');
            }
        }

        function init() {
            queryBanners();
            if ($rootScope.loginStatus) {
                getCertProductList();
                checkUserGraduateApply();
            }
        }

        init();

    }

});