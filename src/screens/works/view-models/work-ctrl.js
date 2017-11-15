define(['screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {
    'use strict';

    module.controller('WorksWorkCtrl', WorksWork);


    WorksWork.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    function WorksWork($rootScope, $scope, $location, $stateParams, $q, settingCache, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;
        var redirect = $stateParams.redirect ? window.decodeURIComponent($stateParams.redirect) : '/works/main',
            pageType = ($stateParams.pageType == 'partTime') ? $stateParams.pageType : 'intern',
            cityCode = $stateParams.cityCode || constant.DEFAULT_CITY.cityCode;

        vm.options = {
            termType: 'short',
            requirementTypeId: null,
            title: null,            //名称
            queryBeginTime: null,   //起始时间
            queryEndTime: null,     //结束时间
            status: null,
            sort: 'update_time',       //根据某个字段排序
            order: 'desc',      //desc or asc
            limit: null,    //每页显示
            offset: null,
            cityCode: cityCode,
            areaCode: null,
            category: null,
            source: null
        };


        //头部
        vm.goBack = goBack;
        vm.isActive = isActive;
        vm.switchTab = switchTab;
        vm.pageType = pageType;
        vm.isInternAbnormal = true;
        vm.isPartTimeAbnormal = true;
        vm.selectOption = selectOption;
        vm.flushPage = flushPage;
        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;
        vm.choseCategory = choseCategory;

        //工作详情
        vm.gotoExperienceIntern=gotoExperienceIntern;
        vm.detailsView = {
            isVisible:false,
            closeDialog:function(){
                vm.detailsView.isVisible=false
            },
            doApply: function () {
                var params = {
                    requirementId: vm.details.id
                };
                httpRequest.getReq(urlHelper.getUrl('sendApplyForRequirement'), null, {
                    ignoreLogin: true,
                    type: 'POST',
                    isForm: true,
                    data: params,
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                    utils.alert('申请成功，等待boss确认!', vm.gotoExperienceIntern);
                }, function (d) {
                    if(d.code==190500){
                        utils.customDialog("提示", d.msg, "去完善信息,关闭", gotoQtshe);
                    }else{
                        utils.alert(d.msg);}
                });
            }
        };
        vm.details=null;

        //加载商品列表有关的三个函数
        vm.reload = reload;
        vm.getMsg = getMsg;
        vm.loadItems = loadItems;


        vm.getMoreInformation = getMoreInformation;

        function getMoreInformation(item) {
            if (!item.corpId) {
               vm.details=item;
                vm.detailsView.isVisible=true;
            } else {
                var url = utils.getUrlWithParams('/works/information', {
                    'redirect': utils.createRedirect($location),
                    'id': item.id,
                    'termType': item.type,
                    'corpId': item.corpId

                });
                utils.gotoUrl(url);
                //if (utils.checkLogin($rootScope, $location, null, url)) {
                //    utils.gotoUrl(url);
                //}
            }
        }

        vm.gotoQtshe=gotoQtshe;

        function gotoQtshe(btnIdx){
            if(btnIdx==1){
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

        function gotoExperienceIntern() {
            utils.gotoUrl('/works/experience?pageType=intern');
        }

        function choseCategory() {
            if (vm.pageType == 'intern') {
                vm.options.category = vm.intern.filterList
            }
            else {
                vm.options.category = vm.filterDialog.categoryList
            }
        }

        function switchTab(type, termType) {
            vm.pageType = type;
            vm.options.termType = termType;
            vm.items = [];
            choseCategory();
            dialogClose();
            vm.orderby.orderType = 'default';
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

        //排序主名称
        vm.intern = {
            cityName: '全城',
            filterName: '全部',
            smartName: '发布时间',
            sourceName: '所有来源'
        };
        vm.partTime = {
            cityName: '全城',
            filterName: '全部',
            smartName: '发布时间',
            timeName: '时间',
            sourceName: '所有来源'
        };


        vm.orderby = {
            orderType: "default",
            clickDefault: function () {
                if (vm.orderby.orderType != "default") {
                    vm.orderby.orderType = "default";
                    vm.filterDialog.dialogClose();
                    vm.filterParams = {};
                    //flushPage();
                }
            },
            clickCity: function () {
                vm.cityDialog.dialogOpen();
                vm.orderby.orderType = "city";
            },
            clickFilter: function () {
                vm.filterDialog.dialogOpen();
                vm.orderby.orderType = "filter";
            },
            clickTime: function () {
                vm.timeDialog.dialogOpen();
                vm.orderby.orderType = 'time';
            },
            clickSmart: function () {
                vm.smartDialog.dialogOpen();
                vm.orderby.orderType = "smart";
            },
            clickSource: function () {
                vm.sourceDialog.dialogOpen();
                vm.orderby.orderType = "source";
            }
        };


        //排序选项栏

        vm.cityDialog = {
            isVisible: false,
            dialogOpen: function () {
                if (vm.cityDialog.isVisible) {
                    dialogClose();
                } else {
                    dialogClose();
                    vm.cityDialog.isVisible = true;
                    jq("body").find(".work-main").css("z-index", 570);
                }
            }
        };
        vm.sourceDialog = {
            isVisible: false,
            dialogOpen: function () {
                if (vm.sourceDialog.isVisible) {
                    dialogClose();
                } else {
                    dialogClose();
                    vm.sourceDialog.isVisible = true;
                    jq("body").find(".work-main").css("z-index", 570);
                }
            }
        };
        vm.timeDialog = {
            isVisible: false,
            dialogOpen: function () {
                if (vm.timeDialog.isVisible) {
                    dialogClose();
                } else {
                    dialogClose();
                    vm.timeDialog.isVisible = true;
                    jq("body").find(".work-main").css("z-index", 570);
                }
            }
        };
        vm.smartDialog = {
            isVisible: false,
            dialogOpen: function () {
                if (vm.smartDialog.isVisible) {
                    dialogClose();
                } else {
                    dialogClose();
                    vm.smartDialog.isVisible = true;
                    jq("body").find(".work-main").css("z-index", 570);
                }
            }
        };

        vm.filterDialog = {
            isVisible: false,
            categoryList: null,
            selectedCategoryId: null,  //设置选择颜色
            selectedBrandId: null,
            dialogOpen: function () {
                if (vm.filterDialog.isVisible) {
                    dialogClose();
                } else {
                    dialogClose();
                    vm.filterDialog.isVisible = true;
                    jq("body").find(".work-main").css("z-index", 570);
                }
            }
        };

        function selectOption(id, name) {
            switch (vm.pageType) {
                case 'intern':
                    switch (vm.orderby.orderType) {
                        case 'city':
                            vm.intern.cityName = name;
                            vm.options.areaCode = id;
                            break;
                        case 'filter':
                            vm.intern.filterName = name;
                            vm.options.requirementTypeId = id;
                            break;
                        case 'smart':
                            vm.intern.smartName = name;
                            vm.options.sort = id;
                            break;
                        case 'source':
                            vm.intern.sourceName = name;
                            vm.partTime.sourceName = name;
                            vm.options.source = id;
                            break;
                    }
                    break;
                case 'partTime':
                    switch (vm.orderby.orderType) {
                        case 'city':
                            vm.partTime.cityName = name;
                            vm.options.areaCode = id;
                            break;
                        case 'filter':
                            vm.partTime.filterName = name;
                            vm.options.requirementTypeId = id;
                            break;
                        case 'smart':
                            vm.partTime.smartName = name;
                            vm.options.sort = id;
                            break;
                        case 'time':
                            vm.partTime.timeName = name;
                            break;
                        case 'source':
                            vm.partTime.sourceName = name;
                            vm.intern.sourceName = name;
                            vm.options.source = id;
                            break;
                    }
                    break;
            }
            dialogClose();
            flushPage();
        }

        vm.dialogBeforeHide = dialogBeforeHide;

        function dialogBeforeHide() {
            jq("body").find(".work-main").css("z-index", null);
            return true;
        }

        function dialogClose() {
            vm.cityDialog.isVisible = false;
            vm.timeDialog.isVisible = false;
            vm.smartDialog.isVisible = false;
            vm.filterDialog.isVisible = false;
            vm.sourceDialog.isVisible = false;
            jq("body").find(".work-main").css("z-index", null);
        }


        function flushPage() {
            reload();
            vm.$emit('reload');
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

        //加载函数

        function loadItems() {
            var dtd = $q.defer();
            var params = {
                requirementTypeId: null,
                termType: null,
                offset: (pageIndex - 1) * 10,
                limit: 10,
                cityCode: vm.options.cityCode,
                areaCode: null,
                sort: 'update_time',
                status: 'recruiting',
                source: vm.options.source,
                order: 'desc'
            };

            if (vm.pageType == 'partTime') {
                params.termType = 'short';
            }
            else {
                params.termType = 'long'
            }
            params.sort = vm.options.sort;
            params.areaCode = vm.options.areaCode;
            params.requirementTypeId = vm.options.requirementTypeId;
            httpRequest.getReq(urlHelper.getUrl('selectDetailRequirements'), null, {
                ignoreLogin: true,
                type: 'POST',
                isForm: false,
                withCredentials: true,
                withToken: true,
                domain: 'massfrog',
                data: params
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
            httpRequest.getReq(urlHelper.getUrl('queryAllFRequirementTypes'), null,
                {
                    ignoreLogin: true,
                    type: 'POST',
                    isForm: false,
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                if (d.items.length >= 1) {
                    vm.filterDialog.categoryList = d.items[0].subList;
                    vm.intern.filterList = d.items[1].subList;
                    choseCategory();
                }
            });

            httpRequest.getReq(urlHelper.getUrl('getAreasCityCode'), {cityCode: vm.options.cityCode},
                {
                    ignoreLogin: true,
                    withCredentials: true,
                    withToken: true,
                    domain: 'massfrog'
                }).then(function (d) {
                vm.areasList = d.items
            })

        }

        init();

    }

});