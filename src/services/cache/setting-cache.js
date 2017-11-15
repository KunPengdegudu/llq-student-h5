/**
 * settingCache
 * @create 2015/01/08
 * @author guosheng.zhangs
 */
define(['angular', 'services/cache/cache-proxy'], function(angular) {
  'use strict';
  angular
    .module('services.settingCache', ['services.cacheProxy'])
    .provider('settingCache', function() {

      var keyPrefix = 'setting_';

      /**
       * 生成存储的key
       * @param keyName 存储项名称
       *
       */
      function generateStorageKey(keyName) {
        return keyPrefix + keyName;
      }

      this.$get = ['cacheProxy', function(cacheProxy) {
        return {
          /**
           * 获取缓存数据
           * @param key {string} 键名
           * @param dtUpdateTime {string} [可选]数据更新时间，如果指定，则检查数据是否有效
           * @return {object} stored data
           */
          get: function(key, dtUpdateTime) {
            return cacheProxy.get(generateStorageKey(key), dtUpdateTime);
          },

          /**
           * 将数据存储在cache中
           * @param key {string}
           * @param data {object} 要存储的数据
           * @param dtUpdateTime {string}: [可选]数据更新时间
           */
          set: function(key, data, dtUpdateTime) {
            cacheProxy.set(generateStorageKey(key), data, {dtUpdateTime: dtUpdateTime});
          }
        };
      }];
    });
});
