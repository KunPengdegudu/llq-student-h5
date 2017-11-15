/**
 * activity cash controller
 * @create 2015/07/18
 * @author dxw
 */
define([
    'screens/activity/module',
    'jq',
    'qrcode',
    'screens/activity/utils/url-helper'
], function (module, jq, qrcode) {

    'use strict';

    module.controller('ActivityCashCtrl', ActivityCash);

    ////////
    ActivityCash.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$interval',
        '$window',
        'settingCache',
        'httpRequest',
        '$location',
        'activityUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    function ActivityCash($rootScope, $scope, $stateParams, $state, $timeout, $interval, $window, settingCache, httpRequest, $location, urlHelper, constant, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "韩蜜美妆校园大使",
                isShow: true,
                isShowLeftBtn: true,
                leftBtnType: "back"
            }, $location);
        }

        vm.doSubmit = doSubmit;

        vm.userSource = 'activity';
        vm.GtStatus = null;

        vm.userGraduateStatue = false;
        function checkUserGraduateApply() {
            httpRequest.getReq(urlHelper.getUrl('checkUserGraduate'))
                .then(function (d) {
                    vm.userGraduateStatue = d;
                })
        }

        function doSubmit() {
            httpRequest.getReq(urlHelper.getUrl('checkProductCert'), {
                productCode: 'BYJ'
            }).then(function (d) {
                if (d.censorStatus == "passed") {
                    utils.customDialog("温馨提示", "系统监测到您已完成成人贷认证，无需参加韩蜜贷活动，可直接借款", "我知道了,去借款", function (idx) {
                        if (idx == 2) {
                            utils.gotoUrl(utils.getUrlWithParams('/blanknote/product', {
                                name: '成人贷',
                                productType: 'BYJ'
                            }))
                        }
                    });
                } else {
                    submit();
                }
            }, function (err) {

            })
        }

        function submit() {
            httpRequest.getReq(urlHelper.getUrl('checkProductCert'), {
                productCode: 'LHH'
            }).then(function (d) {
                if (d.censorStatus != "passed") {
                    utils.customDialog("亲，您未完成认证", "您的认证在审核中或暂未通过，当前无可用额度哦。请在APP中【我的认证】页查看当前认证状态。", "我知道了,下载App", function (idx) {
                        if (idx == 2) {
                            utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                        }
                    });
                } else {
                    if (!vm.userGraduateStatue) {
                        utils.gotoUrl(utils.getUrlWithParams('/blanknote/product', {
                            name: '零花花',
                            productType: 'LHH'
                        }));
                    } else {
                        utils.customDialog("温馨提示", "系统检测到您已毕业，请在App中进行成人贷相关认证", "我知道了,下载App", function (idx) {
                            if (idx == 2) {
                                utils.gotoUrl('__location://' + constant.APP_DOWNLOAD_URL);
                            }
                        });
                    }
                }
            }, function (err) {

            })
        }

        function gotoUrl() {
            var url = utils.getUrlWithParams('/blanknote/product', {
                userSource: vm.userSource,
                name: '零花花',
                productType: 'LHH'
            });
            utils.gotoUrl(url)
        }

        function init() {
        }


        init();


    }

});