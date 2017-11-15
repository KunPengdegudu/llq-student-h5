/**
 * profile my team area manager controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'jq',
    'screens/profile/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('QuotaWaitingFetchCtrl', QuotaWaitingFetch);

    ////////
    QuotaWaitingFetch.$inject = [
        '$scope',
        '$rootScope',
        '$location',
        '$loadingOverlay',
        '$q',
        'httpRequest',
        'profileUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function QuotaWaitingFetch($scope, $rootScope, $location, $loadingOverlay, $q, httpRequest, urlHelper, constant, utils) {
        var vm = $scope,
            pageIndex = 1;

        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;
        vm.useCoupon = useCoupon;

        function useCoupon(item) {
            if (item.status != 'waiting_fetch') {
                return false;
            }
            var authPass = false;
            httpRequest.getReq(urlHelper.getUrl('getCertProductList'))
                .then(function (d) {
                    if (d && d.items) {
                        d.items.forEach(function (item, index) {
                            if (item.censorResult.censorStatus == "passed") {
                                authPass = true;
                            }
                        })
                    }

                    var params = {
                        status: 'waiting_fetch',
                        creditFetchStoreId: item.id
                    };

                    if (authPass) {
                        httpRequest.getReq(urlHelper.getUrl('fetchCredit'), params)
                            .then(function (d) {
                                if (d) {
                                    item.status = "fetched";
                                    utils.alert("领取额度成功，您的额度已提升！");
                                }
                            }, function (d) {
                                utils.error("领取额度失败:" + d.msg);
                            });
                    } else {
                        utils.customDialog("亲，您未完成认证", "您的认证在审核中或暂未通过，当前无可用额度哦。请在APP中【我的认证】页查看当前认证状态。", "我知道了,下载App", function (idx) {
                            if (idx == 2) {
                                utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                            }
                        });
                    }

                });
        }

        /**
         * Screen reload
         */
        function reload() {
            vm.isAbnormal = false;
            vm.items = [];
            vm.canLoad = true;
            pageIndex = 1;
        }

        /**
         * Items data request & update
         * @returns {*}
         */
        function loadItems() {
            var dtd = $q.defer();
            var params = {
                offset: pageIndex,
                limit: 10,
                status: 'waiting_fetch'
            };
            httpRequest.getReq(urlHelper.getUrl('getFetchList'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d ? d.items : [];

                    if (items && items.length === 0) {
                        vm.canLoad = false;
                    }
                    vm.items = vm.items.concat(items);
                    if (vm.items.length === 0) {
                        vm.isAbnormal = true;
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


    }


});