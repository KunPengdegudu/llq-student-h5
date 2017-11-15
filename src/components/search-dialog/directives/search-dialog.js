define([
    'angular',
    'jq',
    'text!components/search-dialog/views/search-dialog-tpl.html'
], function (angular, jq, searchDialogTpl) {

    'use strict';

    angular
        .module('components.searchDialog', [])
        .directive('searchDialog', searchDialogProvider)
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/search-dialog/views/search-dialog-tpl.html', searchDialogTpl);
        }]);

    searchDialogProvider.$inject = [
        '$rootScope',
        'httpRequest',
        'settingCache',
        'CONSTANT',
        'CONSTANT_UTILS'
    ];
    var GET_COMPLETION_SUGGEST = '/search/get_completion_suggest.json',
        CLEAR_SEARCH_HEYWORD_HISTORY = '/w/product/clearSearchKeywordHistorys.json',
        LIST_SEARCH_KEYWORD_HISTORYS = '/w/product/listSearchKeywordHistorys.json',
        GET_SEARCH_HEYWORD_RECOMS = '/w/product/getSearchKeywordRecoms.json';

    function searchDialogProvider($rootScope, httpRequest, settingCache, constant, utils) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/search-dialog/views/search-dialog-tpl.html',
            link: function ($scope, $element, $attribute) {
                var vm = $scope;
                vm.search = search;
                vm.searchName = "";
                vm.wordSearch = wordSearch;
                vm.historyItems = null;
                vm.deleteHistory = deleteHistory;
                vm.hotItems = [];

                vm.blurSearch = blurSearch;
                vm.selectKeyword = selectKeyword;
                vm.getCompletionSuggest = getCompletionSuggest;

                function search() {
                    if (vm.searchName) {
                        wordSearch(vm.searchName);
                    } else {
                        wordSearch($rootScope.RECOM_WORD);
                    }
                }

                function wordSearch(word) {
                    var url = '';
                    if (vm.productType == 'game') {
                        url = utils.getUrlWithParams('/recharge/search', {
                            categoryId: vm.categoryId,
                            name: vm.name,
                            productName: word
                        })
                    } else {
                        url = utils.getUrlWithParams("/stage/main", {
                            productName: word
                        });
                    }
                    saveLocalHistoryItem(word);
                    utils.gotoUrl(url);
                    $rootScope.searchDialog.closeDialog();
                }

                function deleteHistory() {
                    utils.customDialog("提示", "是否确认删除历史记录！", "删除,取消", gotoDelete);
                }

                function gotoDelete(btnIdx) {
                    if (btnIdx == 1) {

                        settingCache.set("__SEARCH_ITEMS", undefined);

                        httpRequest.getReq(CLEAR_SEARCH_HEYWORD_HISTORY, null, {
                            ignoreLogin: true
                        }).then(function (d) {
                            vm.historyItems = [];
                        }, function (d) {
                            utils.error('删除失败，请稍后重试')

                        });
                    } else if (btnIdx == 2) {

                    }
                }

                function saveLocalHistoryItem(item) {
                    var items = settingCache.get("__SEARCH_ITEMS") || [];

                    if (item) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].keyword == item) {
                                items.splice(i, 1);
                                break;
                            }
                        }
                        items.splice(0, 0, {
                            keyword: item
                        });

                        if (items.length > 15) {
                            items = items.slice(0, 15);
                        }

                        saveLocalHistory(items);
                    }
                }

                function saveLocalHistory(items) {
                    settingCache.set("__SEARCH_ITEMS", items);
                }

                function loadLocalHistory() {
                    var items = settingCache.get("__SEARCH_ITEMS");
                    vm.historyItems = items || [];
                }


                function getSearchInfo() {
                    var param = (vm.productType == 'game') ? {categoryType: 'virtual_game'} : null;
                    httpRequest.getReq(LIST_SEARCH_KEYWORD_HISTORYS, param, {
                        ignoreLogin: true
                    }).then(function (d) {
                        if (d && d.items && d.items.length > 0) {
                            if (d.items.length > 15) {
                                vm.historyItems = d.items.slice(0, 15);
                            } else {
                                vm.historyItems = d.items;
                            }
                            saveLocalHistory(vm.historyItems);
                        } else {
                            loadLocalHistory();
                        }
                    }, function (d) {
                        loadLocalHistory();
                    });

                    httpRequest.getReq(GET_SEARCH_HEYWORD_RECOMS, param, {
                        ignoreLogin: true
                    }).then(function (d) {
                        $rootScope.RECOM_WORD = d.llq_product_recom;
                        if (d.llq_product_hot) {
                            vm.hotItems = d.llq_product_hot.split(',');
                        }
                    }, function (d) {
                        $rootScope.RECOM_WORD = "iphone";
                    });
                }

                vm.showKeyword = false;
                vm.keywordTop = [];
                function getCompletionSuggest() {
                    httpRequest.getReq(GET_COMPLETION_SUGGEST, {
                        q: vm.searchName
                    }, {
                        ignoreLogin: true
                    }).then(function (d) {
                        if (d && d.items.length > 0) {
                            vm.keywordTop = d.items;
                            vm.showKeyword = true;
                        } else {
                            vm.keywordTop = [];
                            vm.showKeyword = false;
                        }
                    })
                };
                function selectKeyword(item) {
                    vm.searchName = item;
                    search();
                };

                function blurSearch() {
                    vm.showKeyword = false;
                }

                function init() {

                    //弹出搜索页面
                    $rootScope.showSearch = showSearch;
                    function showSearch(productType, categoryId, name) {
                        if (productType == 'game') {
                            vm.productType = productType;
                            vm.categoryId = categoryId;
                            vm.name = name;
                        }
                        getSearchInfo();
                        $rootScope.searchDialog.openDialog();
                    }

                    var unWatch = vm.$watch('searchName', vm.getCompletionSuggest, false);

                    vm.$on('$destroy', function () {
                        unWatch();
                    });
                }

                $rootScope.searchDialog = {
                    isVisible: false,
                    openDialog: function () {
                        $rootScope.searchDialog.isVisible = true;
                    },
                    closeDialog: function () {
                        $rootScope.searchDialog.isVisible = false;
                    }

                };
                init();
            }
        };
    }

});