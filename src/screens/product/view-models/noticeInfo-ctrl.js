/**
 * product detail controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/product/module',
    'jq',
    'screens/product/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('ProductNoticeInfoCtrl', ProductNoticeInfo);

    ////////
    ProductNoticeInfo.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$q',
        '$stateParams',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'productUrlHelper',
        'EVENT_ID',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ProductNoticeInfo($scope, $rootScope, $state, $q, $timeout, $stateParams, $window, httpRequest, $location, urlHelper, eventId, constant, utils) {
        var vm = $scope;

        var _positionType = $state.params.positionType;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                isShowRightBtn: false,
                rightBtnType: "icon",
                rightBtnAttrs: {
                    icon: "icon-share"
                },
                title: "零零期公告",
                isShow: true
            }, $location);
        }

        vm.positionType = null;
        if(_positionType){
            vm.positionType = _positionType;
        }

        function initProductNotice() {
            httpRequest.getReq(urlHelper.getUrl('listSysNotices'), {
                'positionType': _positionType
            }, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items && d.items.length > 0) {
                    vm.hasNotice = true;
                    if(d.items[0].content){
                        vm.productNotice =  utils.htmlDecode(d.items[0].content);
                    }
                    if(d.items[0].memo){
                        $rootScope.navConfig.title = d.items[0].memo;
                    }
                }
            })
        }

        function init() {
            initProductNotice();
        }

        init();


    }

});
