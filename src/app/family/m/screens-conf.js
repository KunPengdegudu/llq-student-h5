/**
 * pool all lazyload configs in screens together
 * @create 2015/07/17
 * @author panwei.pw
 */
define([
    'app/assembly',
    'screens/enter/loader-conf',
    'screens/seckill/loader-conf',
    'screens/sale/loader-conf',
    'screens/stage/loader-conf',
    'screens/help/loader-conf',
    'screens/profile/loader-conf',
    'screens/product/loader-conf',
    'screens/login/loader-conf',
    'screens/auth/loader-conf',
    'screens/activity/loader-conf',
    'screens/activeCenter/loader-conf',
    'screens/active/loader-conf',
    'screens/shopActivity/loader-conf',
    'screens/shop/loader-conf',
    'screens/blanknote/loader-conf',
    'screens/security/loader-conf',
    'screens/works/loader-conf',
    'screens/free/loader-conf',
    'screens/share/loader-conf',
    'screens/rechargeGame/loader-conf',
    'screens/rechargeMobile/loader-conf',
    'screens/tongtongli/loader-conf',
    'screens/template/loader-conf',
    'screens/newExclusive/loader-conf',
    'screens/mobileTribe/loader-conf',
    'screens/weixin/loader-conf',
    'screens/error/loader-conf',
    'screens/groupBuying/loader-conf'
], function (assembly,
             enterConf,
             seckillConf,
             saleConf,
             stageConf,
             helpConf,
             profileConf,
             productConf,
             loginConf,
             authConf,
             activityConf,
             activeCenterConf,
             activeConf,
             shopActivityConf,
             shopConf,
             blankNoteConf,
             securityConf,
             worksConf,
             freeConf,
             shareConf,
             rechargeGameConf,
             rechargeMobileConf,
             tongtongliConf,
             templateConf,
             newExclusiveConf,
             mobileTribeConf,
             weixinConf,
             errorConf,
             groupBuyingConf) {

    'use strict';

    return assembly.assembleConfs(
        // app title
        '零零期',
        // entry&default url
        '/enter/main',
        // introduction url
        '',
        // newbie key, must change when introduction content changes
        'visited-0001',
        {
            'signIn': [{'entryUrl': '/login'}],
            'noPermission': [{'entryUrl': '/error/nopermission'}],
            'normal': [{
                'entryUrl': '/enter/main',
                'activeReg': '/enter($|/*)',
                // 'iconClass': 'icon-enter',
                'iconClass': 'icon-school-aging',
                'text': '首页'
            }, {
                'entryUrl': '/blanknote/main',
                'activeReg': '/blanknote($|/*)',
                // 'iconClass': 'icon-blanknote',
                'iconClass': 'icon-school-work',
                //'checkLoginStatus': true,
                'text': '信用钱包'
            }, {
                //    'entryUrl': '/seckill/main',
                //    'activeReg': '/seckill($|/*)',
                //    'iconClass': 'icon-seckill',
                //    'text': '秒杀'
                //},{
                'entryUrl': '/stage/category',
                'activeReg': '/stage($|/*)',
                // 'iconClass': 'icon-stage',
                'iconClass': 'icon-school-main',
                'text': '分期购物'
            }, {
                'entryUrl': '/works/find',
                'activeReg': '/works($|/*)',
                // 'iconClass': 'icon-earn',
                'iconClass': 'icon-school-mine',
                'text': '发现'
            }, {
                'entryUrl': '/profile/main',
                'activeReg': '/profile($|/*)',
                // 'iconClass': 'icon-profile',
                'iconClass': 'icon-school-dream',
                'checkLoginStatus': true,
                'text': '我的'
            }]
        },
        // screens config, order matters
        [
            enterConf,
            seckillConf,
            saleConf,
            stageConf,
            helpConf,
            profileConf,
            productConf,
            loginConf,
            authConf,
            activityConf,
            activeCenterConf,
            activeConf,
            shopActivityConf,
            shopConf,
            blankNoteConf,
            securityConf,
            worksConf,
            freeConf,
            shareConf,
            rechargeGameConf,
            rechargeMobileConf,
            tongtongliConf,
            templateConf,
            newExclusiveConf,
            mobileTribeConf,
            weixinConf,
            errorConf,
            groupBuyingConf
        ]
    );

});
