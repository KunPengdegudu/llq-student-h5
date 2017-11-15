/**
 * screens - works
 * @create 2015/12/30
 * @author D.xw
 */
define([
    'screens/works/module',
    'jq',
    'screens/works/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WorksFindCtrl', WorksFind);

    ////////
    WorksFind.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$stateParams',
        '$q',
        '$window',
        'settingCache',
        'httpRequest',
        'worksUrlHelper',
        'CONSTANT_UTILS'
    ];
    function WorksFind($rootScope, $scope, $location, $stateParams, $q, $window, settingCache, httpRequest, urlHelper, utils) {
        var vm = $scope,
            pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "发现",
                isShow: true
            }, $location);
        }

        vm.worksBanner = null;
        vm.topicList = [];
        vm.tempalteType = 'floor_with_banner';

        function queryBanner() {
            httpRequest.getReq(urlHelper.getUrl('queryBannersByExplore'), null, {
                ignoreLogin: true
            }).then(function (d) {
                if (d && d.items.length > 0) {
                    vm.worksBanner = d.items[0];
                }
            })
        }

        function doQueryWidetNodetree() {
            httpRequest.getReq(urlHelper.getUrl('doQueryWidetNodetree'), null, {
                ignoreLogin: true
            }).then(function (d) {
                var topicList = [];
                if (d && d.widgetViewInfo && d.widgetViewInfo.tempalteType) {
                    vm.tempalteType = d.widgetViewInfo.tempalteType;
                }
                if (d && d.orderFactor && d.orderFactor.length > 0) {
                    topicList = d.nodeTree;
                    for (var i = 0; i < topicList.length; i++) {
                        doQueryData(topicList, topicList[i].nodeId, i);
                    }

                }
            })
        }

        function doQueryData(topicList, _nodeId, index) {
            httpRequest.getReq(urlHelper.getUrl('doQueryData'), {
                limit: 3,
                offset: 1,
                widgetCode: 'FX002',
                nodeId: _nodeId
            }, {
                ignoreLogin: true
            }).then(function (d) {
                var nodeList = [];
                if (d && d.items.length > 0) {
                    nodeList = d.items;
                    topicList[index].nodeList = nodeList;
                }
                vm.topicList = topicList;
            })
        }

        vm.gotoTemplate = function (name, nodeId) {

            var templateUrl = '';
            if (vm.tempalteType == 'list_no_banner') {
                templateUrl = utils.getUrlWithParams('/template/commonStyle', {
                    widgetCode: 'FX002',
                    name: name,
                    nodeId: nodeId
                });
            }
            if (vm.tempalteType == 'list_with_banner') {
                templateUrl = utils.getUrlWithParams('/template/main', {
                    widgetCode: 'FX002',
                    name: name,
                    nodeId: nodeId
                });
            }
            if (vm.tempalteType == 'floor_with_banner') {
                templateUrl = utils.getUrlWithParams('/template/floorStyle', {
                    widgetCode: 'FX002',
                    name: name
                });
            }
            utils.gotoUrl(templateUrl);

        };

        vm.gotoWorks = function () {
            utils.gotoUrl('/works/main');
        };

        vm.gotoProduct = function (productId, promotionId, promotionType) {
            var url = utils.getUrlWithParams('/product/detail', {
                productId: productId,
                promotionId: promotionId,
                promotionType: promotionType
            });
            if (productId) {
                utils.gotoUrl(url)
            }
        };

        vm.gotoShare = function () {
            if (utils.checkLogin($rootScope, $location, null)) {
                utils.gotoUrl('/works/task/share');
            }
        }

        function init() {
            queryBanner();
            doQueryWidetNodetree();
        }

        init();
    }

});