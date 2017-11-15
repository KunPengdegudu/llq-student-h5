/**
 * requestService
 * @create 2014/12/14
 * @author guosheng.zhangs
 * @update 2014/12/15
 * @author zhaxi
 */
define([
    'angular',
    'lodash',
    'jq',
    'components/custom-head/directives/custom-head-ui-route'
], function (angular, _, jq) {

    'use strict';

    angular
        .module('services.httpRequest', ['components.customHead'])
        .factory('httpRequest', ['$rootScope', '$http', '$httpParamSerializer', '$q', '$location', '$timeout', 'customHead',
            function ($rootScope, $http, $httpParamSerializer, $q, $location, $timeout, customHead) {

                $rootScope.loginStatus = false;

                var enableRedirect = true;
                var redirectToError = function (redirectUrl) {
                    if (enableRedirect !== true) {
                        return;
                    }
                    if (redirectUrl === undefined || redirectUrl !== getCurrentPageUrl()) {
                        return;
                    }
                    enableRedirect = false;
                    //$location.url('/error/overload?redirect=' + window.encodeURIComponent(redirectUrl));
                    window.location.replace("#/error/overload?redirect=" + window.encodeURIComponent(redirectUrl));
                    $timeout(function () {
                        enableRedirect = true;
                    }, 0); // 防止一个页面同时有多个请求的时候触发多次重定向
                };

                var redirectToLogin = function (redirectUrl) {
                    if (enableRedirect !== true) {
                        return;
                    }
                    enableRedirect = false;
                    if (redirectUrl === undefined) {
                        redirectUrl = getCurrentPageUrl();
                    }
                    //$location.url('/login?to=' + window.encodeURIComponent(redirectUrl));
                    window.location.replace("#/login?to=" + window.encodeURIComponent(redirectUrl));
                    $timeout(function () {
                        enableRedirect = true;
                    }, 0); // 防止一个页面同时有多个请求的时候触发多次重定向
                };

                var getCurrentPageUrl = function () {
                    return $location.url();
                };

                return {
                    /**
                     * 发起一个数据请求
                     * @param url 请求的url
                     * @param params 请求的参数
                     * @param opt 可选项，Object类型，支持的选项列表如下
                     *      type: 'GET'/'POST'/'PUT'/'DELETE'——请求类型，默认为GET
                     *      cache: true/false——是否启用缓存，默认为false
                     *      withToken: true/false ——请求是否带上Token，默认为false（涉及写操作的请求需要带上token）
                     *      handleError: true/false——当请求出现错误时，是否使用默认的处理机制，true - 使用，false - 不使用，默认为false
                     *      withCredentials: true/false ——jsonp跨域请求是设置为true（意见反馈模块）
                     */
                    getReq: function (url, params, opt) {
                        var type, timeout, useCache, withToken, handleError, withCredentials, screenId;

                        opt = jq.extend({
                            isForm: false
                        }, opt);


                        type = (opt.type || '').toUpperCase();
                        timeout = opt.timeout || 8000;
                        useCache = opt.cache;
                        withToken = opt.withToken;
                        handleError = opt.handleError;
                        withCredentials = opt.withCredentials;
                        screenId = opt.screenId;

                        if ('GET' !== type && 'POST' !== type
                            && 'PUT' !== type && 'DELETE' !== type
                            && 'JSONP' !== type) {
                            type = 'GET';
                        }
                        var req = {
                            __mark__: true,   // 拦截http请求的标志
                            timeout: timeout,    // 请求超时时间,8s
                            method: type,
                            url: url,
                            params: _.clone(params),
                            //useCache: false, //关闭缓存
                            useCache: useCache === true,
                            screenId: null,
                            handleError: handleError === true
                        };
                        if (!req.params) {
                            req.params = {};
                        }
                        if (withToken === true) {
                            req.params['_csrf'] = customHead.getMicrodata('_csrf', opt.domain);
                        }
                        if (type === 'POST') {
                            if (opt.isForm) {
                                if (opt && opt.data) {
                                    req.data = $httpParamSerializer(opt.data);
                                }
                                if (!req.headers) {
                                    req.headers = {
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                    }
                                } else {
                                    req.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                                }
                            } else {
                                if (opt && opt.data) {
                                    req.data = opt.data;
                                }
                            }
                        }
                        if (opt.domain || type === 'JSONP') {
                            if (withCredentials === true) {
                                req.withCredentials = true;
                            }
                        }
                        if (type === 'JSONP') {
                            req.params.callback = 'JSON_CALLBACK';

                        }
                        if (req.handleError) {
                            // 当前页面URL˙
                            req.__pageUrl__ = getCurrentPageUrl();
                        }
                        if (!_.isNull(screenId) && !_.isUndefined(screenId)) {
                            req.screenId = screenId;
                        }


                        var dtd = $q.defer();
                        $http(req).success(function (o, status, headers, config) {

                            // save last resp
                            customHead.setMicrodataForKey('_csrf', o['_csrf'], opt.domain);

                            var ignoreLogin = opt && opt.ignoreLogin;

                            if (o && o.login !== undefined) {
                                $rootScope.loginStatus = o.login;
                            }

                            // 非登录页面未登录，login=false，跳转登录页面
                            if (!ignoreLogin && o && (o.code === 401 || !o.login)) {
                                redirectToLogin();
                                dtd.reject(o);
                            } else if (o && o.code === 200) {
                                dtd.resolve(o.data);
                            } else {
                                if (config.handleError) {
                                    redirectToError(config.__pageUrl__);
                                }
                                dtd.reject(o);
                            }
                        }).error(function (o, status, headers, config) {
                            if (100 === status) {
                                dtd.resolve(o);
                            } else {
                                // 服务异常
                                if (status !== 0 && config.handleError) {
                                    redirectToError(config.__pageUrl__);
                                }
                                dtd.reject(o);
                            }
                        });
                        return dtd.promise;
                    }
                };

            }]);
});
