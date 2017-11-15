define(['angular',
    'jq',
    'text!components/address/views/address-tpl.html'
], function (angular, jq, addressTpl) {

    'use strict';

    angular
        .module('components.address', [])
        .directive('addressInfo', addressProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/address/views/address-tpl.html', addressTpl);
        }]);

    addressProvider.$inject = [
        '$location',
        '$window',
        '$timeout',
        'httpRequest',
        '$rootScope',
        '$loadingOverlay',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    var SHOW_DELIVERY_LIST = '/m/s/delivery/show_delivery_list.json';
    var GET_DELIVERY = "/m/s/delivery/get_delivery.json";
    var ADD_DELIVERY = "/m/s/delivery/add_delivery.json";
    var MODIFY_DELIVERY = "/m/s/delivery/modify_delivery.json";
    var DEL_DELIVERY = "/m/s/delivery/del_delivery.json";

    var GET_ALL_PROVINCE_LIST = "/register/getAllProvinceList.json"; //
    var GET_CITY_LIST_PROVINCE = "/register/getCityListByProvince.json"; // provinceCode
    var GET_AREA_LIST_CITY = "/register/getAreaListByCity.json"; // cityCode
    var GET_STREET_lIST_BY_AREA_CODE = "/register/getStreetListByAreaCode.json"; // areaCode

    function addressProvider($location, $window, $timeout, httpRequest, $rootScope, $loadingOverlay, constant, utils) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'components/address/views/address-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope;

                var chooseAddressFn = vm.$eval($attribute.chooseAddressFn);

                var _addressId = vm.$eval($attribute.addressId);

                vm.getFullAddress = function (item) {
                    var addr = "";

                    if (item.province) {
                        addr += item.province;
                    }

                    if (item.city) {
                        addr += item.city;
                    }

                    if (item.area) {
                        addr += item.area;
                    }

                    if (item.streetName) {
                        addr += item.streetName;
                    }

                    if (item.address) {
                        addr += item.address;
                    }

                    return addr;
                };


                vm.addressDialog = {
                    isVisible: false,
                    items: null,
                    selectItem: null,
                    openDialog: function () {
                        if ($rootScope.loginStatus) {
                            vm.addressDialog.isVisible = true;
                        } else {
                            utils.gotoUrl("/login");
                        }

                    },
                    closeDialog: function () {
                        vm.addressDialog.isVisible = false;
                    },
                    isAddressListEmpty: function () {
                        if (vm.addressDialog.items && vm.addressDialog.items.length > 0) {
                            return false;
                        }
                        return true;
                    },
                    chooseAddress: function (index) {
                        vm.addressDialog.selectItem = vm.addressDialog.items[index];
                        vm.addressDialog.closeDialog();
                        if (chooseAddressFn) {
                            chooseAddressFn(vm.addressDialog.selectItem);
                        }
                    },
                    initAddress: function () {
                        vm.addressDialog.flushItems(true);
                    },
                    flushItems: function (withChoose) {
                        var requestParam = {};
                        if ($rootScope.loginStatus) {
                            httpRequest.getReq(SHOW_DELIVERY_LIST, requestParam)
                                .then(function (d) {
                                    vm.addressDialog.items = d.items;

                                    if (d.items && d.items.length > 0) {
                                        // 如果selectItem不为空，按照id从新赋值，如果为空，取默认值
                                        if (!vm.selectedAddressId) {
                                            if (vm.addressDialog.selectItem) {
                                                var selectItemId = vm.addressDialog.selectItem.id;
                                                vm.addressDialog.selectItem = null;
                                                for (var i = 0; i < d.items.length; i++) {
                                                    if (d.items[i].addressId == selectItemId) {
                                                        vm.addressDialog.selectItem = d.items[i];
                                                    }
                                                }
                                            } else if (_addressId) {
                                                vm.addressDialog.selectItem = d.items[0];
                                                for (var i = 0; i < d.items.length; i++) {
                                                    if (d.items[i].addressId == _addressId) {
                                                        vm.addressDialog.selectItem = d.items[i];
                                                    }
                                                }
                                            } else {
                                                vm.addressDialog.selectItem = d.items[0];
                                                for (var i = 0; i < d.items.length; i++) {
                                                    if (d.items[i].default) {
                                                        vm.addressDialog.selectItem = d.items[i];
                                                    }
                                                }
                                            }
                                        } else {
                                            for (var j = 0; j < d.items.length; j++) {
                                                if (d.items[j].addressId == vm.selectedAddressId) {
                                                    vm.addressDialog.selectItem = d.items[j];
                                                }
                                            }
                                        }

                                    } else {
                                        vm.addressDialog.selectItem = null;
                                    }

                                    if (withChoose) {
                                        if (chooseAddressFn) {
                                            chooseAddressFn(vm.addressDialog.selectItem);
                                        }
                                    }
                                });
                        }
                    }
                };

                vm.editAddressDialog = {
                    isVisible: false,
                    openDialog: function () {
                        vm.editAddressDialog.isVisible = true;
                    },
                    closeDialog: function () {
                        vm.editAddressDialog.isVisible = false;
                    }
                };

                vm.addAddressDialog = {
                    isVisible: false,
                    item: {},
                    isNew: false,
                    openDialog: function (isNew) {
                        if (isNew) {
                            vm.addAddressDialog.item = {};
                            vm.addAddressDialog.isNew = true;
                        } else {
                            vm.addAddressDialog.isNew = false;
                        }
                        vm.addAddressDialog.isVisible = true;
                    },
                    closeDialog: function () {
                        vm.addAddressDialog.isVisible = false;
                    },
                    getTitleText: function () {
                        if (vm.addAddressDialog.isNew) {
                            return "新增收货地址";
                        }
                        return "修改收货地址";
                    },
                    check: function () {
                        // check
                        if (utils.isEmpty(vm.addAddressDialog.item.name)) {
                            utils.error("收货人姓名不能为空");
                            return false;
                        }
                        if (utils.isEmpty(vm.addAddressDialog.item.phone)) {
                            utils.error("联系电话不能为空");
                            return false;
                        }
                        if (!utils.checkMobile(vm.addAddressDialog.item.phone)) {
                            utils.error("联系电话格式不正确");
                            return false;
                        }
                        if (utils.isEmpty(vm.addAddressDialog.item.pca)) {
                            utils.error("省市区不能为空");
                            return false;
                        }
                        if (utils.isEmpty(vm.addAddressDialog.item.address)) {
                            utils.error("详细地址不能为空");
                            return false;
                        }
                        return true;
                    },
                    save: function () {
                        var checked = vm.addAddressDialog.check();
                        if (checked) {
                            var addressItem = vm.addAddressDialog.item;
                            console.log(addressItem)
                            var requestParam = {
                                address: addressItem.address,
                                provinceCode: addressItem.provinceCode,
                                cityCode: addressItem.cityCode,
                                areaCode: addressItem.areaCode,
                                name: addressItem.name,
                                phone: addressItem.phone,
                                streetCode: addressItem.streetCode
                            };
                            if (utils.isEmpty(vm.addAddressDialog.item.addressId)) {
                                httpRequest.getReq(ADD_DELIVERY, null, {
                                    type: 'POST',
                                    data: requestParam
                                }).then(function (d) {
                                    vm.addressDialog.flushItems();
                                    vm.addAddressDialog.closeDialog();
                                    vm.editAddressDialog.closeDialog();
                                }, function (d) {
                                    utils.error(d.msg);
                                });
                            } else {
                                requestParam.addressId = vm.addAddressDialog.item.addressId;
                                httpRequest.getReq(MODIFY_DELIVERY, null, {
                                    type: 'POST',
                                    data: requestParam
                                }).then(function (d) {
                                    vm.addressDialog.flushItems();
                                    vm.addAddressDialog.closeDialog();
                                    vm.editAddressDialog.closeDialog();
                                }, function (d) {
                                    utils.error(d.msg);
                                });
                            }
                        }
                    },
                    modify: function (item) {
                        vm.addAddressDialog.item = item;
                        if (!item.streetName) {
                            vm.addAddressDialog.item.pca = item.province + item.city + item.area;
                        } else {
                            vm.addAddressDialog.item.pca = item.province + item.city + item.area + item.streetName;
                        }
                        vm.addAddressDialog.openDialog();
                    },
                    del: function () {
                        utils.confirm("亲，是否确定要删除此地址", function (buttonIndex) {
                            if (buttonIndex == 2) {
                                var requestParam = {
                                    'address_id': vm.addAddressDialog.item.addressId
                                };
                                httpRequest.getReq(DEL_DELIVERY, requestParam)
                                    .then(function (d) {
                                        vm.addressDialog.flushItems();
                                        vm.addAddressDialog.closeDialog();
                                    }, function (d) {
                                        utils.error("删除地址失败");
                                    });
                            }

                        });
                    },
                    getPca: function () {
                        return "";
                    }
                };

                vm.pcaDialog = {
                    isVisible: false,
                    items: null,
                    itemsType: 'province', // province,city,area,street
                    keys: ['province', 'city', 'area', 'street'],
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
                        area: {
                            text: '区县',
                            nameField: "areaName",
                            codeField: "areaCode"
                        },
                        street: {
                            text: '街道',
                            nameField: "streetName",
                            codeField: "streetCode"
                        }
                    },
                    values: [],
                    valueText: [],
                    getItemsTitle: function () {
                        return vm.pcaDialog.attrs[vm.pcaDialog.itemsType].text;
                    },
                    getItemName: function (item) {
                        return item[vm.pcaDialog.attrs[vm.pcaDialog.itemsType].nameField];
                    },
                    getItemCode: function (item) {
                        return item[vm.pcaDialog.attrs[vm.pcaDialog.itemsType].codeField];
                    },
                    checkSelected: function (item) {


                        var idx = vm.pcaDialog.getIndex(),
                            codeField = vm.pcaDialog.attrs[vm.pcaDialog.keys[idx]].codeField;
                        return (vm.addAddressDialog.item[codeField] == item[codeField]);
                    },
                    getIndex: function () {
                        var idx = 0;
                        for (; idx < vm.pcaDialog.keys.length; idx++) {
                            if (vm.pcaDialog.keys[idx] == vm.pcaDialog.itemsType) {
                                break;
                            }
                        }
                        return idx;
                    },
                    setValue: function (item) {
                        console.log(item);

                        var idx = vm.pcaDialog.getIndex();

                        vm.pcaDialog.values[idx] = vm.pcaDialog.getItemCode(item);
                        vm.pcaDialog.valueText[idx] = vm.pcaDialog.getItemName(item);
                        idx++;

                        if (idx < vm.pcaDialog.keys.length) {
                            vm.pcaDialog.setItems(vm.pcaDialog.keys[idx]);
                        } else {
                            vm.addAddressDialog.item.pca = "";
                            for (var i = 0; i < vm.pcaDialog.keys.length; i++) {
                                vm.addAddressDialog.item[vm.pcaDialog.attrs[vm.pcaDialog.keys[i]].codeField] = vm.pcaDialog.values[i];
                                vm.addAddressDialog.item.pca = vm.addAddressDialog.item.pca + vm.pcaDialog.valueText[i];
                            }
                            vm.pcaDialog.closeDialog();
                        }


                    },
                    setItems: function (type) {
                        vm.pcaDialog.itemsType = type;
                        vm.pcaDialog.items = [];
                        if (type == 'province') {
                            var requestParam = {};
                            httpRequest.getReq(GET_ALL_PROVINCE_LIST, requestParam)
                                .then(function (d) {
                                    vm.pcaDialog.items = d.items;
                                });
                        } else if (type == 'city') {
                            var requestParam = {
                                provinceCode: vm.pcaDialog.values[0]
                            };
                            httpRequest.getReq(GET_CITY_LIST_PROVINCE, requestParam)
                                .then(function (d) {
                                    vm.pcaDialog.items = d.items;
                                });
                        } else if (type == 'area') {
                            var requestParam = {
                                cityCode: vm.pcaDialog.values[1]
                            };
                            httpRequest.getReq(GET_AREA_LIST_CITY, requestParam)
                                .then(function (d) {
                                    vm.pcaDialog.items = d.items;
                                });
                        } else if (type == 'street') {
                            var requestParam = {
                                areaCode: vm.pcaDialog.values[2]
                            };
                            httpRequest.getReq(GET_STREET_lIST_BY_AREA_CODE, requestParam)
                                .then(function (d) {
                                    if (d && d.items) {
                                        vm.pcaDialog.items = d.items;
                                        for(var i=0;i< d.items.length;i++){
                                            vm.pcaDialog.items[i].streetCode = d.items[i].code;
                                            vm.pcaDialog.items[i].streetName = d.items[i].name;

                                        }

                                    } else {
                                        vm.pcaDialog.items = [{
                                            streetCode: null,
                                            streetName: "全城",
                                            type: "street"
                                        }]
                                    }
                                })
                        }
                    },
                    openDialog: function () {
                        vm.pcaDialog.isVisible = true;
                        vm.pcaDialog.values = [];
                        vm.pcaDialog.valueText = [];
                        vm.pcaDialog.setItems('province');
                    },
                    closeDialog: function () {
                        vm.pcaDialog.isVisible = false;
                    },
                    goBack: function () {
                        var idx = vm.pcaDialog.getIndex();
                        idx--;
                        if (idx < 0) {
                            vm.pcaDialog.closeDialog();
                        } else {
                            vm.pcaDialog.setItems(vm.pcaDialog.keys[idx]);
                        }
                    }
                };

                vm.addressDialog.initAddress();
            }
        };
    }

});
