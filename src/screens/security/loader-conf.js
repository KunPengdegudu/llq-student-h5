/**
 * security screens configs
 * @create 2016/08/01
 * @author dxw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.security.main.states',
            'files': ['screens/security/configs/security-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.security.password.login.states',
            'files': ['screens/security/configs/security-password-login-states']
        }, {
            'reconfig': true,
            'name': 'screens.security.password.pay.states',
            'files': ['screens/security/configs/security-password-pay-states']
        }, {
            'reconfig': true,
            'name': 'screens.security.phone.confirm.states',
            'files': ['screens/security/configs/security-phone-confirm-states']
        }, {
            'reconfig': true,
            'name': 'screens.security.email.confirm.states',
            'files': ['screens/security/configs/security-email-confirm-states']
        }, {
            'reconfig': true,
            'name': 'screens.security.bank.withhold.states',
            'files': ['screens/security/configs/security-bank-withhold-states']
        }, {
            'reconfig': true,
            'name': 'screens.security.add.bank.card.states',
            'files': ['screens/security/configs/security-add-bank-card-states']
        }
        ],
        'futureStatesConf': [{
            'stateName': 'security-main',
            'urlPrefix': '/security/main',
            'type': 'ocLazyLoad',
            'module': 'screens.security.main.states'
        }, {
            'stateName': 'security-password-login',
            'urlPrefix': '/security/main/loginPassword',
            'type': 'ocLazyLoad',
            'module': 'screens.security.password.login.states'
        }, {
            'stateName': 'security-password-pay',
            'urlPrefix': '/security/main/payPassword',
            'type': 'ocLazyLoad',
            'module': 'screens.security.password.pay.states'
        }, {
            'stateName': 'security-phone-confirm',
            'urlPrefix': '/security/main/confirmPhone',
            'type': 'ocLazyLoad',
            'module': 'screens.security.phone.confirm.states'
        }, {
            'stateName': 'security-email-confirm',
            'urlPrefix': '/security/main/confirmEmail',
            'type': 'ocLazyLoad',
            'module': 'screens.security.email.confirm.states'
        },{
            'stateName': 'security-bank-withHold',
            'urlPrefix': '/security/main/bankWithhold',
            'type': 'ocLazyLoad',
            'module': 'screens.security.bank.withhold.states'
        },{
            'stateName': 'security-add-bank-card',
            'urlPrefix': '/security/main/addBankCard',
            'type': 'ocLazyLoad',
            'module': 'screens.security.add.bank.card.states'
        }
        ]
    };

});
