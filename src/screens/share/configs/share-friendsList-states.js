/**
 * Created by fionaqin on 2017/7/3.
 */

define([
    'angular',
    'text!screens/share/views/share-friendsList-tpl.html',

    'ui-router',

    'screens/share/module',
    'screens/share/view-models/share-friendsList-ctrl'

], function (angular,
             ShareFriendsListTpl) {

    'use strict';

    angular
        .module('screens.share.friendsList.states', [
            'ui.router',
            'screens.share'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider

                .state('share-friendsList', {
                    url: '/share/friendsList',
                    spmb: 'task-friendsList',
                    title: '零零期-邀请好友-好友列表',
                    controller: 'ShareFriendsListCtrl',
                    templateUrl: 'screens/share/views/share-friendsList-tpl.html'
                });
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('screens/share/views/share-friendsList-tpl.html',ShareFriendsListTpl);
        }]);
});