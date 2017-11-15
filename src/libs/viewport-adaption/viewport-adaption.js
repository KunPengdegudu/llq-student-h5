/*
 * @author : penglei
 * e-mail : lei.penglei@alibaba-inc.com
 * create date : 2014/11/26
 * decription : setting viewport and targetDpi of the app
 */
var adaptUILayout = (function () {

  var regulateScreen = (function () {
    var cache = {};

    var defSize = {
      width: window.screen.width,
      height: window.screen.height
    };

    var ver = window.navigator.appVersion;

    var _ = null;

    var check = function (key) {
      return key.constructor == String ? ver.indexOf(key) > -1 : ver.test(key);
    };

    var add = function (name, key, size) {
      if (name && key)
        cache[name] = {
          key: key,
          size: size
        };
    };

    var del = function (name) {
      if (cache[name])
        delete cache[name];
    };

    var cal = function () {
      if (_ != null)
        return _;

      for (var name in cache) {
        if (check(cache[name].key)) {
          _ = cache[name].size;
          break;
        }
      }

      if (_ == null)
        _ = defSize;

      return _;
    };

    return {
      add: add,
      del: del,
      cal: cal
    };
  })();

  var adapt = function (uiWidth) {
    var
        deviceWidth,
        devicePixelRatio,
        targetDensitydpi,
        initialContent,
        head,
        viewport,
        ua;

    ua = navigator.userAgent.toLowerCase();
    //whether it is the iPhone or iPad
    isiOS = ua.indexOf('ipad') > -1 || ua.indexOf('iphone') > -1 || ua.indexOf('safari') > -1;

    devicePixelRatio = window.devicePixelRatio;
    deviceWidth = regulateScreen.cal().width;

    //count to get the targetDensitydpi
    targetDensitydpi = uiWidth / deviceWidth * devicePixelRatio * 160;

    initialContent = isiOS
        ? 'width=' + uiWidth + ', user-scalable=no'
        :
    'target-densitydpi=' + targetDensitydpi + ', width=' + uiWidth + ', user-scalable=no';

    //add a new meta node of viewport in head node
    head = document.getElementsByTagName('head');
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = initialContent;
    head.length > 0 && head[head.length - 1].appendChild(viewport);
  };

  return {
    regulateScreen: regulateScreen,
    adapt: adapt
  };
})();

adaptUILayout.regulateScreen.add("小米", "XiaoMi", {width:360, height:window.innerHeight});
adaptUILayout.adapt(320); //set the viewport width to 640px;
