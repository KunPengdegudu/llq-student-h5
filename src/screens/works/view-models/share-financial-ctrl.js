/**
 * Created by fionaqin on 2017/7/3.
 */
define([
    'screens/works/module'
], function (module,$q) {

    'use strict';

    module.controller('ShareFinancialCtrl', ShareFinancial);

    ////////
    ShareFinancial.$inject = [
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
    function ShareFinancial($rootScope, $scope, $location, $interval, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils, urlPrefix) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "资金明细",
                isShow: true
            }, $location);
        }

        // top menu configs
        vm.configs = [{
            text:'全部',
            key:'all',
            isSelected:true
        }, {
            text:'支出',
            key:'out',
            isSelected:false
        }, {
            text:'收入',
            key:'in',
            isSelected:false
        }];

        vm.selected = vm.configs[0];

        vm.canLoad = true;
        vm.isShow = false;
        vm.toAccFundType = '';
        vm.symbol = '';
        vm.withdrawCashStatus = '';
        vm.financialList = [];



        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;

        vm.selectType = function(item){
            for(var i=0;i<vm.configs.length;i++){
                vm.configs[i].isSelected = false;
            }
            item.isSelected = true;

            vm.selected = item;
            reload();
            loadItems();
        };


        /**
         * Screen reload
         */
        function reload() {
            vm.financialList = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        //资金明细分页
        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();
            var params = {
                opType:vm.selected.key,   //all,in,out
                pageNo : pageIndex,
                pageSize : 10
            };
            httpRequest.getReq(urlHelper.getUrl('getFinancialDetail'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

                    if (d && d.items && d.items.length > 0) {
                        vm.financialList = vm.financialList.concat(items);
                    }
                    if (vm.financialList.length === 0) {
                        vm.isShow = true;
                    }

                    console.log(vm.isShow);
                    for (var i = 0; i < vm.financialList.length; i++) {
                        vm.financialRecords = vm.financialList[i].records;
                        for(var j = 0; j< vm.financialRecords.length; j++){
                            if(vm.financialRecords[j].transferOp == 'O'){
                                 if(vm.financialRecords[j].toAccFundType == 'person_alipay'){
                                     vm.toAccFundType = '支付宝';
                                 }else {
                                     vm.toAccFundType = '银行卡';
                                 }
                            }
                        }
                    }

                    if (items && items.length === 0) {
                        vm.canLoad = false;
                    }

                    dtd.resolve();
                }, function () {
                    dtd.reject();
                });
            return dtd.promise;
        }

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (!vm.financialList || vm.financialList.length === 0) {
                return ' ';
            }
        }


        function init(){
            // loadItems();
        }

        init();

    }

});

