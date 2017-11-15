/**
 * assemble app screens configs
 * @create 2015/07/17
 * @author panwei.pw
 */
define([], function() {

  'use strict';

  return {
    /**
     * assemble screens configs for individule application of app family
     * @param  {String} appTitle         app title
     * @param  {String} entryPoint       homepage screen url
     * @param  {String} introPoint       introduction screen url
     * @param  {String} introKey         introduction screen localstorage key name
     * @param  {Object} nav              nav bar configs
     * @param  {Object} screenStateConfs screens state configs
     * @return {Object}                  assembled configs
     */
    assembleConfs: function(appTitle, entryPoint, introPoint, introKey, nav, screenStateConfs) {
      var navConf = nav;
      var lazyloadConf = [];
      var futureStatesConf = [];

      for (var i = 0; i < screenStateConfs.length; ++i) {
        lazyloadConf     = lazyloadConf.concat(screenStateConfs[i].lazyloadConf);
        futureStatesConf = futureStatesConf.concat(screenStateConfs[i].futureStatesConf);
      }

      return {
        'navConf':          navConf, // nav bar configs
        'appTitle':         appTitle, // app title
        'entryPoint':       entryPoint, // homepage screen url
        'introKey':         introKey, // introduction screen localstorage key name
        'introPoint':       introPoint, // introduction screen url
        'lazyloadConf':     lazyloadConf, // lazyload configs
        'futureStatesConf': futureStatesConf // future states configs
      };
    }
  };

});