/**
 * profile my controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/profile/module',
    'screens/profile/utils/url-helper'
], function (module) {

    'use strict';

    module.controller('ProfileFeedbackCtrl', ProfileFeedback);

    ////////
    ProfileFeedback.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$timeout',
        '$window',
        'httpRequest',
        '$location',
        'profileUrlHelper',
        'CONSTANT_UTILS'
    ];
    function ProfileFeedback($rootScope, $scope, $state, $timeout, $window, httpRequest, $location, urlHelper, utils) {
        var vm = $scope;

        if ($rootScope && $rootScope.navConfig) {
            $rootScope.resetNavConfig({
                isShowLeftBtn: true,
                leftBtnType: "back",
                leftBtnAttrs: {
                    url: "/profile/main"
                },
                title: "意见反馈",
                isShow: true
            }, $location);
        }


        vm.feedback = null;
        vm.isEmpty = utils.isEmpty;

        function gotoProfileMain() {
            utils.gotoUrl("/profile/main");
        }

        vm.usualQuestion = function () {
            utils.gotoUrl('/profile/help/question')
        };

        vm.feedback = {
            check: function () {
                if (utils.isEmpty(vm.feedback.content)) {
                    utils.alert("请输入您的反馈内容！");
                    return false;
                }
                return true;
            },
            Submit: function () {
                if (vm.feedback.check()) {
                    var requestParam = {
                        'title': '',
                        'content': vm.feedback.content
                    };
                    httpRequest.getReq(urlHelper.getUrl('doSaveUserSuggestion'), requestParam)
                        .then(function () {
                            utils.alert("提交成功,我们会尽快处理!", gotoProfileMain());
                        }, function () {
                            utils.error("提交失败,请重新输入!");
                        });
                }
            }
        };


    }

});
