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

    module.controller('WorksMainCtrl', WorksMain);

    ////////
    WorksMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        '$loadingOverlay',
        '$timeout',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function WorksMain($rootScope, $scope, $location, $stateParams, $q, $window, $loadingOverlay, $timeout, settingCache, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            loadingTimer;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                rightBtnType: "text",
                rightBtnAttrs: {
                    text: "城市",
                    hasIcon: true,
                    icon: "icon-bottom",
                    fn: function () {
                        vm.changeCity.openDialog();
                    }
                },
                title: "兼职中心",
                isShow: true,
                isShowRightBtn: true,
                leftBtnType: "back"
            }, $location);
        }

        vm.showTask = false;

        vm.isLogin = false;

        vm.openCityList = null;
        vm.totalAmount = 0;

        vm.bannerImgSrc = 'queryBanners';
        vm.bannerSrc = null;
        vm.hrefSrc = null;

        vm.gotoSignOn = gotoSignOn;
        vm.scanning = scanning;
        vm.getMoreInformation = getMoreInformation;
        vm.gotoNav = gotoNav;
        vm.gotoLogin = gotoLogin;

        vm.items = [];

        vm.defualtCity = constant.DEFAULT_CITY;
        vm.selectCity = {};
        vm.geography = {};

        vm.userId = null;
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

        function getMoreInformation(id, type, corpId) {
            var url = utils.getUrlWithParams('/works/information', {
                'redirect': utils.createRedirect($location),
                'id': id,
                'termType': type,
                'corpId': corpId

            });
            utils.gotoUrl(url);
        }

        function gotoLogin() {
            utils.gotoUrl("/login");
        }

        function getCityCodeWithCheck() {
            return vm.selectCity.cityCode || constant.DEFAULT_CITY.cityCode;
        }

        function gotoNav(type) {
            switch (type) {
                case "resume":
                    utils.gotoUrl("/works/resume");
                    break;
                case "transfer":
                    utils.gotoUrl("/profile/wallet");
                    break;
                case "bill":
                    utils.gotoUrl("/works/bill");
                    break;
                case "workPartTime":
                    utils.gotoUrl('/works/work?pageType=partTime&cityCode=' + getCityCodeWithCheck());
                    break;
                case "workIntern":
                    utils.gotoUrl('/works/work?pageType=intern&cityCode=' + getCityCodeWithCheck());
                    break;
                case "myWork":
                    utils.gotoUrl('/works/experience?redirect=' + utils.createRedirect($location) + '&pageType=partTime');
                    break;
                case "myTask":
                    utils.gotoUrl('/works/mytask');
                    break;
                case "wallet":
                    utils.gotoUrl('/profile/wallet');
                    break;
                case "myTest":
                    utils.gotoUrl('/works/myTest');
                    break;
                case "banner":
                    utils.gotoUrl(vm.hrefSrc);
                    break;
                default:
                    break;
            }
        }

        function gotoSignOn() {
            utils.gotoUrl('/works/experience?redirect=' + utils.createRedirect($location) + '&pageType=partTime&status=do')
        }

        function gotoAuthV1(idx) {
            if (idx == 2) {
                utils.gotoUrl("/auth/main");
            } else {
                utils.gotoUrl("/");
            }
        }

        vm.changeCity = {
            isVisible: false,
            getItemsTitle: function () {
                return "选择城市";
            },
            openDialog: function () {
                vm.changeCity.isVisible = true;
            },
            closeDialog: function () {
                vm.changeCity.isVisible = false;
            },
            selectOpenCityContents: function (item) {
                vm.selectCity = item || jq.extend({}, vm.defualtCity);
                $rootScope.navConfig.leftBtnAttrs.text = vm.selectCity.cityName;

                if ($rootScope.loginStatus) {
                    httpRequest.getReq(urlHelper.getUrl('updateLastCityCode'), null, {
                        isForm: true,
                        type: 'POST',
                        withCredentials: true,
                        withToken: true,
                        domain: 'massfrog',
                        data: {
                            cityCode: vm.selectCity.cityCode
                        }
                    });
                }

                reflush();

                vm.changeCity.closeDialog();
            },
            isSelectContents: function (item) {
                return item.cityCode == vm.selectCity.cityCode;
            }
        };


        vm.sign = {
            isVisible: false,
            getItemsTitle: function () {
                return "打卡上班";
            },
            openDialog: function () {
                vm.sign.isVisible = true;
            },
            closeDialog: function () {
                vm.sign.isVisible = false;
            }
        };

        function reflush() {
            var params = {
                cityCode: vm.selectCity.cityCode,
                sort: 'update_time',
                status: 'recruiting',
                order: 'desc',
                limit: 15,
                offset: 0
            };

            httpRequest.getReq(urlHelper.getUrl("selectDetailRequirements"), null, {
                ignoreLogin: true,
                data: params,
                type: 'POST',
                isForm: false,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                var items = d.items;
                if (items && items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i] && items[i].logo) {
                            items[i].logo = utils.string2Json(items[i].logo);
                        }
                    }
                    vm.items = items;
                } else {
                    vm.items = [];
                }
                loaderComplete();
            }, function (d) {
                loaderComplete();
            });
        }

        function getOpenCity(onSuccess) {
            if (vm.openCityList) {
                if (onSuccess) {
                    onSuccess(vm.openCityList);
                }
            } else {
                httpRequest.getReq(urlHelper.getUrl("getOpenCityList"), null, {
                    ignoreLogin: true,
                    type: "POST",
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                    vm.openCityList = d.items;
                    if (onSuccess) {
                        onSuccess(vm.openCityList);
                    }
                }, function (d) {
                    loaderComplete();
                });
            }
        }

        function scanning() {
            var params = {
                type: 'scan_code',
                address: '浙江零零期',
                userId: vm.userId
            };
            if (navigator.barcodescanner) {
                navigator.barcodescanner.scan(function (result) {
                    params.address = result.text;
                    httpRequest.getReq(urlHelper.getUrl('insertBjobSign'), null, {
                        ignoreLogin: true,
                        type: 'POST',
                        isForm: true,
                        withCredentials: true,
                        withToken: true,
                        domain: 'massfrog',
                        data: params
                    }).then(function (d) {
                        utils.alert('签到成功!');
                    }, function (d) {
                        utils.error('签到失败!');
                    })
                }, function (error) {
                    utils.alert("签到失败: " + error);
                });
            }
        }

        function loaderComplete() {
            $loadingOverlay.hide();

            if (loadingTimer) {
                $timeout.cancel(loadingTimer);
                loadingTimer = null;
            }
        }

        function showLoading() {
            var template = "<div class='ui-loading'><img class='ui-loading-img' src='../../assets/imgs/base/loading.gif' /><div class='ui-loading-text'>拼命加载中...</div></div></div>";
            $loadingOverlay.show(template);
            loadingTimer = $timeout(function () {
                $loadingOverlay.hide();
            }, 10000);
        }

        function bannerSrc() {
            if (vm.bannerImgSrc) {
                httpRequest.getReq(urlHelper.getUrl(vm.bannerImgSrc), null, {
                    ignoreLogin: true
                }).then(function (d) {
                    if (d.items && d.items.length != 0) {
                        vm.bannerSrc = d.items[0].imgUrl;
                        vm.hrefSrc = d.items[0].href;
                    }
                });
            }
        }

        function initTask() {
            utils.getGlobalConfig(function (config) {
                if (!jq.os.ios || (config && config["t_o"])) {
                    vm.showTask = true;
                    bannerSrc();
                }
            });
        }

        function init() {
            console.log($rootScope);

            initTask();

            function noLoginAction() {

                getOpenCity(function (d) {
                    utils.getLocation(function (pos) {
                        var match = false;
                        if (pos) {
                            vm.geography.citycode = pos.address.citycode;
                            for (var i = 0; i < d.length; i++) {
                                if (d[i].postCode && d[i].postCode == vm.geography.citycode) {
                                    vm.geography.cityName = vm.openCityList[i].cityName;

                                    if (!match) {
                                        vm.changeCity.selectOpenCityContents({
                                            cityCode: vm.openCityList[i].cityCode,
                                            cityName: vm.openCityList[i].cityName
                                        });
                                    }

                                    match = true;
                                    break;
                                }
                            }
                        }
                        if (!match) {
                            vm.changeCity.selectOpenCityContents();
                        }
                    }, function () {
                        vm.changeCity.selectOpenCityContents();
                    });
                });
            }

            // 获得地理位置
            function loginAction() {

                // 获得开通城市
                getOpenCity();

                // 获得地理位置
                httpRequest.getReq(urlHelper.getUrl("getUserInfo"), null, {
                    ignoreLogin: true,
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                    vm.userId = d.userId;

                    settingCache.set("__massfrog_user_id", d.userId);

                    // 选择城市
                    var match = false;
                    if (d.lastCityCode != null) {
                        vm.changeCity.selectOpenCityContents({
                            cityCode: d.lastCityCode,
                            cityName: d.lastCityName
                        });
                        match = true;
                    }
                    getOpenCity(function (d) {
                        utils.getLocation(function (pos) {
                            if (pos) {
                                vm.geography.citycode = pos.address.citycode;
                                for (var i = 0; i < d.length; i++) {
                                    if (d[i].postCode && d[i].postCode == vm.geography.citycode) {
                                        vm.geography.cityName = vm.openCityList[i].cityName;

                                        if (!match) {
                                            vm.changeCity.selectOpenCityContents({
                                                cityCode: vm.openCityList[i].cityCode,
                                                cityName: vm.openCityList[i].cityName
                                            });
                                        }

                                        match = true;
                                        break;
                                    }
                                }
                            }
                            if (!match) {
                                vm.changeCity.selectOpenCityContents();
                            }
                        });
                    });


                    // 保存用户基本信息
                    var params = {
                        userId: vm.userId,
                        realName: vm.data.name,
                        idNo: vm.data.identityNo,
                        sex: vm.data.sex,
                        email: vm.data.email,
                        phone: vm.data.phone,
                        schoolCode: vm.data.schoolCode
                    };
                    httpRequest.getReq(urlHelper.getUrl("updateUserBasicInfo"), null, {
                        type: "POST",
                        data: params,
                        isForm: true,
                        withCredentials: true,
                        withToken: true,
                        domain: 'massfrog'
                    });
                }, function (d) {
                    loaderComplete();
                });

            }

            httpRequest.getReq(urlHelper.getUrl('queryUserInfor'), null, {ignoreLogin: true})
                .then(function (d) {

                    //
                    vm.data = d;

                    //免登录
                    //if (d.completeStatus == "un_completed") {
                    //    utils.customDialog('亲，您未完成认证', '请先完成注册成为我们的会员！', '先逛逛,去注册', gotoAuthV1); // 去认证V1
                    //} else {
                    showLoading();
                    if (d && d.eduInfo) {
                        vm.data.schoolCode = d.eduInfo.schoolCode;
                    }

                    loginAction();
                    //}

                }, function () {
                    noLoginAction();
                });

            httpRequest.getReq(urlHelper.getUrl("getEwallet"), null, {ignoreLogin: true})
                .then(function (d) {
                    vm.isLogin = true;
                    vm.totalAmount = d.totalAmount;
                }, function () {
                    vm.isLogin = false;
                });
        }

        init();
    }

});