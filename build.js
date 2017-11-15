  if (typeof define !== 'function') {
    // to be able to require file from node
    var define = require('amdefine')(module);
}

define(function () {

    var fileMatch = require('file-match');
    var fse = require('fs-extra');
    var path = require('path');
    var statesJsFilter = fileMatch('**/configs/*-states.js');

    /**
     * 匹配screen下的states配置文件
     * @param filePath 相对根目录的路径
     */
    function matchStatesJs(filePath) {
        return statesJsFilter(filePath);
    }

    /**
     * 扫描scrren config js
     */
    function scanScreenConfigFiles(filePath) {
        var results = [];
        var stats = fse.statSync(filePath);
        if (stats.isFile()) {
            if (statesJsFilter(filePath)) {
                results.push(filePath);
            }
        } else if (stats.isDirectory()) {
            var files = fse.readdirSync(filePath);
            files.forEach(function (subFilePath) {
                var subResult = scanScreenConfigFiles(path.join(filePath, subFilePath));
                results = results.concat(subResult);
            });
        }
        return results;
    }

    /**
     * 获取screens/** /configs/*-states.js的模块ID列表
     */
    function getAllScreenConfigStates() {
        var screenStates = scanScreenConfigFiles('./src/screens').map(function (filePath) {
            return filePath.replace(/^src\//, '').replace(/\.js$/, ''); // 去除src/和.js
        });
        return screenStates;
    }

    function getBuildConf() {
        var buildConf = {
            appDir: './src',
            baseUrl: './',
            dir: 'watch/',
            wrap: true,
            removeCombined: true,
            keepBuildDir: true,   //是否保留打包输出文件夹内容
            fileExclusionRegExp: /(\.scss|README|\.psd)$/,   // 不优化某些文件
            optimize: 'uglify2',
            uglify2: {
                output: {
                    beautify: false
                },
                compress: {
                    sequences: false,
                    global_defs: {
                        DEBUG: false
                    }
                },
                warnings: true,
                mangle: false
            },
            optimizeCss: 'none',
            skipDirOptimize: true,
            generateSourceMaps: false,
            useSourceUrl: false,
            preserveLicenseComments: false,
            inlineText: true,
            mainConfigFile: './src/app-build.config.js',
            path: {
                'requirejs': 'vendors/requirejs/2.1.15/require.min',
                'goldlog': 'vendors/goldlog/0.0.1/goldlog.min'
            },
            modules: [{
                name: 'vendors/angular',
                create: true,
                include: ['angular', 'ui-router', 'ui-router-extras', 'oc-lazyLoad', 'angular-animate', 'angular-touch', 'angular-sanitize', 'angular-loading-overlay'],
                override: {
                    optimize: 'none'
                }
            }, {
                name: 'vendors/util',
                create: true,
                include: ['moment', 'lodash', 'fastclick', 'hammerjs', 'iscroll', 'text']
            }, {
                name: 'vendors/optional',
                create: true,
                include: ['angular-aria'],
                exclude: ['vendors/angular', 'vendors/util', 'hammer']
            }, {
                name: 'vendors/carousel',
                create: true,
                include: ['angular-carousel'],
                exclude: ['vendors/angular']
            }, {
                name: 'libs/qrcode',
                create: true,
                include: ['qrcode']
            }, {
                name: 'libs/jsencrypt',
                create: true,
                include: ['jsencrypt']
            }, {
                name: 'libs/jq',
                create: true,
                include: ['jq', 'hammer']
            }, {
                name: 'libs/chart',
                create: true,
                include: ['chart'],
                exclude: []
            }, {
                name: 'app.config',
                include: ['storex',
                    // components
                    'components/ngtoast/directives/ngtoast',
                    'components/custom-head/directives/custom-head-ui-route',
                    'components/custom-body/directives/custom-body-ui-route',
                    'components/dialog/directives/dialog',
                    'components/spinning-wheel/directives/spinning-wheel',
                    'components/dropdown/directives/dropdown',
                    'components/ng-iscroll/directives/ng-iscroll',
                    'components/ng-transclude-replace/directives/ng-transclude-replace',
                    'components/pull-to-refresh/directives/pull-to-refresh',
                    'components/route-tabs/directives/route-tabs',
                    'components/scroll-loader/directives/scroll-loader',
                    // services
                    'services/exception-handler/exception-handler',
                    'services/backdrop/backdrop',
                    'services/cache/cache-proxy',
                    'services/cache/http-cache',
                    'services/cache/setting-cache',
                    'services/filters/filters',
                    'services/network/http-interceptor',
                    'services/network/http-request',
                    'services/route-helper/ui-route-helper',
                    'services/utils/constant'
                ],
                exclude: ['vendors/angular', 'vendors/util', 'vendors/optional', 'libs/chart']
            }]
        };

        var screenExclude = ['vendors/angular', 'vendors/util', 'vendors/optional',
            'app.config', 'libs/chart'];
        // screen 配置
        var screenStates = getAllScreenConfigStates();
        // app配置
        var apps = [
            'app/family/homepage/app',
            'app/family/weixin/app',
            'app/family/m/app',
            'app/family/wxm/app',
            //'app/family/install/app',
            'app/family/error/app'
        ];

        screenStates.forEach(function (item) {
            buildConf.modules.push({
                name: item,
                exclude: screenExclude
            });
        });
        apps.forEach(function (item) {
            buildConf.modules.push({
                name: item,
                exclude: screenExclude
            })
        });

        return buildConf;
    }

    return {
        getConf: getBuildConf
    };

});
