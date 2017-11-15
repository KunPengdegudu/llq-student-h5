/**
 * sale main controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/tongtongli/module',
    'screens/tongtongli/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('TongtongliMainCtrl', TongtongliMain);

    ////////
    TongtongliMain.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$q',
        'httpRequest',
        'tongtongliUrlHelper',
        'CONSTANT_UTILS'
    ];
    function TongtongliMain($rootScope, $scope, $location, $q, httpRequest, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "通通理财",
                isShow: true
            }, $location);
        }

        vm.download = function () {
            utils.gotoBrowser(urlHelper.getUrl("download"));
        };


        function init() {
            utils.checkAndUpdate();
        }

        init();
    }

});