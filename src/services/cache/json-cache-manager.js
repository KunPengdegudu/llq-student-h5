define([
  'angular',
  'services/cache/http-cache',
  'components/custom-head/directives/custom-head-ui-route'
], function (angular) {
  'use strict';
  angular
      .module(
      'services.dataCacheManager',
      [
        'services.httpCache',
        'components.customHead'
      ])
      .service('dataCacheManager', ['httpCache', 'customHead', '$injector', function (httpCache, customHead, $injector) {
        // 过期时间 10分钟
        var EXPIRED_TIME = 600000;
        var _this = this;
        var _reqLocked = false; // 限制更新通信日期的请求数一次只有一个

        /**
         * 因为同一个页面内如果选择不同的日期的维度(day, week, month)，
         * 会有不同的通信日期，为了保证以后的扩展性，所以key需要加一个层次表示请求的维度，
         * 例如日报： report.day  | report.week
         *          flow.day | flow.week | flow.month
         * 以此类推
         *
         * Demo:
         *
         * _this.stateDateList = {
         *   'analysis.entry': null,
         *   'analysis.report.day': null,
         *   'analysis.report.week': null,
         *   'analysis.flow': null,
         *   'analysis.goods': null,
         *   'analysis.trade': null,
         *   'analysis.source': null
         * };
         */
        _this.stateDateList = null;

        /**
         * 把获取到的通信日期的json和时间戳绑定
         */
        _this.bindTimeStamp = function (stateDateList) {
          var timestamp = new Date().getTime();
          var result = {};

          stateDateList.forEach(function (value) {
            result[value.module] = {
              'timeStamp': timestamp,
              'stateDate': value.statDate
            };
          });

          return result;
        };

        /**
         * 获取通信日期对照表
         */
        _this.getStateDateList = function (config) {

          //启动的启动第一次从头中获取通信日期的list
          if (null == _this.stateDateList) {

            var initList = customHead.getMicrodata('dateList');

            //如果为空，直接返回
            if (!initList) {
              return;
            }

            _this.stateDateList = _this.bindTimeStamp(initList);
          } else {

            //如果已经过期了，就重新更新通讯日期
            if (_this.isStateDateExpired(config.screenId)) {
              _this.getStateDate();
            }

          }

          // 无论是否过期先保证能返回缓存下来的数据
          return _this.stateDateList;
        };

        /**
         * 获取对应屏组的通信日期
         */
        _this.getModuleStatDate = function (config) {

          var result = null;

          /**
           * 如果定义了模组，则取对应模组的通信日期
           * 若没有定义通信模组，因为日报通信日期为最迟通信日期，
           * 使用其作为默认值
           */
          if (config.screenId) {
            result = _this.stateDateList[config.screenId].stateDate;
          } else {
            return;
          }

          return result;
        };

        /**
         * 通讯日期是否过期
         * 对于没有缓存的url，也会返回false
         */
        _this.isStateDateExpired = function (screenId) {
          var timeNow = new Date().getTime();

          if (_this.stateDateList.hasOwnProperty(screenId)) {
            var requestScreen = _this.stateDateList[screenId];
            var lastStamp = requestScreen.timeStamp;

            if (timeNow - lastStamp >= EXPIRED_TIME) {
              return true;
            }
          }

          if (!_this.stateDateList.hasOwnProperty(screenId)) {
            return true;
          }

          return false;
        };

        /**
         * 获取cache的JSON数据
         */
        _this.getCachedData = function (config) {

          var stateDateList = _this.getStateDateList(config);
          var cachedJSON = null;

          /**
           *  若为空则返回undefined
           *  或者是一般的非json的缓存，则走一般流程
           */
          if (!stateDateList) {
            return;
          }

          cachedJSON = httpCache.get(config.url, config.params, stateDateList[config.screenId].stateDate);


          return cachedJSON;

        };

        /**
         * 获取通信日期
         * 如果出错，需要把时间回归
         */
        _this.getStateDate = function () {
          if (_reqLocked === true) {
            return;
          }
          _reqLocked = true;
          var dateListJson = 'date/listFrontModuleDates.json';

          // 因为此处有$http的循环依赖问题，改为动态注入httpRequest service
          var httpRequest = $injector.get('httpRequest');
          if (httpRequest) {
            httpRequest.getReq(dateListJson, null, null)
                .then(function (data) {
                  _reqLocked = false;
                  // 给stateDateList 赋值
                  // 同时更新时间戳
                  _this.stateDateList = _this.bindTimeStamp(data);
                }, function (data) {
                  _reqLocked = false;
                });
          } else {
            _reqLocked = false;
            console.log('httpRequest equals empty, can not do httpRequest.');
          }
        };

      }])
});
