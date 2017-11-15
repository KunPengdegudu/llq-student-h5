/**
 * Created by llq on 16-3-4.
 */
define(['angular',
    'jq',
    'text!components/picture-show/views/picture-show-tpl.html'
], function (angular, jq, pictureShowTpl) {

    'use strict';

    angular
        .module('components.pictureShow', [])
        .directive('pictureShow', pictureShowProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/picture-show/views/picture-show-tpl.html', pictureShowTpl);
        }]);

    pictureShowProvider.$inject = [
        '$location',
        '$window',
        '$timeout',
        '$interval',
        'httpRequest',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    function pictureShowProvider($location, $window, $timeout, $interval, httpRequest, constant, utils) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: function ($element, $attribute) {
                return $attribute.templateUrl || 'components/picture-show/views/picture-show-tpl.html';
            },
            link: function ($scope, $element, $attribute) {
                var vm = $scope;

                var deleteSuccessFn = vm.$eval($attribute.deleteSuccessFn),
                    getDeleteUrl = vm.$eval($attribute.getDeleteUrl);

                vm.picCarouselIndex=0;
                vm.deleteItem = null;
                vm.deleteUrl = null;
                vm.pictureShow = {
                    item: null,
                    type: 'one',//必填：显示一张图或者一组图‘one’or'list’
                    ifDelete: false,//必填,选择是否显示删除按钮,true显示
                    isVisible: false,
                    closeDialog: function () {
                        vm.pictureShow.isVisible = false;
                    },
                    dialogOpen: function (item) {
                        vm.pictureShow.isVisible = true;
                        vm.pictureShow.type = item.type;
                        vm.pictureShow.ifDelete = item.ifDelete;
                        vm.pictureShow.item = item;
                        if(item.type=='list'){
                            vm.picCarouselIndex=vm.pictureShow.item.carousel
                        }
                        console.log(vm.pictureShow.type)
                    }
                };

                //对应html应填写的内容

                //<picture-show delete-success-fn="deleteSuccessFn" get-delete-url="getDeleteUrl"></picture-show>


                //对应js应该填写的内容

                //type赋值‘one’或者'list’,显示一张图或者一组图
                //ifDelete赋值'true'或者'false',是否显示删除按钮
                // vm.openPhotoDialog = function (type, ifDelete) {//此处传递的参数都赋给了vm.pictureShow,item:{},可以自定义然后从此对象提取
                //   vm.pictureShow.dialogOpen({
                //       type: type,
                //      ifDelete: ifDelete
                //  })
                //};
                //vm.getDeleteUrl = getDeleteUrl;//获取删除图片对应的接口
                //vm.deleteSuccessFn = deleteSuccessFn;//删除成功的函数

                //function getDeleteUrl(item) {//item为已保存的vm.pictureShow.item,此处无需修改
                //    vm.deleteItem = {};//把需要传递的item里面的参数写入该对象
                //    vm.deleteUrl = urlHelper.getUrl('xxx');
                //}
                //
                //function deleteSuccessFn(response, item) {
                //}//删除成功以后执行的函数

                vm.deletePic = deletePic;
                function deletePic() {
                    getDeleteUrl(vm.pictureShow.item);
                    httpRequest.getReq(getDeleteUrl(), vm.deleteItem).then(function (d) {
                            deleteSuccessFn(d, vm.pictureShow.item)
                        },
                        function (d) {
                            utils.error('删除失败：' + d)
                        })

                }
            }
        };
    }

});