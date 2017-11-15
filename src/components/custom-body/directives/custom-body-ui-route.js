/**
 * custom body directive @ui-route version:
 *   1) A+ spm data collection;
 *   2) cut scenes;
 * @create 2014/01/20
 * @author zhaxi
 */
define([
    'angular',
    'ui-router'
    // 'services/splash/splash'
], function (angular) {

    'use strict';

    angular
        .module('components.customBody', ['ui.router', 'ngAnimate'/*, 'services.splash'*/])
        .directive('body', bodyDirective);

    ////////
    bodyDirective.$inject = ['$rootScope', '$timeout', 'CONSTANT'/*, 'splash'*/];

    function bodyDirective($rootScope, $timeout, constant) {
        return {
            restrict: 'E',
            link: function ($scope, $element, $attribute) {

                //stateChangeStart
                $rootScope.$on('$stateChangeStart', function (evt,
                                                              toState,
                                                              toParams,
                                                              fromState,
                                                              fromParams) {
                    // 切屏的动画（已去掉）
                    //$scope.slideCls = $scope.slideCls || 'slide-left';
                });

                /**
                 * When stateChangeSuccess
                 * 1) send PV request to A+
                 */
                $rootScope.$on('$stateChangeSuccess', function (evt,
                                                                toState,
                                                                toParams,
                                                                fromState,
                                                                fromParams) {
                    var vm = $scope;
                    if (toState && toState.$$state && toState.spmb) {
                        if (angular.isString(toState.spmb)) {
                            vm.spmb = toState.spmb;
                        }
                        else {
                            // console.log('redirect link does not follow spm trace rules.');
                            return;
                        }
                        // goldlog sendPV to dot
                        if (window.goldlog) {
                            var param = [
                                ["appName", constant.AppName],
                                ["dt", constant.DEVICE_TOKEN],
                                ["udi", constant.UNIQUE_DEVICE_ID],
                                //["tt", constant.TONGDUN_TOKEN],//去掉
                                ["c-ver", constant.CurrentVersion],
                                ["a-ver", constant.AppVersion],
                                ["na-ver", constant.NewestAppVersion]
                            ];
                            $timeout(function(){
                                window.goldlog.sendPV(param);
                            });
                        } else {
                            // console.log('goldlog does not exist.');
                        }
                    } else {
                        // console.log('state config error.');
                    }

                });
            }
        };
    }

});
