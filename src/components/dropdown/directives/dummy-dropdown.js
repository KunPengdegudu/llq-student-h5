/**
 * Wrapped dropdown component for easy to use
 * @create 2015/01/22
 * @author zhaxi
 * @example
 * <dummy-dropdown options={{xx}} on-trigger="xx" overlay="true" template-url="components/dropdown/views/xx-tpl.html" ></dummy-dropdown>
 * @param {Object} options - select options,
 *  - {String} ItemClassName : [{'name': xx, ...},...] // select options, must have display name
 *  - 'initIndex'            : {number} // active index after initatioin
 *  - 'omitLen'              : {number} // omited length of selectedItem name
 * @param on-trigger -  select operation will trigger connected func
 * @param {String} template-url - template url
 */
define([
  'angular',
  'text!components/dropdown/views/line-dummy-dropdown-tpl.html',
  'components/dropdown/directives/dropdown',
  'services/filters/filters'
], function(angular, lineDummyDropdownTpl) {

  'use strict';

  angular
      .module('components.dummyDropdown', ['components.dropdown', 'services.filters'])
      .directive('dummyDropdown', function() {
        return {
          restrict: 'E',
          scope: {
            options: '@',
            trigger: '&onTrigger'
          },
          replace: true,
          templateUrl: function($element, $attribute) {
              return $attribute.templateUrl;
          },
          controller: dummyDropdownCtrl,
          link: dummyDropdownLink
        };
      })
      .run(['$templateCache', function($templateCache) {
        $templateCache.put('components/dropdown/views/line-dummy-dropdown-tpl.html', lineDummyDropdownTpl);
      }]);

  ////////
  dummyDropdownCtrl.$inject = ['$scope', '$filter'];
  function dummyDropdownCtrl($scope, $filter) {
    var vm = $scope;
    vm.omitLen = 0;
    vm.selectedIndex = 0;
    vm.filterName = null;
    vm.selectedItem = null;
    vm.optionParams = {};
    vm.optionKeys = [];
    vm.dropdownOptionsArray = [];
    vm.$destory = destory;
    vm.setOptions = setOptions;
    vm.selectItem = selectItem;
    vm.griddle = griddle;

    ////////
    /**
     * destory func triggered by $destory
     */
    function destory() {
      vm.watcher();
    }

    /**
     * Set dropdown options & states when iniating & updating
     */
    function setOptions() {
      if(!vm.options){
        return;
      }
      vm.optionParams = angular.fromJson(vm.options);
      vm.optionKeys = Object.keys(vm.optionParams);

      if(-1 >= optionsInterprete('initIndex', vm.optionKeys) || !isNumberic(vm.optionParams.initIndex)) {
        vm.selectedIndex = 0;
      } else {
        vm.selectedIndex = vm.optionParams.initIndex;
      }

      if(-1 >= optionsInterprete('omitLen', vm.optionKeys) || !isNumberic(vm.optionParams.omitLen)) {
        vm.omitLen = 0;
      } else {
        vm.omitLen = vm.optionParams.omitLen;
      }

      if(-1 >= optionsInterprete('filter', vm.optionKeys)) {
        vm.filterName = null;
      } else {
        vm.filterName = vm.optionParams.filter;
      }

      if (0 >= vm.optionKeys.length || 1 > vm.optionKeys.length) {
        // console.log('dropdown optionParams format not correct.');
        return;
      } else {
        vm.dropdownOptionsArray = vm.optionParams['' + vm.optionKeys[0] + ''];
      }

      if (!angular.isArray(vm.dropdownOptionsArray) || 0 >= vm.dropdownOptionsArray.length) {
        vm.dropdownOptionsArray.push({'name': '--'});
      }
      // selectedIndex check
      if (vm.dropdownOptionsArray.length <= vm.selectedIndex) {
        // console.log('dropdown initIndex oversize.');
        vm.selectedIndex = 0;
      }
      if (null === vm.filterName) {
        vm.selectedItem = $filter('omitStr')(vm.dropdownOptionsArray[vm.selectedIndex].name, vm.omitLen);
      } else {
        vm.selectedItem = $filter('omitStr')($filter(vm.filterName)(vm.dropdownOptionsArray[vm.selectedIndex].name), vm.omitLen);
      }
    }

    /**
     * Triggered when dropdown item is selected
     */
    function selectItem(index) {
      vm.selectedIndex = index;
      if (null === vm.filterName){
        vm.selectedItem = $filter('omitStr')(vm.dropdownOptionsArray[vm.selectedIndex].name, vm.omitLen);
      } else {

        vm.selectedItem = $filter('omitStr')($filter(vm.filterName)(vm.dropdownOptionsArray[vm.selectedIndex].name), vm.omitLen);
      }
      vm.trigger({'itemClass': vm.optionKeys[0], 'selectedItem': vm.dropdownOptionsArray[vm.selectedIndex]});
    }

    /**
     * griddle option name when filter is applied
     */
    function griddle(name) {
      //console.log(vm.filterName);
      if (null !== vm.filterName) {
        return $filter(vm.filterName)(name);
      } else {
        return name;
      }
    }

    /**
     * Tell whether the key is in keyArray
     * @param  {String} key      [key name need to be verfied]
     * @param  {Array}  keyArray [array of option keys]
     */
    function optionsInterprete(key, keyArray) {
      var keyIndex = keyArray.indexOf(key);
      if (-1 >= keyIndex) {
        return keyIndex;
      } else {
        keyArray.splice(keyIndex, 1);
        return keyIndex;
      }
    }

    /**
     * Tell param is number or not
     * @param  {Number or String}  param [value need to be verified]
     * @return {Boolean}                 [true: number, false: not number]
     */
    function isNumberic(param) {
      if (!isNaN(parseFloat(param) && isFinite(param))) {
        return true;
      } else {
        return false;
      }
    }
  }

  function dummyDropdownLink($scope, $element, $attribute) {
    var vm = $scope;
    vm.setOptions();
    // watch input options changed or not
    vm.watcher = vm.$watchCollection(function() {return vm.options;}, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        vm.setOptions();
      }
    });
  }

});