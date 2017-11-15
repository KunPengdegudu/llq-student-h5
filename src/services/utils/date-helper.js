/*
 author: penglei;
 create: 15/01/06;
 give the origin date and return the date formated
 */

define([
  'angular',
  'moment'
], function (angular) {
  'use strict';

  angular
      .module('services.dateHelper', [])
      .service('dateHelper', function () {

        // in real situation I got this from the update service;
        var dtUpdateDay = "",
            _this = this;

        //get the nearest Sunday ,count the nature week
        _this.getNatureWeek = function (lastDay) {

          var markerDay = lastDay,
              recentWeekDateRange = '';

          if (_.isNull(markerDay)) {
            markerDay = _this.dtUpdateDay;
          }

          recentWeekDateRange =
              moment(markerDay, 'YYYY-MM-DD').day(-6).format('YYYY.MM.DD') + ' - ' +
              moment(markerDay, 'YYYY-MM-DD').day(0).format('YYYY.MM.DD');

          return recentWeekDateRange;
        };

        //设定公共的日期，全局
        _this.setUpdateDay = function (updateDay) {
          _this.dtUpdateDay = updateDay;
        };

        _this.getUpdateDay = function () {
          return moment(this.dtUpdateTime).format('YYYY-MM-DD');
        };

        _this.getRangeByOption = function (lastday, dateType) {

          var rangeStart = {
            'last7': moment(lastday).add(-6, 'days'),
            'last30': moment(lastday).add(-29, 'days'),
            'recent7': moment(lastday).add(-6, 'days'),
            'recent30': moment(lastday).add(-29, 'days')
          };

          return [rangeStart[dateType].format('YYYY-MM-DD'), moment(lastday).format('YYYY-MM-DD')].join('|');
        };

        //get the day string array for timepicker
        _this.getDayArray = function (num) {

          var result = [],
              lastDay = _this.dtUpdateDay,
              _moment = moment(lastDay, 'YYYY-MM-DD').clone();

          result.push(_moment.format('YYYY.MM.DD'));
          num--;
          while (num--) {
            result.push(_moment.subtract(1, 'day').format('YYYY.MM.DD'));
          }

          return result;
        };

        _this.getDayArrayWithDay = function(lastDay, num) {
          var result = [],
              _moment = moment(lastDay, 'YYYY-MM-DD').clone();

          result.push(_moment.format('MM.DD'));
          num--;
          while (num--) {
            result.push(_moment.subtract(1, 'day').format('MM.DD'));
          }

          return result;
        };

        //get the week string array for timepicker
        _this.getWeekArray = function (num) {

          var result = [],
              lastDay = _this.dtUpdateDay,
              _moment = moment(lastDay, 'YYYY-MM-DD').clone();

          while (num--) {
            result.push(_this.getNatureWeek(_moment.format('YYYY-MM-DD')));
            _moment.subtract(1, 'week');
          }

          return result;
        };

        //init
        _this.setUpdateDay(dtUpdateDay);
      });

});