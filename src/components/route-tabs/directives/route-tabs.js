/**
 * nav directive
 * @create  2014/09/13
 * @author  zhaxi
 * @update  2014/10/29
 * @author  zhaxi
 * @update  2014/12/08
 * @author  zhaxi
 * @update  2015/01/06
 * @author  zhaxi
 * @example
 * <route-tabs configs="xx" template-url="components/route-tabs/views/xx-tpl.html"></route-tabs>
 * @param {Object} configs - route-tabs configs
 * - {Array} 'signIn': [{'entryUrl': 'xx'}]
 * - {Array} 'noPermission': [{'entryUrl': 'xx'}]
 * - {Array} 'normal': [{'entryUrl': 'xx',
 *                       'activeReg': 'xx', // active regex
 *                       'text': 'xx'       // url text
 *                     }]
 * @param {String} template-url - template url
 */
define([
    'angular',
    'text!components/route-tabs/views/nav-tpl.html',
    'text!components/route-tabs/views/top-menu-tpl.html',
    'components/custom-head/directives/custom-head-ui-route'
], function (angular, navTpl, topMenuTpl) {

    'use strict';

    angular
        .module('components.routeTabs', ['components.customHead'])
        .directive('routeTabs', routeTabsDirective)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/route-tabs/views/nav-tpl.html', navTpl);
            $templateCache.put('components/route-tabs/views/top-menu-tpl.html', topMenuTpl);
        }]);

    ////////
    routeTabsDirective.$inject = [
        '$rootScope',
        '$location',
        '$window',
        'customHead'
    ];

    function routeTabsDirective($rootScope, $location, $window, customHead) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: function ($element, $attribute) {
                return $attribute.templateUrl;
            },
            link: function ($scope, $element, $attribute) {
                var vm = $scope;
                vm.isActive = isActive;

                var configs = vm.$eval($attribute.configs);

                vm.gotoUrl = function (url) {
                    //$location.url(url);
                    window.location.replace("#" + url);
                };

                vm.gotoUrlWithCheck = function (url, check) {
                    if (check) {
                        //console.log($rootScope.loginStatus);

                        if ($rootScope.loginStatus === false) {
                            var loginUrl = configs.signIn[0].entryUrl;
                            loginUrl = loginUrl + "?redirect=" + window.encodeURIComponent($location.url());
                            loginUrl = loginUrl + "&to=" + window.encodeURIComponent(url);
                            vm.gotoUrl(loginUrl);
                            return;
                        }
                    }

                    vm.gotoUrl(url);
                };

                // set navs base on microdata
                if (true !== customHead.getMicrodata('signIn')) {
                    vm.navs = [];
                    vm.gotoUrl(configs.signIn[0].entryUrl);
                } else if (true !== customHead.getMicrodata('hasPermission')) {
                    vm.navs = [];
                    vm.gotoUrl(configs.noPermission[0].entryUrl);
                } else {
                    vm.navs = configs.normal || [{'entryUrl': ''}];
                }

                if (configs.rootFlag) {
                    $rootScope[configs.rootFlag] = vm.navs;
                }


                ////////
                /**
                 * Check whether current location is in the screens represented by viewLocation
                 * @param  {String}  viewLocation [view screens reg]
                 * @return {Boolean}              [true  : in the screen represented by viewLocation
                 *                                 false : not in the screen represented by viewLocation]
                 */
                function isActive(viewLocation) {
                    try {
                        return new RegExp(viewLocation).test($location.path());
                    } catch (e) {
                        return false;
                    }
                }
            }
        };
    }

});
