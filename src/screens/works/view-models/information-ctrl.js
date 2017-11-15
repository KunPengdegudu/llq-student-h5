define(['screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {
    'use strict';

    module.controller('WorksInformationCtrl', WorksInformation);


    WorksInformation.$inject = [
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

    function WorksInformation($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        var redirect = $stateParams.redirect ? window.decodeURIComponent($stateParams.redirect) : '/works/main';
        var _Id = $stateParams.id;
        var _termType = $stateParams.termType;
        var _corpId = $stateParams.corpId;
        vm.id = _Id;
        vm.corpId = _corpId;

        vm.isLogin = function () {
            return $rootScope.loginStatus;
        };

        vm.corpInformation = null;
        vm.frogUserInfo = null;
        vm.userInfo = null;
        vm.pageType = 'work';
        vm.switchTab = switchTab;
        vm.isActive = isActive;
        vm.goBack = goBack;

        vm.details = null;
        vm.listRequirementApplysStatus = null;
        vm.gotoExperienceIntern = gotoExperienceIntern;
        vm.judgeApplyStatus = judgeApplyStatus;

        //加载商品列表有关的三个函数
        vm.reload = reload;
        vm.getMsg = getMsg;
        vm.loadItems = loadItems;

        vm.changeWorkInformation = changeWorkInformation;
        vm.isSelf = isSelf;
        //加载社团工作列表
        vm.items = [];
        vm.canLoad = true;
        vm.getMoreInformation = getMoreInformation;
        vm.openApply = openApply;

        vm.gotoQtshe = gotoQtshe;

        function gotoQtshe(btnIdx) {
            if (btnIdx == 1) {
                httpRequest.getReq(urlHelper.getUrl('getQingtuansheApplyListUrl')).then(function (d) {
                    if (navigator.appupdate && navigator.appupdate.openUrlInner && navigator.appupdate.closeUrlInner) {
                        navigator.appupdate.openUrlInner('青团社',
                            d,
                            urlHelper.getUrl("backWorkExperience"));
                    } else {
                        utils.gotoBrowser(d);
                    }
                }, function (d) {
                    utils.error(d.msg)
                })
            }
        }


        vm.apply = {
            isVisible: false,
            content: null,
            closeDialog: function () {
                vm.apply.isVisible = false
            },
            doApply: function () {

                var params = {
                    requirementId: vm.id,
                    content: vm.apply.content
                };
                httpRequest.getReq(urlHelper.getUrl('sendApplyForRequirement'), null, {
                    type: 'POST',
                    isForm: true,
                    data: params,
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                    utils.alert('申请成功，等待boss确认!', vm.gotoExperienceIntern);
                }, function (d) {
                    if (d.code == 190500) {
                        utils.customDialog("提示", d.msg, "去完善信息,关闭", gotoQtshe);
                    }
                });
            }
        };


        function openApply() {
            if (vm.details.source == 'qtshe') {
                vm.apply.doApply();
            }
            else {
                if (vm.isLogin()) {
                    vm.apply.isVisible = true;
                } else {
                    utils.gotoUrl("/login");
                }
            }
        }

        function gotoExperienceIntern() {
            utils.gotoUrl('/works/experience?pageType=intern');
        }


        function judgeApplyStatus(id) {
            var requirementParams = {
                requirementId: id,
                userId: vm.frogUserInfo.userId,
                offset: 0,
                statusList: ['applying', 'markread', 'accept', 'finish', 'expired', 'closed', 'waiting_interview'],
                limit: 10
            };
            httpRequest.getReq(urlHelper.getUrl('listRequirementApplys'), null, {
                type: 'POST',
                isForm: false,
                data: requirementParams,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                if (d.items.length > 0) {
                    vm.listRequirementApplysStatus = false;
                } else {
                    vm.listRequirementApplysStatus = true;
                }
            }, function () {
                utils.error('亲，网络繁忙，兼职申请信息获取失败！');
            });
        }

        function changeWorkInformation(item) {
            vm.details = item;
            vm.pageType = 'work';
            loadItems();
            vm.id = item.id;
            judgeApplyStatus(vm.details.id);
        }

        function getMoreInformation(id, type, corpId) {
            var url = utils.getUrlWithParams('/works/information', {
                'redirect': utils.createRedirect($location),
                'id': id,
                'termType': type,
                'corpId': corpId

            });
            utils.gotoUrl(url);
        }

        function isSelf(id) {
            if (id == vm.id) {
                return false;
            }
            return true;
        }

        function goBack() {
            utils.gotoUrl(redirect);
        }

        function switchTab(pageType) {
            vm.pageType = pageType;
        }

        function isActive(pageType) {
            if (vm.pageType == pageType) {
                return true;
            }
            return false;
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

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                corpId: vm.corpId,
                offset: (pageIndex - 1) * 10,
                status: 'recruiting',
                limit: 10
            };


            httpRequest.getReq(urlHelper.getUrl("selectDetailRequirements"), {}, {
                type: 'POST',
                data: params,
                ignoreLogin: true,
                isForm: false,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                pageIndex++;
                var items = d.items;

                if (items && items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].logo) {
                            items[i].logo = utils.string2Json(items[i].logo);
                        } else {

                        }

                    }
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
            loadItems();
            var params = {
                id: vm.id,
                corpId: _corpId
            };

            httpRequest.getReq(urlHelper.getUrl('selectDetailRequirements'), {}, {
                ignoreLogin: true,
                type: 'POST',
                isForm: false,
                data: params,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                vm.details = d.items[0];
            }, function (d) {
                utils.error('获取失败')
            });
            httpRequest.getReq(urlHelper.getUrl("queryUserInfor"), {}, {
                ignoreLogin: true
            }).then(function (d) {
                vm.userInfo = d;
            });
            httpRequest.getReq(urlHelper.getUrl("getUserInfo"), {}, {
                ignoreLogin: true,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                vm.frogUserInfo = d;
                var requirementParams = {
                    requirementId: vm.id,
                    userId: vm.frogUserInfo.userId,
                    offset: (pageIndex - 1) * 10,
                    statusList: ['applying', 'markread', 'accept', 'finish', 'expired', 'closed', 'waiting_interview'],
                    limit: 10
                };
                httpRequest.getReq(urlHelper.getUrl('listRequirementApplys'), null, {
                    type: 'POST',
                    isForm: false,
                    data: requirementParams,
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                    if (d.items.length > 0) {
                        vm.listRequirementApplysStatus = false;
                    } else {
                        vm.listRequirementApplysStatus = true;
                    }
                });
            });

            httpRequest.getReq(urlHelper.getUrl('queryCorpDetailInfo'), {corpId: _corpId}, {
                ignoreLogin: true,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog'
            }).then(function (d) {
                if (d.logoUrl) {
                    d.logoUrl = utils.string2Json(d.logoUrl);
                }
                vm.corpInformation = d;
            })

        }

        init();
    }

});