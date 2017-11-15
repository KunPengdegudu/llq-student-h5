define([
    'angular',
    'jq',
    'text!components/sys-notice/views/sys-notice-tpl.html'
], function (angular, jq, sysNoticeTpl) {

    'use strict';

    angular
        .module('components.sysNotice', [])
        .directive('sysNotice', sysNoticeProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/sys-notice/views/sys-notice-tpl.html', sysNoticeTpl);
        }]);

    sysNoticeProvider.$inject = [
        'httpRequest',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];

    function sysNoticeProvider(httpRequest, constant, utils) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/sys-notice/views/sys-notice-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope,
                    type = $attribute.type,
                    content = $attribute.content,
                    cls = $attribute.class;

                var target = jq($element[0]);

                if (cls) {
                    target.addClass(cls);
                }

                if (!utils.isEmpty(type)) {
                    httpRequest.getReq(constant.QUERY_SYS_NOTICE_URL, {
                        'positionType': type
                    }, {
                        ignoreLogin: true
                    }).then(function (d) {
                        if (d) {
                            loadType(d);
                        } else {
                            target.css("display", "none");
                        }
                    });
                } else if (!utils.isEmpty(content)) {

                } else {
                    target.css("display", "none");
                }

                if (!utils.isEmpty(content)) {
                    vm.$watch(content, loadContent, true);
                }

                function loadType(dom) {
                    $element[0].innerHTML = utils.htmlDecode(dom, true);
                }

                function loadContent() {
                    var dom = vm.$eval(content);
                    $element[0].innerHTML = utils.htmlDecode(dom, true);
                }

            }
        };
    }

});