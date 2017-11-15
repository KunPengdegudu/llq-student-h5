/**
 * custom head directive @ui-route version:
 *   1)route style switch;
 *   2)title switch;
 *   3)meta microdata read&write;
 * @create 2015/07/30
 * @author panwei
 */
define([
    'angular',
    'ui-router'
], function (angular) {

    'use strict';

    angular
        .module('components.customHead', ['ui.router', 'ngAnimate'])
        .provider('customHead', customHeadProvider)
        .directive('head', headDirective);

    ////////
    function customHeadProvider() {
        var conf, microData, domainMicroData = {};
        this.configure = function (screensConf) {
            conf = screensConf;
        };
        this.$get = function () {
            return {
                /**
                 * screenConf
                 */
                conf: conf,
                /**
                 * set microdata
                 * @summary could only used by customHead
                 * @param {string} [jsonStr] [microdata jsonString]
                 */
                setMicrodata: function (jsonStr, domain) {
                    var md = angular.fromJson(jsonStr);
                    if (domain) {
                        domainMicroData[domain] = md;
                    } else {
                        microData = md;
                    }
                },
                setMicrodataForKey: function (key, value, domain) {
                    if (domain) {
                        if (!domainMicroData[domain]) {
                            domainMicroData[domain] = {};
                        }
                        domainMicroData[domain][key] = value;
                    } else {
                        if (!microData) {
                            microData = {};
                        }
                        microData[key] = value;
                    }
                },
                /**
                 * get microdata
                 * @param  {string} [key] [microdata key]
                 * @return {object} [microdata key-value]
                 */
                getMicrodata: function (key, domain) {
                    var md;
                    if (domain) {
                        md = domainMicroData[domain];
                    } else {
                        md = microData;
                    }

                    if (undefined === md || null === md) {
                        return null;
                    }
                    if (null === key) {
                        return md;
                    } else if (angular.isString(key)) {
                        return md['' + key + ''];
                    } else {
                        // console.log('getMicrodata[key] has not a valid param');
                    }
                }
            };
        };
    }

    headDirective.$inject = [
        '$rootScope',
        '$compile',
        'customHead',
        'CONSTANT_STYLE_URL_PREFIX'
    ];

    function headDirective($rootScope, $compile, customHead, CONSTANT_STYLE_URL_PREFIX) {
        return {
            restrict: 'E',
            compile: function compile(tElement, tAttribute) {
                // get microdata in <meta name=microdata> of head
                // @author zhaxi
                customHead.setMicrodata(
                    document.querySelector('meta[name=microdata]').getAttribute('content'));

                return {
                    post: function ($scope, $element) {
                        var html = '<link rel="stylesheet" data-ng-repeat="(routeCtrl, cssUrl) in routeStyles" data-ng-href="{{cssUrl}}" />';
                        $element.append($compile(html)($scope));

                        var vm = $scope;
                        vm.routeStyles = {};
                        vm.screenTitle = customHead.conf.appTitle;

                        /**
                         * When stateChangeStart
                         * 1) switch css styles
                         * 2) switch state title
                         */
                        $rootScope.$on('$stateChangeStart', function (evt,
                                                                      toState,
                                                                      toParams,
                                                                      fromState,
                                                                      fromParams) {
                            // del fromState Style
                            if (fromState && fromState.$$state && fromState.cssUrl) {
                                if (!angular.isArray(fromState.cssUrl)) {
                                    fromState.cssUrl = [fromState.cssUrl];
                                }
                                angular.forEach(fromState.cssUrl, function (sheet) {
                                    delete vm.routeStyles[sheet];
                                });
                            }
                            // add toState Style
                            if (toState && toState.$$state && toState.cssUrl) {
                                if (!angular.isArray(toState.cssUrl)) {
                                    toState.cssUrl = [toState.cssUrl];
                                }
                                angular.forEach(toState.cssUrl, function (sheet) {
                                    vm.routeStyles[sheet] = CONSTANT_STYLE_URL_PREFIX + sheet;
                                });
                            }
                            // title switch
                            if (toState && toState.$$state) {
                                if (toState.title && '' !== toState.title) {
                                    vm.screenTitle = toState.title;
                                } else {
                                    vm.screenTitle = customHead.conf.appTitle;
                                }
                            }

                            // 打点
                            if (navigator.umeng) {
                                if (checkUrl(fromState)) {
                                    navigator.umeng.endLogPageView(fromParams.url);
                                }
                                if (checkUrl(toState)) {
                                    navigator.umeng.beginLogPageView(toState.url);
                                }
                            }

                            function checkUrl(fromParams) {
                                if (fromState && fromParams.url && fromParams.url != "" && fromParams.url != "^") {
                                    return true;
                                }
                                return false;
                            }
                        });
                    }
                };
            }
        };
    }

});
