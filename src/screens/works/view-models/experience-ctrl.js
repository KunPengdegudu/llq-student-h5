/**
 * Created by llq on 16-1-14.
 */
define(['screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {
    'use strict';

    module.controller('WorksExperienceCtrl', WorksExperience);


    WorksExperience.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$location',
        '$q',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT_UTILS'
    ];

    function WorksExperience($rootScope, $scope, $stateParams, $location, $q, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;
        var redirect = $stateParams.redirect ? window.decodeURIComponent($stateParams.redirect) : '/works/main',
            status = ($stateParams.status == 'do') ? $stateParams.status : 'do',
            pageType = ($stateParams.pageType == 'partTime') ? $stateParams.pageType : 'intern',
            userId = settingCache.get("__massfrog_user_id");

        //头部
        vm.pos = null;

        vm.goBack = goBack;
        vm.isActive = isActive;
        vm.switchTab = switchTab;
        vm.pageType = pageType;
        vm.termType = 'short';//short or long
        vm.canLoad = true;

        //加载商品列表有关的三个函数
        vm.reload = reload;
        vm.getMsg = getMsg;
        vm.loadItems = loadItems;
        vm.flushPage = flushPage;

        vm.clock = clock;//打卡
        vm.showCancel = showCancel;

        vm.status = status;
        vm.items = [];
        vm.detailsItems = [];
        vm.canShow = canShow;
        vm.options = {};
        vm.cityCode = null;
        vm.showOrder = showOrder;
        vm.confirmOrder = confirmOrder;
        vm.getMoreInformation = getMoreInformation;
        vm.cancelId = null;
        vm.userId = userId;
        vm.cancel = null;
        vm.gotoOrderConfirm = gotoOrderConfirm;

        //青团社
        vm.gotoQtshe = gotoQtshe;

        vm.cancel = {
            reason: 'personal',
            isVisible: false,
            closeDialog: function () {
                vm.cancel.isVisible = false;
            },
            dialogSubmit: function () {
                var params = {
                    id: vm.cancelId,
                    status: 'user_cancel'
                };
                if (vm.cancel.content) {
                    httpRequest.getReq(urlHelper.getUrl('updateFeedbackStatus'), null, {
                        type: 'POST',
                        isForm: true,
                        withCredentials: true,
                        withToken: true,
                        domain: 'massfrog',
                        data: params
                    }).then(function () {
                        vm.cancel.closeDialog();
                        vm.flushPage();
                    }, function () {
                        utils.error("网络异常，请重新提交！")
                    });
                } else {
                    utils.error("取消原因不能为空，请输入取消原因！")
                }
            }
        };

        vm.details = {
            isVisible: false,
            closeDialog: function () {
                vm.details.isVisible = false;
            }
        };


        function showCancel(id, source) {
            if (source == 'qtshe') {
                gotoQtshe();
            } else {
                vm.cancel.isVisible = true;
                vm.cancelId = id;
            }
        }

        function getMoreInformation(id, corpId) {
            var url = utils.getUrlWithParams('/works/information', {
                'redirect': utils.createRedirect($location),
                'id': id,
                'corpId': corpId
            });
            utils.gotoUrl(url);
            //if (utils.checkLogin($rootScope, $location, null, url)) {
            //    utils.gotoUrl(url);
            //}
        }

        vm.intern = {
            type: 'applying',
            status: 'applying',
            choseType: function (status) {
                vm.intern.type = status;
                vm.intern.status = status;
                canShow();
                pageIndex = 1;
                flushPage();
            }

        };
        vm.partTime = {
            type: status,
            choseType: function (type, status) {
                vm.partTime.type = type;
                vm.status = status;
                pageIndex = 1;
                flushPage();
            }
        };

        vm.selectReason = function (myReason) {
            vm.cancel.reason = myReason;
        };

        vm.isSelectReason = function (myReason) {
            return myReason == vm.cancel.reason;
        };


        function gotoOrderConfirm() {
            vm.pageType = 'partTime';
            vm.status = 'signed';
            flushPage();
        }

        //打卡签到
        function clock(id) {
            var params = {
                type: 'user_hand',
                orderId: id,
                address: vm.pos,
                userId: vm.userId
            };
            httpRequest.getReq(urlHelper.getUrl('insertBjobSign'), null, {
                ignoreLogin: true,
                type: 'POST',
                isForm: true,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog',
                data: params
            }).then(function (d) {
                utils.alert('签到成功!', flushPage);
            }, function (d) {
                utils.error('签到失败!');
            })
        }

        function confirmOrder(userId, requirementId, feedbackId, source) {
            if (source == 'qtshe') {
                gotoQtshe();
            } else {
                var params = {
                    userId: userId,
                    requirementId: requirementId,
                    feedbackId: feedbackId
                };
                httpRequest.getReq(urlHelper.getUrl('inquiryPersonOrder'), null, {
                    ignoreLogin: true,
                    type: 'POST',
                    isForm: true,
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog',
                    data: params
                }).then(function (d) {
                    utils.alert('您已获得工作，上班时候记得打卡哦!', gotoOrderConfirm);
                }, function (d) {
                    utils.error('创建工作失败');
                })
            }
        }

        function showOrder(index) {
            vm.detailsItems = vm.items[index];
            vm.details.isVisible = true;
        }

        //跳转链接

        function gotoQtshe() {
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

        function canShow(state) {
            if (state == vm.cityCode || vm.cityCode == null) {
                return true;
            }
            return false;
        }

        function switchTab(type) {
            vm.pageType = type;
            vm.items = [];
            //vm.orderby.orderType = 'default';
            pageIndex = 1;
            flushPage();
        }

        function isActive(type) {
            if (vm.pageType === type) {
                return true;
            }
            return false;
        }

        function goBack() {
            utils.gotoUrl(redirect);


        }

        function flushPage() {
            reload();
            vm.$emit('reload');
        }

        function reload() {
            pageIndex = 1;
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
        }

        function getMsg() {
            if (vm.items.length === 0) {
                return ' ';
            }
        }

        //加载函数

        function loadItems() {

            var dtd = $q.defer();
            var params = {
                userId: vm.userId,
                offset: (pageIndex - 1) * 10,
                limit: 10,
                status: vm.status
            };
            var orderParams={
                userId:vm.userId
            };

            if (vm.pageType == 'intern') {
                vm.queryUrl = 'listRequirementApplys';
                params.status = vm.intern.status;
            }
            else {
                vm.queryUrl = 'queryOrderDetail'
            }
            httpRequest.getReq(urlHelper.getUrl(vm.queryUrl), null, {
                type: 'POST',
                isForm: false,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog',
                data: params
            }).then(function (d) {
                pageIndex++;
                var items = d.items;
                httpRequest.getReq(urlHelper.getUrl('queryOrderDetail'), null, {
                    type: 'POST',
                    isForm: false,
                    data: orderParams
                }).then(function (d) {
                    if (d) {
                        var orderItems= d.items;
                        for(var m=0;m<orderItems.length;m++){
                            for(var n=0;n<items.length;n++){
                                if(orderItems[m].requirementId==items[n].requirementId){
                                    items[n].status='finished';
                                    if(vm.intern.status=='accept'){
                                        items.splice(n,1);
                                        console.log(items);
                                    }
                                }
                            }
                        }

                    }
                    if (vm.pageType == 'intern') {

                        if (items && items.length > 0) {

                            for (var i = 0; i < items.length; i++) {
                                vm.corpBaseInfo = items[i].requirement;
                                if (vm.corpBaseInfo && vm.corpBaseInfo.logo) {
                                    items[i].requirement.logo = utils.string2Json(items[i].requirement.logo);
                                }

                            }
                        }
                    }
                    else {
                        if (items && items.length > 0) {console.log(1);
                            for (var i = 0; i < items.length; i++) {
                                vm.corpBaseInfo = items[i].corpBaseInfo;
                                if (items[i].corpBaseInfo && items[i].corpBaseInfo.logoUrl) {
                                    items[i].corpBaseInfo.logoUrl = utils.string2Json(items[i].corpBaseInfo.logoUrl);
                                }

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

                });


            }, function () {
                dtd.reject();
            });
            return dtd.promise;
        }

        function init() {
            utils.getLocation(function (pos) {
                if (pos) {
                    vm.pos = JSON.stringify(pos);
                }
            });
        }

        init();

    }
})