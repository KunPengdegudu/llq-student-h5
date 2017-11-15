/**
 * sale main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/mobileTribe/module',
    'jq',
    'screens/mobileTribe/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('mobileTribeMainCtrl', mobileTribeMain);

    ////////
    mobileTribeMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        'httpRequest',
        'mobileTribeUrlHelper',
        'CONSTANT_UTILS'
    ];
    function mobileTribeMain($rootScope, $scope, $location, $q, httpRequest, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "手机部落",
                isShow: true
            }, $location);
        }

        vm.gotoDownload = gotoDownload;

        function gotoDownload() {
            httpRequest.getReq(urlHelper.getUrl("addCount"), {
                'type': vm.device_type
            }).then(function (d) {
                if (vm.device_type == 'ios') {
                    utils.gotoBrowser(urlHelper.getUrl("iosDownload"));
                } else {
                    utils.gotoBrowser(urlHelper.getUrl("andriodDownload"));
                }
            });
        }


        function init() {
            vm.device_type = jq.os.ios ? "ios" : jq.os.android ? "android" : "";
        }

        init();
    }

});