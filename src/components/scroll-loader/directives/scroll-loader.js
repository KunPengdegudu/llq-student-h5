/**
 * scrollLoader: 滚动加载
 * @create 2014/12/18
 * @author guosheng.zhangs
 * @demo：使用demo见../demo/demo.html ../demo/demo2.html
 * directive 参数注释：
 * @param scroll-loader="addItems()" [必选]下拉刷新或者滚动到底部时触发指定方法，例如$scope.addItems()
 * @param loader-complete="loaderComplete" [可选]每次加载完成后调用的方法
 * @param can-load="canLoad" [必选]加载时判断组件是否可以继续加载，由外层scope的变量（此处
 *                           为$scope.canLoad）控制，如果值为false，当使用滚屏加载时则显示：亲，没有更多了！
 * @param type="scroll-load" [可选]组件类型：pull-to-refresh/scroll-load/both（下拉刷新/滚屏加载/both），默认为scroll-load
 * @param finish-msg="getMsg()" [可选]获取加载所有内容完成时显示的文案内容，例如$scope.getMsg(),默认显示文案为‘没有更多了...’
 * @param trigger-on-event="eventName" [可选]控制主动触发一次加载行为的事件名称（此处为$scope.$emit('eventName')）
 * @param before-pull-to-refresh="reload()" [可选]下拉刷新加载前回调的函数，如果未提供，则表示不需要下拉刷新功能
 * @param threshold="5" [废弃]滚动到距离底部多少px才触发加载，默认为5px
 */
