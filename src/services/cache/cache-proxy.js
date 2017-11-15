/**
 * cacheProxy
 * @create 2015/01/08
 * @author guosheng.zhangs
 */
define(['angular', 'storex', 'lodash', 'components/custom-head/directives/custom-head-ui-route'], function(angular, storex, _) {
  'use strict';
  angular
    .module('services.cacheProxy', ['components.customHead'])
    .provider('cacheProxy', function() {

      var keepsAllTimeGlobalKey = ['sycmDisableStore', 'sycm__setting_visited-0001']
        , keepsAllTimeUserKey = ['setting_visited-0001']
        , keyPrefix = 'sycm_'
        , userId
        , disableStore = true === storex.get('sycmDisableStore');

      /**
       * 生成存储的key
       * @param keyName 存储项名称
       */
      function generateStorageKey(keyName) {
        return keyPrefix + (userId ? userId : '') + '_' + keyName;
      }

      /**
       * Get storage value
       * @param key {string} cache item key
       * @param dtUpdateTime {string} [可选]数据更新时间
       * @return {object} stored data
       */
      function getStoredData(key, dtUpdateTime) {
        if (disableStore) {
          return;
        }
        var storeData = storex.get(key);
        if (storeData && dtUpdateTime && dtUpdateTime !== storeData.dtUpdateTime) {
          storex.remove(key);
          return;
        }
        if (storeData) {
          return storeData.data;
        }
        return;
      }

      /**
       * store data
       * @param key {string} cache item key
       * @param data {object/array}
       * @param dtUdateTime {string} 数据更新日期
       * @param dtExpireTime {Date} 指定过期时间，接受Date实例或13位时间戳，不指定过期时间的将永不过期；
       */
      function setStoredData(key, data, dtUpdateTime, dtExpireTime) {
        if (disableStore) {
          return;
        }
        storex.set(key, {data: data, dtUpdateTime: dtUpdateTime}, dtExpireTime);
      }

      /**
       * When Storex is full or Broken
       */
      function onStoreFullOrBroken() {
        var keepObj = {};

        _.forEach(keepsAllTimeGlobalKey, function(name) {
          keepObj[name] = storex.get(name);
        });
        _.forEach(keepsAllTimeUserKey, function(name) {
          var key = generateStorageKey(name);
          keepObj[key] = storex.get(key);
        });

        storex.clear();

        // restore
        for (var prop in keepObj) {
          if (keepObj[prop]) {
            storex.set(prop, keepObj[prop]);
          }
        }
      }

      storex.on('full', onStoreFullOrBroken);
      storex.on('broken', onStoreFullOrBroken);

      this.$get = ['customHead', function(customHead) {

        return {
          /**
           * 获取缓存数据
           * @param key {string} 键名
           * @param dtUpdateTime {string} [可选]数据更新时间，如果指定，则检查数据是否有效
           * @return {object} stored data
           */
          get: function(key, dtUpdateTime) {
            if (!userId) {
              userId = customHead.getMicrodata('userId');
            }

            return getStoredData(generateStorageKey(key), dtUpdateTime);
          },

          /**
           * 将数据存储在cache中
           * @param key 键值
           * @param data 要存储的数据
           * @param opt {object} [可选]存储选项
             {
               dtUpdateTime {string}: 数据更新时间
               dtExpireTime {Date}: 指定过期时间，接受Date实例或13位时间戳，不指定过期时间的将永不过期；
             }
           */
          set: function(key, data, opt) {
            if (!userId) {
              userId = customHead.getMicrodata('userId');
            }
            var dtUpdateTime, dtExpireTime;
            if (opt) {
              dtUpdateTime = opt.dtUpdateTime;
              dtExpireTime = opt.dtExpireTime;
            }

            setStoredData(generateStorageKey(key), data, dtUpdateTime, dtExpireTime);
          }
        };
      }];

    });
});
