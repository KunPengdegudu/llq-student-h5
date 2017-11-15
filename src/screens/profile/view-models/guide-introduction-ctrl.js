/*
 * @author : penglei
 * e-mail : lei.penglei@alibaba-inc.com
 * create date : 2014/12/22
 * decription : chart detail
 */
define([
    'screens/profile/module',
    'jq'
], function (module, jq) {

    'use strict';

    module.controller('GuideIntro', GuideIntro);

    GuideIntro.$inject = [
        '$scope',
        '$location',
        '$window',
        'CONSTANT_UTILS'
    ];

    function GuideIntro($scope, $location, $window, utils) {

        $scope.gotoUrl = function () {
            utils.gotoUrl("/enter/main");
        };

        var _this = this;
        $scope.isNeedShow = false;
        $scope.isInit = true;

        _this.initScroller = function () {

            var w = jq($window).width(),
                w2 = w * 2;


            jq("#scroller").css("width", (w*3) + "px");
            jq(".slide").css("width", w + "px");


            $scope.myScrollOptions = {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snapSpeed: 400,
                snap: true,
                click: true,
                probeType: 2,
                indicators: {
                    el: document.getElementById('indicator'),
                    resize: false
                },
                onScrollStart: function () {
                    $scope.isNeedShow = false;

                    if (w2 === Math.abs($scope.myScroll['wrapper'].x)) {
                        $scope.isNeedShow = true;
                    }
                },
                onScroll: function () {
                    if (w < Math.abs($scope.myScroll['wrapper'].x)) {
                        $scope.isNeedShow = true;
                    }

                    if (w2 > Math.abs($scope.myScroll['wrapper'].x)) {
                        $scope.isNeedShow = false;
                    }
                },
                onScrollEnd: function () {
                    if (w < Math.abs($scope.myScroll['wrapper'].x)) {
                        $scope.isNeedShow = true;
                        $scope.isInit = false;
                    }

                    if (w2 > Math.abs($scope.myScroll['wrapper'].x)) {
                        $scope.isNeedShow = false;
                    }
                }
            };

        };

        _this.initScroller();
    }
});