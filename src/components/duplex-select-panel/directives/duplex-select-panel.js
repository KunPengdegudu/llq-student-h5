/**
 * duplex select panel component
 * @create 2014/12/27
 * @author zhaxi
 * @example
 * <duplex-select-panel options="{{xx}}" on-trigger="xx" template-url="components/duplex-select-panel/views/xx.html"></duplex-select-panel>
 * @param {Object} options - select options,
 * - {Array}  ItemClassName: [{'name': xx, ...},...] // select options, must have display name
 * - {number} 'initIndex' // active index after initatioin
 * - {number} 'omitLen' // omited length of selectedItem name
 * @param on-trigger -  select operation will trigger connected func
 * @param {String} template-url - template url
 */
define([
  'angular',
  'text!components/duplex-select-panel/views/duplex-select-panel-tpl.html',
  'services/filters/filters'
], function(angular, duplexSelectPanelTpl) {

  'use strict';

  angular
      .module('components.duplexSelectPanel', ['services.filters'])
      .directive('duplexSelectPanel', function() {
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
          controller: DuplexSelectCtrl,
          link: DuplexSelectLink
        };
      })
      .run(['$templateCache', function($templateCache) {
        $templateCache.put('components/duplex-select-panel/views/duplex-select-panel-tpl.html', duplexSelectPanelTpl);
      }]);

  ////////
  DuplexSelectCtrl.$inject = ['$scope', '$filter'];

  function DuplexSelectCtrl($scope, $filter) {
    var vm = $scope;
    vm.selectedIndex = 0;
    vm.filterName = null;
    vm.selectedItem = null;
    vm.optionParams = {};
    vm.optionKeys = [];
    vm.duplexOptionsArray = [];
    vm.$destory = destory;
    vm.setOptions = setOptions;
    vm.leftSelect = leftSelect;
    vm.rightSelect = rightSelect;

    ////////
    /**
     * Destory func triggered by $destory
     */
    function destory() {
      vm.watcher();
    }

    /**
     * Set dropdown options & states when iniating & updating
     */
    function setOptions() {
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
        vm.duplexOptionsArray = vm.optionParams['' + vm.optionKeys[0] + ''];
      }

      if (!angular.isArray(vm.duplexOptionsArray) || 0 >= vm.duplexOptionsArray.length) {
        vm.duplexOptionsArray.length = 0;
        vm.duplexOptionsArray.push('--');
      }

      // selectedIndex check
      if (vm.duplexOptionsArray.length <= vm.selectedIndex) {
        // console.log('duplexSelectPanel initIndex oversize.');
        vm.selectedIndex = 0;
      }
      updateSeletecItem();
    }

    /**
     * Triggered when left button is clicked
     */
    function leftSelect() {
      vm.selectedIndex = (vm.selectedIndex - 1) % vm.duplexOptionsArray.length;
      if (-1 === vm.selectedIndex) {
        vm.selectedIndex = vm.duplexOptionsArray.length - 1;
      }
      updateSeletecItem();
      vm.trigger({'itemClass': vm.optionKeys[0], 'selectedItem': vm.duplexOptionsArray[vm.selectedIndex]});
    }

    /**
     * Triggered when right button is clicked
     */
    function rightSelect() {
      vm.selectedIndex = (vm.selectedIndex + 1) % vm.duplexOptionsArray.length;
      updateSeletecItem();
      // show how to pass params to parentFunc
      // @author zhaxi
      vm.trigger({'itemClass': vm.optionKeys[0], 'selectedItem': vm.duplexOptionsArray[vm.selectedIndex]});

    }

    /**
     * Update panel selected text
     */
    function updateSeletecItem() {
      if (null === vm.filterName) {
        vm.selectedItem = $filter('omitStr')(vm.duplexOptionsArray[vm.selectedIndex].name, vm.omitLen);
      } else {
        vm.selectedItem = $filter('omitStr')($filter(vm.filterName)(vm.duplexOptionsArray[vm.selectedIndex].name), vm.omitLen);
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

  function DuplexSelectLink($scope, $element, $attribute) {
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