/*
 */

define(['angular',
    'jq',
    'text!components/multi-attr-picker/views/multi-attr-picker-tpl.html'
], function (angular, jq, pickerTpl) {

    'use strict';

    angular
        .module('components.multiAttrPicker', [])
        .directive('multiAttrPicker', multiAttrPickerDirective)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/multi-attr-picker/views/multi-attr-picker-tpl.html', pickerTpl);
        }]);

    ///////
    multiAttrPickerDirective.$inject = [
        '$location',
        '$window'
    ];

    function multiAttrPickerDirective($location, $window) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                groups : '=',
                itemSelectFn: '&',
                slotData : '&'
            },
            templateUrl: 'components/multi-attr-picker/views/multi-attr-picker-tpl.html',
            link : function($scope, $element, $attribute) {
                var vm = $scope;

                vm.selectIndex = {};
                vm.lastConfirm = $attribute.lastConfirm == 'true' ? true : false;

                vm.slotData();

                vm.groupLength = vm.groups.length;
                var itemSelectFunc = vm.itemSelectFn();


                vm.select = select;

                function itemIndexNotEmpty(itemIndex){
                    if(!itemIndex){
                        if(itemIndex == 0){
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        return true;
                    }
                }

                function select(){
                    var selectValues = getSelectValue();
                    itemSelectFunc(selectValues, true);
                }

                function onSelectChange(index){
                    var selectCount = 0;
                    for(var i=0; i<vm.groupLength; i++){
                        var group = vm.groups[i];
                        var groupCode = group.code;
                        if(itemIndexNotEmpty(vm.selectIndex[groupCode])){
                            selectCount++;
                        }
                    }
                    var fn;
                    var selectValues = getSelectValue();
                    if(index == vm.groupLength - 1){    //选的是最后一组值
                        itemSelectFunc(selectValues, false);
                    }
                    else{
                        itemSelectFunc(selectValues, true);
                    }

                }

                function getSelectValue(){
                    var selectValues = {};
                    for(var i=0; i<vm.groups.length; i++){
                        var group = vm.groups[i];
                        var groupCode = group.code;
                        var selectItemIndex = vm.selectIndex[groupCode];
                        if(itemIndexNotEmpty(selectItemIndex)){
                            var item = group.items[selectItemIndex];
                            selectValues[groupCode] = item.value;
                        }
                    }
                    return selectValues;
                }


                vm.multiSelectPick = function(groupCode, itemIndex){

                    vm.selectIndex[groupCode] = itemIndex;

                    if(!vm.lastConfirm){
                        onSelectChange(groupCode);
                    }

                };


                vm.isSelect = function(groupCode, itemIndex){
                    if(vm.selectIndex[groupCode] == itemIndex){
                        return true;
                    }
                    return false;
                };


                function init(){
                    //默认选中
                    var unWatch = vm.$watch('groups', refreshDefaultSelect, true);
                    vm.$on('destroy', unWatch);
                }


                function refreshDefaultSelect(){
                    if(vm.lastConfirm){
                        for(var i=0; i<vm.groupLength; i++){
                            var group = vm.groups[i];
                            var groupCode = group.code;
                            var initValue = group.initValue;
                            for(var j=0; j<group.items.length; j++){
                                if(group.items[j].value == initValue){
                                    vm.selectIndex[groupCode] = j;
                                }
                            }
                        }
                    }
                }

                init();


                //vm.multiSelectPick = vm.$eval();

            }
        };
    }

});
