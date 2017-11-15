/**
 * dialog: 对话框
 * @create 2014/12/19
 * @author guosheng.zhangs
 * @demo：使用demo见../demo/demo.html
 * directive 参数注释：
 * @param overlay: true - 显示图层蒙版 false - 不显示图层蒙版，默认为true
 * @param is-visible: 外层scope控制着的对话框是否显示的变量
 * @param z-index: 对话框的z-index
 * @param close-by-overlay: true - 点击图层蒙版关闭对话框，否则为false，默认为true
 * @param before-hide: callback - 点击浮层关闭前回掉的函数，如果返回结果为true，则执行关闭，否则，不执行关闭操作
 */
define([
    'angular',
    'jq',
    'services/backdrop/backdrop'
], function (angular, jq) {
    'use strict';

    angular.module('components.dialog', ['services.backdrop'])
        .directive('uiDialog', ['$rootScope', '$window', 'backdrop', function ($rootScope, $window, backdrop) {

            return {
                restrict: 'EA',
                // transclude: true,
                // template: '<div class="ui-dialog-content" data-ng-transclude></div>',
                compile: function compile(tElement, tAttrs) {
                    tElement.addClass('ui-dialog ui-dialog-close');
                    if (tAttrs.zIndex) {    // z-index
                        var zIndex = parseInt(tAttrs.zIndex || '1000');
                        tElement.css('z-index', zIndex);
                    }

                    function Dialog() {
                        this.overlay = tAttrs.overlay !== 'false';                  // 是否显示蒙版
                        this.visible = false;                                       // 对话框是否显示

                    }

                    Dialog.prototype.open = function () {
                        if (this.overlay) {
                            backdrop.showMask();
                        }
                        tElement.removeClass('ui-dialog-close').addClass('ui-dialog-open');
                        this.visible = true;
                    };
                    Dialog.prototype.close = function () {
                        if (this.overlay) {
                            backdrop.hideMask();
                        }
                        tElement.removeClass('ui-dialog-open').addClass('ui-dialog-close');
                        this.visible = false;
                    };
                    Dialog.prototype.isVisible = function () {
                        return this.visible;
                    };

                    var dlg = new Dialog()
                        , closeByOverlay = tAttrs.closeByOverlay !== 'false';   // 点击对话框外部区域是否关闭对话框;

                    return function postLink(scope, element, attrs) {

                        function onClick() {
                            if (dlg.isVisible()) {
                                if (attrs.beforeHide && scope.$eval(attrs.beforeHide) !== true) {
                                    return false;
                                }
                                scope.$apply(function () {
                                    scope.$eval(attrs.isVisible + '=false');
                                });
                            }
                        }

                        function onVisibleChange(isVisible) {
                            var isDlgVisible = dlg.isVisible();
                            if (isVisible && !isDlgVisible) {
                                dlg.open();
                            } else if (!isVisible && isDlgVisible) {
                                dlg.close();
                            }
                        }

                        // watch attrs.isVisible
                        var unWatch = scope.$watch(attrs.isVisible, onVisibleChange);

                        // listen to click event
                        if (closeByOverlay) {
                            $rootScope.$on('backdrop.click', onClick);
                        }

                        var deviceVersion = parseInt(jq.os.version);
                        if (jq.os.ios && deviceVersion < 9) {
                            $rootScope.overflowBugFix = '-webkit-overflow-scrolling:auto';
                        }

                        scope.$on('$destroy', function () {
                            if (dlg.isVisible()) {
                                dlg.close(); // 关闭全局蒙版的显示
                            }
                            unWatch();
                        });

                        // init
                        onVisibleChange(scope.$eval(attrs.isVisible));
                    };
                }
            };
        }]);

});
