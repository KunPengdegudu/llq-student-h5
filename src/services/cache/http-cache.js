/**
 * httpCache
 * @create 2014/12/22
 * @author guosheng.zhangs
 */
define(['angular', 'lodash', 'services/cache/cache-proxy'], function (angular, _) {
  'use strict';
  angular
      .module('services.httpCache', ['services.cacheProxy'])
      .provider('httpCache', function () {

        // the params don't be maked store item name
        var skipStoreItemParams = ['callback', 'sycmToken', 't', '_'];
        var keyPrefix = 'http_';

        /**
         * Breaks a query string down into an array of key/value pairs
         * @param  {string} str query
         * @return {array}  array of arrays (key/value pairs)
         */
        function parseQueryStringToParamArray (str) {
          var i, ps, p, n, k, v;
          var pairs = [];

          if (typeof(str) === 'undefined' || str === null || str === '') {
            return pairs;
          }

          if (str.indexOf('?') === 0) {
            str = str.substring(1);
          }

          ps = str.toString().split(/[&;]/);

          for (i = 0; i < ps.length; i++) {
            p = ps[i];
            n = p.indexOf('=');

            if (n !== 0) {
              k = decodeURIComponent(p.substring(0, n));
              v = decodeURIComponent(p.substring(n + 1));
              pairs.push(n === -1 ? [p, null] : [k, v]);
            }

          }
          return pairs;
        }

        /**
         * parse param obj to query String, and filter some params don't need
         * @param  param {object} param obj
         * @param  arrSkipParams {array} names to skip
         * @return {string} QueryString
         */
        function parseParamObjToQueryString (param, arrSkipParams) {
          var arrKey = _.keys(param).sort()
              , strQuery = '';

          for (var i = 0, skipLen = arrSkipParams.length; i < skipLen; i++) {
            arrKey = _.without(arrKey, arrSkipParams[i]);
          }

          for (var j = 0, keyLen = arrKey.length; j < keyLen; j++) {
            strQuery += arrKey[j] + '=' + param[arrKey[j]] + '&';
          }
          if (keyLen > 0) {
            strQuery = strQuery.trim().substring(0, strQuery.length - 1);
          }

          return strQuery.trim();
        }

        /**
         * generate the key of cache item
         * @param url {string}
         * @param params {object} param object
         *
         */
        function generateStorageKey (url, params) {
          var arr = (url || '').split('?')
              , newUrl = arr[0]
              , pArr = parseQueryStringToParamArray(arr[1])
              , newParams;

          if (pArr.length > 0) {
            newParams = {};
            var i = pArr.length - 1;
            for (; i >= 0; i--) {
              newParams[pArr[i][0]] = pArr[i][1];
            }
            _.assign(newParams, params);
          } else {
            newParams = params;
          }

          var fParams = parseParamObjToQueryString(newParams, skipStoreItemParams);
          var key = keyPrefix + newUrl;

          if (fParams) {
            key += '?' + fParams;
          }

          return key;
        }

        this.$get = ['cacheProxy', function (cacheProxy) {
          return {
            /**
             * 获取存储在cache里面的数据
             * @param url {string}
             * @param params {object}
             * @param dtUpdateTime {string}：[可选]数据更新时间，如果指定，则检查数据是否有效
             * @return {object}
             */
            get: function (url, params, dtUpdateTime) {
              return cacheProxy.get(generateStorageKey(url, params), dtUpdateTime);
            },

            /**
             * 将数据存储在cache中
             * @param url {string}
             * @param params {object}
             * @param data 要存储的数据
             * @param dtUpdateTime {string}: [可选]数据更新时间
             */
            set: function (url, params, data, dtUpdateTime) {
              cacheProxy.set(generateStorageKey(url, params), data, {dtUpdateTime: dtUpdateTime});
            }
          };
        }];
      });
});
