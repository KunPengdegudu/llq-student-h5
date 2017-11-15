define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileAllAssessCtrl', ProfileAllAssessCtrl);


    ProfileAllAssessCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$q',
        '$state',
        '$stateParams',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileAllAssessCtrl($rootScope, $scope, $q, $state, $stateParams, $timeout, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        //var order_id = $stateParams.orderId;
        var pageIndex = 1;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                title: "我的评价",
                isShowLeftBtn: true,
                leftBtnType: "back",
                isShow: true
            }, $location);
        }

        vm.statusList = [
            {name: '所有评价', type: 'all'},
            {name: '有图评价', type: 'img'}
        ];

        vm.photoView = {
            power:'modify',
            isVisible: false,
            rightImg:null,
            dialogBeforeHide: function () {
                return true;
            },
            dialogOpen: function (power,img,parentIdx, childIdx) {

                vm.photoView.rightImg=img;
                vm.photoView.power=power;
                vm.pIdx = parentIdx;
                vm.cIdx = childIdx;
                vm.photoView.isVisible = true;
            },
            dialogClose: function () {
                vm.photoView.isVisible = false;
            }
        };
        vm.status = {
            type: 'all',
            clickStatus: function (type) {
                vm.status.type = type;
                vm.flushPage();
            }
        };
        vm.isAbnormal = false;
        vm.items = [];
        vm.canLoad = true;

        vm.reload = reload;
        vm.loadItems = loadItems;
        vm.getMsg = getMsg;
        vm.flushPage = flushPage;
        vm.gotoAddEvaluateDetail = gotoAddEvaluateDetail;

        vm.gotoProduct = function (product) {
            var url = utils.getUrlWithParams("/product/detail", {
                productId: product.productId,
                promotionType: 'aging'
            });
            utils.gotoUrl(url);
        };

        function gotoAddEvaluateDetail(orderId) {
            var url = utils.getUrlWithParams('/profile/orderAssess', {
                orderId: orderId,
                isAdd: true
            });
            utils.gotoUrl(url);
        }

        function flushPage() {
            reload();
            vm.$emit('reload');
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
                pageNo: pageIndex,
                pageSize: 10
            };

            if (vm.status.type == 'img') {
                params.hasImage = true;
            }
            httpRequest.getReq(urlHelper.getUrl('getUserEvaluates'), params)
                .then(function (d) {
                    pageIndex++;
                    var items = d.items;
                    if (items && items.length > 0) {
                        for (var i = 0; i < items.length; i++) {

                            if (utils.isEmpty(items[i].evaluate)) {
                                items[i].evaluate = '没有填写评论！'
                            }
                        }
                    }
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
            if (vm.items.length === 0) {
                return ' ';
            }
        }
    }
})