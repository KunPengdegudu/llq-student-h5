/**
 * login login controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/weixin/module',
    'jq',
    'screens/weixin/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WeixinV1Ctrl', weixinV1);

    ////////
    weixinV1.$inject = [
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'weixinUrlHelper',
        'CONSTANT_UTILS'
    ];
    function weixinV1($scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        var spreadCode = $stateParams.spreadParam ? $stateParams.spreadParam : '';

        vm.position = {};

        vm.authSubmit = authSubmit;

        vm.data = {
            name: '',
            identityNo: '',
            sex: '',
            email: '',
            qq: '',
            schoolCode: '',
            eduSysType: '',
            beginTime: '',
            speciality: ''
        };

        vm.checkIdentityNo = checkIdentityNo;


        vm.school = {
            name: '',
            provinceCode: '',
            cityCode: '',
            code: ''
        };

        vm.label = {
            sex: '',
            eduSysType: ''
        };

        vm.schoolDialog = {
            isVisible: false,
            items: null,
            itemsType: 'province', // province,city,school
            keys: ['province', 'city', 'school'],
            attrs: {
                province: {
                    text: '省份',
                    nameField: "provinceName",
                    codeField: "provinceCode"
                },
                city: {
                    text: '城市',
                    nameField: "cityName",
                    codeField: "cityCode"
                },
                school: {
                    text: '学校',
                    nameField: "fullSchoolName",
                    codeField: "code"
                }
            },

            values: [],
            valueText: [],
            getItemsTitle: function () {
                return vm.schoolDialog.attrs[vm.schoolDialog.itemsType].text;
            },
            getItemName: function (item) {
                return item[vm.schoolDialog.attrs[vm.schoolDialog.itemsType].nameField];
            },
            getItemCode: function (item) {
                return item[vm.schoolDialog.attrs[vm.schoolDialog.itemsType].codeField];
            },
            checkSelected: function (item) {
                var idx = vm.schoolDialog.getIndex(),
                    codeField = vm.schoolDialog.attrs[vm.schoolDialog.keys[idx]].codeField;
                return (vm.school[codeField] == item[codeField]);
            },
            getIndex: function () {
                var idx = 0;
                for (; idx < vm.schoolDialog.keys.length; idx++) {
                    if (vm.schoolDialog.keys[idx] == vm.schoolDialog.itemsType) {
                        break;
                    }
                }
                return idx;
            },
            setValue: function (item) {
                var idx = vm.schoolDialog.getIndex();
                vm.schoolDialog.values[idx] = vm.schoolDialog.getItemCode(item);
                vm.schoolDialog.valueText[idx] = vm.schoolDialog.getItemName(item);
                vm.school[vm.schoolDialog.attrs[vm.schoolDialog.keys[idx]].codeField] = vm.schoolDialog.getItemCode(item);

                idx++;

                if (idx < vm.schoolDialog.keys.length) {
                    vm.schoolDialog.setItems(vm.schoolDialog.keys[idx]);
                } else {
                    vm.school.name = vm.schoolDialog.getItemName(item);
                    vm.schoolDialog.closeDialog();
                }
            },
            setItems: function (type) {
                vm.schoolDialog.itemsType = type;
                vm.schoolDialog.items = [];
                if (type == 'province') {
                    var requestParam = {};
                    httpRequest.getReq(urlHelper.getUrl('getAllProvinceList'), requestParam, {ignoreLogin: true})
                        .then(function (d) {
                            vm.schoolDialog.items = d.items;
                        });
                } else if (type == 'city') {
                    var requestParam = {
                        provinceCode: vm.schoolDialog.values[0]
                    };
                    httpRequest.getReq(urlHelper.getUrl('getCityListByProvince'), requestParam, {ignoreLogin: true})
                        .then(function (d) {
                            vm.schoolDialog.items = d.items;
                        });
                } else if (type == 'school') {
                    var requestParam = {
                        provinceCode: vm.schoolDialog.values[0],
                        cityCode: vm.schoolDialog.values[1]
                    };
                    httpRequest.getReq(urlHelper.getUrl('getSchoolList'), requestParam, {ignoreLogin: true})
                        .then(function (d) {
                            vm.schoolDialog.items = d.items;
                        });
                }
            },
            openDialog: function () {
                vm.schoolDialog.isVisible = true;
                vm.schoolDialog.values = [];
                vm.schoolDialog.valueText = [];
                vm.schoolDialog.setItems('province');
            },
            closeDialog: function () {
                vm.schoolDialog.isVisible = false;
            },
            goBack: function () {
                var idx = vm.schoolDialog.getIndex();
                idx--;
                if (idx < 0) {
                    vm.schoolDialog.closeDialog();
                } else {
                    vm.schoolDialog.setItems(vm.schoolDialog.keys[idx]);
                }
            }
        };

        vm.sexDialog = {
            isVisible: false,
            kv: {
                '0': '女',
                '1': '男'
            },
            items: [{
                key: '0',
                text: '女'
            }, {
                key: '1',
                text: '男'
            }],
            setValue: function (item) {
                vm.data.sex = item.key;
                vm.label.sex = item.text;
                vm.sexDialog.closeDialog();
            },
            checkSelected: function (item) {
                return (vm.data.sex == item.key);
            },
            getItemName: function (item) {
                return item.text;
            },
            openDialog: function () {
                vm.sexDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.sexDialog.isVisible = false;
            },
            goBack: function () {
                vm.sexDialog.closeDialog();
            }
        };

        vm.eduDialog = {
            isVisible: false,
            items: null,
            setValue: function (item) {
                vm.data.eduSysType = item.type;
                vm.label.eduSysType = item.desc;
                vm.eduDialog.closeDialog();
            },
            checkSelected: function (item) {
                return (vm.data.eduSysType == item.type);
            },
            getItemName: function (item) {
                return item.desc;
            },
            openDialog: function () {
                vm.eduDialog.isVisible = true;
                if (vm.eduDialog.items == null) {
                    httpRequest.getReq(urlHelper.getUrl('getEduSysList'), null, {ignoreLogin: true})
                        .then(function (d) {
                            vm.eduDialog.items = d.items;
                        });
                }
            },
            closeDialog: function () {
                vm.eduDialog.isVisible = false;
            },
            goBack: function () {
                vm.eduDialog.closeDialog();
            }
        };




        function checkAuthSubmit() {
            if (utils.isEmpty(vm.data.name)) {
                alert("姓名不能为空");
                return false;
            }
            if (utils.isEmpty(vm.data.identityNo)) {
                alert("身份证不能为空");
                return false;
            }
            if (!utils.checkID(vm.data.identityNo)) {
                alert("身份证格式不正确");
                return false;
            }
            if (utils.isEmpty(vm.data.sex)) {
                alert("性别不能为空");
                return false;
            }
            if (utils.isEmpty(vm.data.email)) {
                alert("邮箱不能为空");
                return false;
            }
            if (!utils.checkEmail(vm.data.email)) {
                alert("邮箱格式不正确");
                return false;
            }
            if (utils.isEmpty(vm.data.qq)) {
                alert("QQ号不能为空");
                return false;
            }
            if (utils.isEmpty(vm.data.schoolCode)) {
                alert("学校不能为空");
                return false;
            }
            if (utils.isEmpty(vm.data.eduSysType)) {
                alert("学制不能为空");
                return false;
            }
            if (utils.isEmpty(vm.data.beginTime)) {
                alert("入学时间不能为空");
                return false;
            }
            if (utils.isEmpty(vm.data.speciality)) {
                alert("专业不能为空");
                return false;
            }


            return true;

        }


        vm.agreementDialog = {
            isVisible: false,
            openDialog: function () {
                vm.agreementDialog.isVisible = true;
            },
            goBack: function () {
                vm.agreementDialog.isVisible = false;
            }
        };


        vm.school = {
            name: '',
            provinceCode: '',
            cityCode: '',
            code: ''
        };


        vm.schoolDialog = {
            isVisible: false,
            items: null,
            itemsType: 'province', // province,city,school
            keys: ['province', 'city', 'school'],
            attrs: {
                province: {
                    text: '省份',
                    nameField: "provinceName",
                    codeField: "provinceCode"
                },
                city: {
                    text: '城市',
                    nameField: "cityName",
                    codeField: "cityCode"
                },
                school: {
                    text: '学校',
                    nameField: "fullSchoolName",
                    codeField: "code"
                }
            },

            values: [],
            valueText: [],
            getItemsTitle: function () {
                return vm.schoolDialog.attrs[vm.schoolDialog.itemsType].text;
            },
            getItemName: function (item) {
                return item[vm.schoolDialog.attrs[vm.schoolDialog.itemsType].nameField];
            },
            getItemCode: function (item) {
                return item[vm.schoolDialog.attrs[vm.schoolDialog.itemsType].codeField];
            },
            checkSelected: function (item) {
                var idx = vm.schoolDialog.getIndex(),
                    codeField = vm.schoolDialog.attrs[vm.schoolDialog.keys[idx]].codeField;
                return (vm.school[codeField] == item[codeField]);
            },
            getIndex: function () {
                var idx = 0;
                for (; idx < vm.schoolDialog.keys.length; idx++) {
                    if (vm.schoolDialog.keys[idx] == vm.schoolDialog.itemsType) {
                        break;
                    }
                }
                return idx;
            },
            setValue: function (item) {
                var idx = vm.schoolDialog.getIndex();
                vm.schoolDialog.values[idx] = vm.schoolDialog.getItemCode(item);
                vm.schoolDialog.valueText[idx] = vm.schoolDialog.getItemName(item);
                vm.school[vm.schoolDialog.attrs[vm.schoolDialog.keys[idx]].codeField] = vm.schoolDialog.getItemCode(item);

                idx++;

                if (idx < vm.schoolDialog.keys.length) {
                    vm.schoolDialog.setItems(vm.schoolDialog.keys[idx]);
                } else {
                    vm.school.name = vm.schoolDialog.getItemName(item);
                    vm.schoolDialog.closeDialog();
                }
            },
            setItems: function (type) {
                vm.schoolDialog.itemsType = type;
                vm.schoolDialog.items = [];
                if (type == 'province') {
                    var requestParam = {};
                    httpRequest.getReq(urlHelper.getUrl('getAllProvinceList'), requestParam, {ignoreLogin:true})
                        .then(function (d) {
                            vm.schoolDialog.items = d.items;
                        });
                } else if (type == 'city') {
                    var requestParam = {
                        provinceCode: vm.schoolDialog.values[0]
                    };
                    httpRequest.getReq(urlHelper.getUrl('getCityListByProvince'), requestParam, {ignoreLogin:true})
                        .then(function (d) {
                            vm.schoolDialog.items = d.items;
                        });
                } else if (type == 'school') {
                    var requestParam = {
                        provinceCode: vm.schoolDialog.values[0],
                        cityCode: vm.schoolDialog.values[1]
                    };
                    httpRequest.getReq(urlHelper.getUrl('getSchoolList'), requestParam, {ignoreLogin:true})
                        .then(function (d) {
                            vm.schoolDialog.items = d.items;
                        });
                }
            },
            openDialog: function () {
                vm.schoolDialog.isVisible = true;
                vm.schoolDialog.values = [];
                vm.schoolDialog.valueText = [];
                vm.schoolDialog.setItems('province');
            },
            closeDialog: function () {
                vm.schoolDialog.isVisible = false;
            },
            goBack: function () {
                var idx = vm.schoolDialog.getIndex();
                idx--;
                if (idx < 0) {
                    vm.schoolDialog.closeDialog();
                } else {
                    vm.schoolDialog.setItems(vm.schoolDialog.keys[idx]);
                }
            }
        };

        vm.beginTimeDialog = {
            isVisible : false,
            groups : [
                {
                    index: 0,
                    title:"年",
                    items: []
                },
                {
                    index: 1,
                    title:"月",
                    items: []
                },
                {
                    index: 2,
                    title :"日",
                    items: []
                }

            ],
            slotData: function(){
                var today = new Date();
                var currentYear = today.getFullYear();
                var years = [];
                for(var i=currentYear-10; i<= currentYear; i++){
                    var yearItem = {};
                    yearItem.value = i;
                    yearItem.text = i + "";
                    years.push(yearItem);
                }
                vm.beginTimeDialog.groups[0].items = years;

                vm.beginTimeDialog.groups[1].items = [
                    {value:"01", text:"1月"},
                    {value:"02", text:"2月"},
                    {value:"03", text:"3月"},
                    {value:"04", text:"4月"},
                    {value:"05", text:"5月"},
                    {value:"06", text:"6月"},
                    {value:"07", text:"7月"},
                    {value:"08", text:"8月"},
                    {value:"09", text:"9月"},
                    {value:"10", text:"10月"},
                    {value:"11", text:"11月"},
                    {value:"12", text:"12月"}
                ]

            },
            goBack : function(){
                vm.beginTimeDialog.isVisible = false;
            },
            openDialog : function(){
                vm.beginTimeDialog.isVisible = true;
            },
            getItemsTitle : function(){
                return "入学时间";
            },
            setValues : function(values, isChangeDay){
                if(values[0] && values[1] ){
                    if(isChangeDay)
                        vm.beginTimeDialog.changeDays(values[0], values[1]);
                    else if(values[2]){
                        vm.data.beginTime = values[0] + "-" + values[1] + "-" + values[2];
                        vm.beginTimeDialog.isVisible = false;
                    }
                }

            },
            changeDays : function(year, month){

                year = parseInt(year);
                month = parseInt(month);

                var nextMonthYear, nextMonth;
                if(month < 12){
                    nextMonthYear = year;
                    nextMonth = month+1;
                }else{
                    nextMonthYear = year+1;
                    nextMonth = 1;
                }

                var beginDate = new Date();
                beginDate.setFullYear(year);
                beginDate.setMonth(month-1);
                beginDate.setDate(1);
                beginDate.setHours(0);
                beginDate.setMinutes(0);
                beginDate.setSeconds(0);

                var endDate = new Date();
                endDate.setFullYear(nextMonthYear);
                endDate.setMonth(nextMonth-1);
                endDate.setDate(1);
                endDate.setHours(0);
                endDate.setMinutes(0);
                endDate.setSeconds(0);

                var oneMonthTimeMS = endDate.getTime() - beginDate.getTime();
                var dayCount = oneMonthTimeMS / (1000*3600*24);
                var days = [];
                for(var i=1; i<=dayCount; i++){
                    var dayItem = {};
                    if(i < 10)
                        dayItem.value = "0" + i;
                    else
                        dayItem.value = "" + i;

                    dayItem.text = i;
                    days.push(dayItem);
                }
                vm.beginTimeDialog.groups[2].items = days;
            }

        };

        vm.beginTimeSp = {
            open: function () {
                if (navigator.sheetpicker) {
                    navigator.sheetpicker.show(vm.beginTimeSp.createSlotData(), function (selections) {
                        vm.data.beginTime = selections[0] + '-' + fixed(selections[1], 2) + '-' + fixed(selections[2], 2);
                        vm.$apply();
                    });
                }
            },

            createSlotData: function () {
                var now = new Date(),
                    values = [],
                    v = vm.data.beginTime;

                if (v != '') {
                    values.push(parseInt(v.substring(0, 4)));
                    values.push(parseInt(v.substring(5, 7)));
                    values.push(parseInt(v.substring(8, 10)));
                } else {
                    values.push(now.getFullYear());
                    values.push(9);
                    values.push(1);
                }

                var years = new Array(),
                    months = [{
                        key: 1,
                        text: '一月'
                    }, {
                        key: 2,
                        text: '二月'
                    }, {
                        key: 3,
                        text: '三月'
                    }, {
                        key: 4,
                        text: '四月'
                    }, {
                        key: 5,
                        text: '五月'
                    }, {
                        key: 6,
                        text: '六月'
                    }, {
                        key: 7,
                        text: '七月'
                    }, {
                        key: 8,
                        text: '八月'
                    }, {
                        key: 9,
                        text: '九月'
                    }, {
                        key: 10,
                        text: '十月'
                    }, {
                        key: 11,
                        text: '十一月'
                    }, {
                        key: 12,
                        text: '十二月'
                    }],
                    days = new Array();

                for (var i = now.getFullYear() - 10; i <= now.getFullYear(); i++) {
                    years.push({
                        key: i,
                        text: i + ""
                    });
                }

                for (var i = 1; i < 32; i++) {
                    days.push({
                        key: i,
                        text: i + ""
                    });
                }

                var config = new Array();
                config.push({
                    options: years,
                    default: [values[0]],
                    width: 120
                });
                config.push({
                    options: months,
                    default: [values[1]],
                    width: 120
                });
                config.push({
                    options: days,
                    default: [values[2]],
                    width: 100
                });

                return config;
            }
        };

        vm.submitTimes=0;
        function authSubmit() {
            // 更新学校代码
            vm.data.schoolCode = vm.school.code;

            //vm.data.device_token = vm.position.device_token;
            vm.data.device_type = vm.position.device_type;
            vm.data.location = vm.position.location;
            vm.data.app_name = vm.position.app_name;
            //vm.data.blackBox = vm.position.tongdun_token;
            vm.data.blackBox = "";

            if (checkAuthSubmit()) {
                httpRequest.getReq(urlHelper.getUrl('creditActiveM'), null, {
                    ignoreLogin: true,
                    type: 'POST',
                    data: vm.data
                }).then(function (d) {
                    vm.submitTimes++;
                    console.log('发送一次');
                    goDownload();
                }, function (d) {
                    alert("认证失败：" + d.msg);
                });
            }
        }

        function goDownload() {
            var r = confirm("亲，您已完成V1认证，是否安装零零期APP！");
            if (r) {
                utils.gotoUrl(urlHelper.getUrl('downloadApp'));
            }
        }

        function checkIdentityNo () {
            if(vm.data.identityNo) {
                if(vm.data.identityNo.length > 18){
                    vm.data.identityNo = vm.data.identityNo.substring(0, 18);
                }
                vm.data.identityNo = vm.data.identityNo.toUpperCase();
            }
        }

        function init() {

            vm.position.app_name = "student";
            vm.position.device_type = jq.os.ios ? "ios" : jq.os.android ? "android" : "";

            utils.getLocation(function (pos) {
                if (pos) {
                    vm.position.location = JSON.stringify(pos);
                }
            });

            httpRequest.getReq(urlHelper.getUrl('queryUserInfor'), null, {ignoreLogin: true})
                .then(function (d) {
                    vm.currentUserId = d.id;

                    vm.data.name = d.name;
                    vm.data.identityNo = d.identityNo;
                    vm.data.sex = d.sex;
                    vm.label.sex = vm.sexDialog.kv[d.sex];
                    vm.data.email = d.email;
                    vm.data.qq = d.qq;

                    vm.data.schoolCode = d.eduInfo.schoolCode;

                    if (d.eduInfo) {
                        if (d.eduInfo.schoolInfo) {
                            vm.school.name = d.eduInfo.schoolInfo.name;
                            vm.school.provinceCode = d.eduInfo.schoolInfo.provinceCode;
                            vm.school.cityCode = d.eduInfo.schoolInfo.cityCode;
                            vm.school.code = d.eduInfo.schoolInfo.code;
                        }
                        vm.data.eduSysType = d.eduInfo.eduSys;
                        if (vm.data.eduSysType) {
                            httpRequest.getReq(urlHelper.getUrl('getEduSysList'), null, {ignoreLogin: true})
                                .then(function (d) {
                                    vm.eduDialog.items = d.items;
                                    for (var i = 0; i < d.items.length; i++) {
                                        if (d.items[i].type == vm.data.eduSysType) {
                                            vm.label.eduSysType = d.items[i].desc;
                                            break;
                                        }
                                    }
                                });
                        }

                        if (d.eduInfo.eduBegin) {
                            var bt = new Date(d.eduInfo.eduBegin);
                            vm.data.beginTime = utils.dateFormat(bt, "yyyy-MM-dd");
                        }

                        vm.data.speciality = d.eduInfo.speciality;
                    }

                });

            var unIdentityNo = vm.$watch('data.identityNo', vm.checkIdentityNo, false);

            vm.$on('$destroy', function () {
                unIdentityNo();
            });
        }

        init();


    }

});