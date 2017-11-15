/**
 * pool all lazyload configs in screens together
 * @create 2015/07/17
 * @author panwei.pw
 */
define([
    'app/assembly',
    'screens/weixin/loader-conf',
    'screens/error/loader-conf'
], function (assembly,
             weixinConf,
             errorConf) {

    'use strict';

    return assembly.assembleConfs(
        // app title
        '零零期',
        // entry&default url
        '/weixin/enroll',
        // introduction url
        '',
        // newbie key, must change when introduction content changes
        '',
        {
            'signIn': [],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [{
                'entryUrl': '#/weixin/enroll',
                'activeReg': '/weixin/enroll($|/*)'
            }]
        },
        // screens config, order matters
        [
            weixinConf,
            errorConf
        ]
    );

});
