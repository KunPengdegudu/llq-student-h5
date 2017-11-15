/**
 * error page
 * @author panwei.pw
 */
define([
    'app/assembly',
    'screens/error/loader-conf'
], function (assembly, errorConf) {

    'use strict';

    return assembly.assembleConfs(
        // app title
        '零零期',
        // initate screen
        '/error/404',
        // introduction url
        '',
        // newbie key, must change when introduction content changes
        '',
        // nav conf
        {
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': []
        },
        [
            errorConf
        ]
    );

});
