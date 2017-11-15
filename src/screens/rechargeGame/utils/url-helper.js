/**
 * urlhelper for rechargeGame
 * @create: 2017/05/15
 * @author: dxw
 */

define(['screens/rechargeGame/module'], function (module) {
    'use strict';

    module
        .factory('rechargeGameUrlHelper', function () {
            var devUrl = '',
                productUrl = '/m/s',
                virtualUrl = '/virtual/charge';

            var urlMap = {
                //充值接口
                'queryBannerLoopPics': virtualUrl + '/queryBannerLoopPics.json',       //充值首页轮播图
                'queryVirtualCategories': virtualUrl + '/queryVirtualCategories.json',    //类目
                'queryProdDesc': virtualUrl + '/queryProdDesc.json',          //热门游戏
                'queryProd': virtualUrl + '/queryProd.json',     //游戏列表
                'queryAllProdDesc': virtualUrl + '/queryAllProdDesc.json',       //热门游戏|会员
                'queryProdSku': virtualUrl + '/queryProdSku.json',      //商品sku
                'queryProdTemp': virtualUrl + '/queryProdTemp.json',      //充值账号管理

                //选品
                'queryAllWidgetInfo': virtualUrl + '/queryAllWidgetInfo.json',     //获取选品专区
                'queryWidgetNodeInfo': virtualUrl + '/queryWidgetNodeInfo.json',         //获取专区下节点         widgetId
                'queryWidgetNodeProdInfo': virtualUrl + '/queryWidgetNodeProdInfo.json',        //专区的商品信息(拼音排序)        nodeId,pageNo,PageSize
                'queryWidgetNodeProdDescInfo': virtualUrl + '/queryWidgetNodeProdDescInfo.json',        //专区的商品信息(详情)     nodeId,DataSize

                //搜索结果列表
                'listPagedProductInfoFromSearch': '/w/product/listPagedProductInfoFromSearch.json',

                //下单
                'createOrder': productUrl + '/create_single_order.json'

            };

            return {
                getUrl: function (key) {
                    if (key) {
                        return devUrl + urlMap[key];
                    }
                    return null;
                }
            };
        });

});