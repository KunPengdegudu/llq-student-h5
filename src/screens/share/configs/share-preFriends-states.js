/**
 * Created by fionaqin on 2017/7/6.
 */
define([
    'angular',
    'text!screens/share/views/share-preFriends-tpl.html',

    'ui-router',

    'screens/share/module',
    'screens/share/view-models/share-preFriends-ctrl'

], function (angular,
             SharePreFriendsTpl) {

    'use strict';

    angular
        .module('screens.share.preFriends.states', [
            'ui.router',
            'screens.share'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('share-preFriends', {
                    url: '/share/preFriends',
                    spmb: 'share-preFriends',
                    title: '零零期-我的任务-进行任务',
                    controller: 'SharePreFriendsCtrl',
                    templateUrl: 'screens/share/views/share-preFriends-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/share/views/share-preFriends-tpl.html',SharePreFriendsTpl);
        }]);
});