define(['angular', 'text!components/scroll-loader/views/scroll-loader-tpl.html'], function (angular, scrollLoaderTpl) {
    'use strict';

    angular.module('components.scrollLoader', [])
        .directive('scrollLoader', scrollLoaderDirective)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/scroll-loader/views/scroll-loader-tpl.html', scrollLoaderTpl);
        }]);

    scrollLoaderDirective.$inject = [
        '$rootScope',
        '$timeout'
    ];
    function scrollLoaderDirective($rootScope, $timeout) {
        return {
            restrict: 'A',
            transclude: true,
            templateUrl: 'components/scroll-loader/views/scroll-loader-tpl.html',
            controller: ['$scope', function ($scope) {
                // status: 0 -- init; 1 -- loading; 2 -- requestError; 3 -- no more data
                $scope.scrollLoaderStatus = 0;
                $scope.scrollLoaderRetry = function () {
                    if ($scope.scrollLoaderStatus !== 2) {
                        return;
                    }
                    $scope.$emit('__errorRetry__');
                };
            }],

            compile: function compile(tElement, tAttrs) {
                tElement.addClass('ui-scroll-loader');
                var scrollLoader = tAttrs.scrollLoader
                    , loaderComplete = tAttrs.loaderComplete
                    , type = (tAttrs.type || '').toLowerCase()
                    , canLoad = tAttrs.canLoad
                    , offset = parseInt(tAttrs.threshold) || 5
                    , triggerOnEvent = tAttrs.triggerOnEvent || ''
                    , finishMsg = tAttrs.finishMsg || ''
                    , hideDoneMsg = tAttrs.hideDoneMsg
                    , beforePullToRefreshFn = tAttrs.beforePullToRefresh || '';

                var scrollLoaderCanLoad = true
                    , hasScrollLoad = (type !== 'pull-to-refresh')  //包含滚屏加载功能
                    , hasPullToRefresh = (type === 'pull-to-refresh' || type === 'both'); //包含下拉刷新功能


                return function postLink(scope, element) {
                    var e = element[0]
                        , reloadTimeout = null
                        , triggerEventTimeout = null
                        , headerResetTimeout = null;

                    var headerEl = element.children().eq(0)
                        , headerTipEl = headerEl.children().eq(0)
                        , headerTipIconEl = headerTipEl.children().eq(0)
                        , headerTipTextEl = headerTipEl.children().eq(1)
                        , headerLoadingEl = headerEl.children().eq(1);

                    var footerEl = element.children().eq(2)
                        , footerLoadingEl = footerEl.children().eq(0)
                        , footerLoadError = footerEl.children().eq(1)
                        , footerLoadDone = footerEl.children().eq(2)
                        , footerHeight = 50;  // footer显示的高度

                    /**
                     * 显示footer内容
                     * @param el 显示的元素
                     */
                    function showFooterContent(el) {
                        if (footerEl.hasClass('hide')) {
                            footerEl.removeClass('hide');
                        }
                        if (footerLoadingEl === el) {
                            footerLoadError.addClass('hide');
                            footerLoadDone.addClass('hide');
                            footerLoadingEl.removeClass('hide');
                        } else if (footerLoadError === el) {
                            footerLoadingEl.addClass('hide');
                            footerLoadDone.addClass('hide');
                            footerLoadError.removeClass('hide');
                        } else if (footerLoadDone === el) {
                            footerLoadingEl.addClass('hide');
                            footerLoadError.addClass('hide');
                            footerLoadDone.removeClass('hide');
                        }
                    }

                    /**
                     * 隐藏footer
                     */
                    function hideFooter() {
                        footerEl.addClass('hide');
                    }

                    /**
                     * 隐藏footer内容（占位，用于在滚动加载时，加载提示出来得更顺畅）
                     */
                    function hideFooterContent() {
                        if (footerEl.hasClass('hide')) {
                            footerEl.removeClass('hide');
                        }
                        footerLoadError.addClass('hide');
                        footerLoadDone.addClass('hide');
                        footerLoadingEl.addClass('hide');
                    }

                    /**
                     * 获取canLoad的值
                     */
                    function getCanLoadValue() {
                        return !!(scope.$eval(canLoad));
                        // if (canLoad !== '') {
                        //   return !!(scope.$eval(canLoad));
                        // } else if(hasPullToRefresh && !hasScrollLoad) {
                        //   //仅包含下拉刷新功能且没有设置canLoad时，默认可以加载
                        //   return true;
                        // }
                        // return false;
                    }

                    /**
                     * 滚动监听
                     */
                    function onScroll() {
                        if (scrollLoaderCanLoad &&
                            scope.scrollLoaderStatus !== 1 &&
                            scope.scrollLoaderStatus !== 2 &&
                            (e.scrollTop + e.offsetHeight) >= (e.scrollHeight - footerHeight)) {
                            scope.scrollLoaderStatus = 1;
                            loadData();
                            safeApply();
                        }
                    }

                    /**
                     * 滚屏加载数据
                     */
                    function loadData() {
                        if (scope.scrollLoaderStatus !== 1) {
                            return;
                        }
                        showFooterContent(footerLoadingEl);
                        var dtd = scope.$eval(scrollLoader);
                        if (dtd && typeof dtd.then === 'function') {
                            dtd.then(onHandleSuccess, onHandleError);
                        } else {
                            onHandleSuccess();
                        }
                    }

                    /**
                     * 加载数据成功
                     */
                    function onHandleSuccess(next) {
                        scrollLoaderCanLoad = getCanLoadValue();
                        if (scrollLoaderCanLoad) {
                            scope.scrollLoaderStatus = 0;
                            if (!hasScrollLoad) {
                                // 下拉刷新模式
                                hideFooter();
                            } else {
                                hideFooterContent();
                            }
                        } else {
                            scope.scrollLoaderStatus = 3;
                            if (finishMsg) {
                                var text = scope.$eval(finishMsg) || '亲，没有更多了！';
                                footerLoadDone.text(text);
                            }
                            if (hasScrollLoad) {
                                var h = !!(scope.$eval(hideDoneMsg));

                                if (h) {
                                    hideFooter();
                                } else {
                                    showFooterContent(footerLoadDone);
                                }
                            } else {
                                hideFooter();
                            }
                        }
                        if (reloadTimeout !== null) {
                            $timeout.cancel(reloadTimeout);
                            reloadTimeout = null;
                        }
                        if (hasScrollLoad) {
                            reloadTimeout = $timeout(function () {
                                reloadTimeout = null;
                                // 再次加载，避免内容较少时无Scroll导致无法触发onScroll事件
                                if (scrollLoaderCanLoad &&
                                    scope.scrollLoaderStatus !== 1 &&
                                    scope.scrollLoaderStatus !== 2 &&
                                    e.scrollHeight > 0 &&
                                    e.scrollHeight <= e.offsetHeight + footerHeight || next) {
                                    scope.scrollLoaderStatus = 1;
                                    loadData();
                                } else {
                                    if(loaderComplete) {
                                        scope.$eval(loaderComplete);
                                    }
                                }
                            }, 100);
                        }
                    }

                    /**
                     * 加载数据失败
                     */
                    function onHandleError() {
                        scope.scrollLoaderStatus = 2;
                        scrollLoaderCanLoad = getCanLoadValue();
                        if (hasScrollLoad) {
                            showFooterContent(footerLoadError);
                        }
                    }

                    /*
                     * 外部触发加载事件/失败重新加载
                     */
                    function onTriggerEvent() {
                        if (triggerEventTimeout !== null) {
                            $timeout.cancel(triggerEventTimeout);
                        }
                        if (scope.scrollLoaderStatus === 2) {
                            scope.scrollLoaderStatus = 0;
                        }
                        triggerEventTimeout = $timeout(function () {
                            triggerEventTimeout = null;
                            scrollLoaderCanLoad = getCanLoadValue();
                            onScroll();
                        }, 0, false);
                    }

                    /**
                     * safeApply
                     */
                    function safeApply() {
                        var phase = $rootScope.$$phase;
                        if (phase !== '$apply' && phase !== '$digest') {
                            scope.$digest();
                        }
                    }

                    /**
                     * 初始化下拉刷新功能
                     */
                    function bindPullToRefreshEvent() {
                        var dragMaxDistance = 160    // 下拉的最大距离
                            , triggerDistance = 70   // 触发下拉刷新的距离
                            , halfDragMaxDistance = dragMaxDistance / 2
                            , startY, isDraging;

                        element.bind('touchstart', function (evt) {
                            if (e.scrollTop > 0 || scope.scrollLoaderStatus === 1) {
                                startY = undefined;
                                return;
                            }
                            startY = evt && evt.changedTouches && evt.changedTouches[0] && evt.changedTouches[0].clientY;
                            isDraging = undefined;
                            headerLoadingEl.addClass('hide');
                            headerTipEl.removeClass('hide');
                        });

                        element.bind('touchmove', function (evt) {
                            if (!startY) {
                                return;
                            }
                            var distanceY = evt.changedTouches[0].clientY - startY;
                            if (isDraging === undefined) {
                                if (distanceY < 0) { // 滚动
                                    isDraging = false;
                                } else { // 下拉
                                    isDraging = true;
                                }
                            }
                            if (isDraging) { // disable scrolling
                                evt.preventDefault();
                            } else {
                                return;
                            }
                            if (distanceY > halfDragMaxDistance) {
                                distanceY = distanceY / (distanceY + halfDragMaxDistance) * dragMaxDistance;
                            } else if (distanceY < 0) {
                                distanceY = 0;
                            }
                            if (distanceY >= triggerDistance) {
                                headerTipTextEl.text('释放立即刷新');
                                headerTipIconEl.addClass('rotate');
                            } else {
                                headerTipTextEl.text('下拉刷新');
                                headerTipIconEl.removeClass('rotate');
                            }
                            headerEl.css('height', distanceY + 'px');
                        });

                        element.bind('touchend', function (evt) {
                            if (!startY || isDraging === false) {
                                return;
                            }
                            var distanceY = evt.changedTouches[0].clientY - startY;
                            if (distanceY >= triggerDistance) {
                                headerEl.css('height', '40px');
                                headerTipEl.addClass('hide');
                                headerLoadingEl.removeClass('hide');
                                headerTipTextEl.text('下拉刷新');
                                headerTipIconEl.removeClass('rotate');
                                pullToRefreshReload();
                            } else {
                                resetHeader();
                            }
                        });

                        element.bind('touchcancel', function () {
                            if (!startY) {
                                return;
                            }
                            resetHeader();
                        })
                    }

                    /**
                     * 当下拉刷新加载数据时触发
                     */
                    function pullToRefreshReload() {
                        if (beforePullToRefreshFn !== '') {
                            scope.$eval(beforePullToRefreshFn);
                        }
                        scrollLoaderCanLoad = getCanLoadValue();
                        if (!scrollLoaderCanLoad) {
                            resetHeader();
                            return;
                        }
                        scope.scrollLoaderStatus = 1;
                        hideFooter();
                        var dtd = scope.$eval(scrollLoader);
                        if (dtd && typeof dtd.then === 'function') {
                            dtd.then(onPullToRefreshReloadDone, onPullToRefreshReloadError);
                        } else {
                            onPullToRefreshReloadDone();
                        }
                    }

                    /**
                     * 下拉刷新完成时触发
                     */
                    function onPullToRefreshReloadDone() {
                        if (headerResetTimeout !== null) {
                            $timeout.cancel(headerResetTimeout);
                        }
                        headerResetTimeout = $timeout(function () {
                            headerResetTimeout = null;
                            resetHeader();
                        }, 1000);
                        onHandleSuccess();
                    }

                    /**
                     * 下拉刷新失败时触发
                     */
                    function onPullToRefreshReloadError() {
                        resetHeader();
                        onHandleError();
                    }

                    /**
                     * 重置Header
                     */
                    function resetHeader() {
                        headerLoadingEl.addClass('hide');
                        headerEl.css('height', '0px');
                    }

                    /**
                     * 初始化
                     */
                    function init() {
                        scrollLoaderCanLoad = getCanLoadValue();

                        // watch triggerEvent
                        if (triggerOnEvent !== '') {
                            scope.$on(triggerOnEvent, onTriggerEvent);
                        }
                        scope.$on('__errorRetry__', onTriggerEvent);
                        if (hasScrollLoad) { // 滚屏加载
                            element.bind('scroll', onScroll);
                        }
                        if (hasPullToRefresh) { //下拉刷新
                            bindPullToRefreshEvent();
                        }

                        scope.$on('$destroy', function () {
                            if (hasScrollLoad) {
                                element.unbind('scroll', onScroll);
                            }
                            if (hasPullToRefresh) {
                                element.unbind('touchstart');
                                element.unbind('touchmove');
                                element.unbind('touchend');
                                element.unbind('touchcancel');
                            }
                        });

                        if (scrollLoaderCanLoad) {
                            onScroll(); // 初始化时加载
                        }
                    }

                    init();

                };
            }
        };
    }
});
