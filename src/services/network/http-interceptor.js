/**
 * httpInterceptor
 * @create 2014/12/21
 * @author guosheng.zhangs
 */
define([
    'angular',
    'services/cache/http-cache',
    'services/cache/json-cache-manager'
], function (angular) {
    'use strict';

    angular
        .module('services.httpInterceptor', ['services.httpCache', 'services.dataCacheManager'])
        .factory('httpInterceptor', ['$q', 'httpCache', 'dataCacheManager', function ($q, httpCache, dataCacheManager) {
            /**
             * 判断是否需要拦截的json或jsonp请求
             * @param config {object}
             * @return {boolean}
             */
            function isJsonRequest(config) {
                return config && config.__mark__ === true;
            }

            return {
                request: function (config) {

                    /**
                     * 必须定义了useCache，同时还要定义screenId才可以使用缓存
                     */
                    if (isJsonRequest(config)
                        && config.useCache
                        && config.screenId) {
                        // get the data from the dataCacheManager,
                        // if this return null, means the cache get is empty
                        // 请求之前给时间做一个标签，给reponse的时候存储更新日期做标签用
                        var storeData = dataCacheManager.getCachedData(config);
                        config._dtUpdateDay_ = dataCacheManager.getModuleStatDate(config);


                        // 如果取到的数据为空，则判断获取数据失败，继续走网络
                        if (storeData) {
                            var res = {
                                status: 100,
                                data: storeData,
                                config: config
                            };
                            return $q.reject(res);
                        }
                    }
                    return config;
                },

                requestError: function (rejection) {
                    return $q.reject(rejection);
                },

                response: function (response) {
                    var config = response.config
                        , data = response.data;

                    if (!isJsonRequest(config)) {
                        return response;
                    }

                    if (config.useCache && config.screenId
                        && data && data.code === 200 && data.data) {

                        httpCache.set(config.url, config.params, data.data, config._dtUpdateDay_);

                    }
                    // not login
                    //else if (data && (data.code === 401 || !data.login)) {
                        //window.location.reload();
                    //}

                    return response;
                },

                responseError: function (rejection) {
                    return $q.reject(rejection);
                }
            };
        }]);
});
