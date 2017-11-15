/**
 * Created by fionaqin on 2017/7/3.
 */
define([
    'screens/share/module',
    'jq',
    'qrcode',
    'screens/share/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ShareFriendsListCtrl', ShareFriendsList);

    ////////
    ShareFriendsList.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'settingCache',
        'httpRequest',
        'shareUrlHelper',
        'CONSTANT_UTILS',
        'CONSTANT_STYLE_URL_PREFIX'
    ];
    function ShareFriendsList($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils, urlPrefix) {
        var vm = $scope;


        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                title: "好友列表",
                isShow: true,
                isShowRightBtn: true,
                rightBtnType: "text",
                rightBtnAttrs: {
                    text: '往期好友',
                    fn: function () {
                        utils.gotoUrl('/share/preFriends');
                    }
                }
            }, $location);
        }


        var pageIndex = 1;

        vm.registerNum = 0;
        vm.submitAuthenticationForV2 = 0;
        vm.loanCash = 0;

        vm.items = [];
        vm.canLoad = true;
        vm.isShow = false;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;


        /**
         * Screen reload
         */
        function reload() {
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        //好友列表分页
        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();
            var params = {
                pageNo: pageIndex,
                pageSize: 10
            };
            httpRequest.getReq(urlHelper.getUrl('getFriendsList'), params)
                .then(function (d) {
                    pageIndex++;

                    var items = d ? d.items : [];

                    items.forEach(function (item, idx) {
                        if (item.name) {
                            item.showName = item.name;
                        } else {
                            item.showName = item.phone;
                        }

                        if (item.sex == 0) {
                            item.headSrc = '../../../app/assets/imgs/works-share/icon_head_girl.png';
                        } else {
                            item.headSrc = '../../../app/assets/imgs/works-share/icon_head_boy.png';
                        }
                    })

                    vm.items = vm.items.concat(items);
                    if (vm.items.length === 0) {
                        vm.isShow = true;
                    }

                    if (items && items.length === 0) {
                        vm.canLoad = false;
                    }
                    dtd.resolve();

                }, function () {
                    dtd.reject();
                });
            return dtd.promise;
        }

        /**
         * Get message when load finished
         * @returns {string}
         */
        function getMsg() {
            if (!vm.items || vm.items.length === 0) {
                return ' ';
            }
        }


        function init() {
            httpRequest.getReq(urlHelper.getUrl('getDiffStateFriendsNum'), null, {ignoreLogin: false})
                .then(function (d) {
                    vm.registerNum = d.register;
                    vm.submitAuthenticationForV2 = d.submitAuthenticationForV2;
                    vm.loanCash = d.loanCash;
                }, function () {

                })


        }


        init();
    }

});