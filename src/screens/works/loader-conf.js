/**
 * screens - works
 * @create 2015/12/30
 * @author D.xw
 */
define([], function () {

    'use strict';

    return {
        'lazyloadConf': [{
            'reconfig': true,
            'name': 'screens.works.find.states',
            'files': ['screens/works/configs/works-find-states']
        }, {
            'reconfig': true,
            'name': 'screens.works.main.states',
            'files': ['screens/works/configs/works-main-states']
        }, {
            'reconfig': true,
            'name': 'screens.works.resume.states',
            'files': ['screens/works/configs/works-resume-states']
        }, {
            'reconfig': true,
            'name': 'screens.works.transfer.states',
            'files': ['screens/works/configs/works-transfer-states']
        }, {
            'reconfig': true,
            'name': 'screens.works.bill.states',
            'files': ['screens/works/configs/works-bill-states']
        }, {//兼职实习列表
            'reconfig': true,
            'name': 'screens.works.work.states',
            'files': ['screens/works/configs/works-work-states']
        }, {//我的工作
            'reconfig': true,
            'name': 'screens.works.experience.states',
            'files': ['screens/works/configs/works-experience-states']
        }, {//详情
            'reconfig': true,
            'name': 'screens.works.information.states',
            'files': ['screens/works/configs/works-information-states']
        }, {//搜索
            'reconfig': true,
            'name': 'screens.works.search.states',
            'files': ['screens/works/configs/works-search-states']
        }, {//任务
            'reconfig': true,
            'name': 'screens.works.mytask.states',
            'files': ['screens/works/configs/works-mytask-states']
        }, {//任务详情
            'reconfig': true,
            'name': 'screens.task.information.states',
            'files': ['screens/works/configs/task-information-states']

        }, {//任务记录
            'reconfig': true,
            'name': 'screens.task.experience.states',
            'files': ['screens/works/configs/task-experience-states']
        }, {//执行任务
            'reconfig': true,
            'name': 'screens.task.do.states',
            'files': ['screens/works/configs/task-do-states']

        }, {//推广
            'reconfig': true,
            'name': 'screens.task.spreed.states',
            'files': ['screens/works/configs/task-spreed-states']
        }],

        'futureStatesConf': [{
            'stateName': 'works-find',
            'urlPrefix': '/works/find',
            'type': 'ocLazyLoad',
            'module': 'screens.works.find.states'
        }, {
            'stateName': 'works-topic',
            'urlPrefix': '/works/topic',
            'type': 'ocLazyLoad',
            'module': 'screens.works.find.states'
        }, {
            'stateName': 'works-main',
            'urlPrefix': '/works/main',
            'type': 'ocLazyLoad',
            'module': 'screens.works.main.states'
        }, {
            'stateName': 'works-resume',
            'urlPrefix': '/works/resume',
            'type': 'ocLazyLoad',
            'module': 'screens.works.resume.states'
        }, {
            'stateName': 'works-transfer',
            'urlPrefix': '/works/transfer',
            'type': 'ocLazyLoad',
            'module': 'screens.works.transfer.states'
        }, {
            'stateName': 'works-bill',
            'urlPrefix': '/works/bill',
            'type': 'ocLazyLoad',
            'module': 'screens.works.bill.states'
        }, {//兼职实习列表
            'stateName': 'works-work',
            'urlPrefix': '/works/work',
            'type': 'ocLazyLoad',
            'module': 'screens.works.work.states'
        }, {
            'stateName': 'works-experience',
            'urlPrefix': '/works/experience',
            'type': 'ocLazyLoad',
            'module': 'screens.works.experience.states'
        }, {
            'stateName': 'works-information',
            'urlPrefix': '/works/information',
            'type': 'ocLazyLoad',
            'module': 'screens.works.information.states'
        }, {
            'stateName': 'works-search',
            'urlPrefix': '/works/search',
            'type': 'ocLazyLoad',
            'module': 'screens.works.search.states'
        }, {
            'stateName': 'works-mytask',
            'urlPrefix': '/works/mytask',
            'type': 'ocLazyLoad',
            'module': 'screens.works.mytask.states'
        }, {
            'stateName': 'task-information',
            'urlPrefix': '/works/task/information',
            'type': 'ocLazyLoad',
            'module': 'screens.task.information.states'
        }, {
            'stateName': 'task-experience',
            'urlPrefix': '/works/task/experience',
            'type': 'ocLazyLoad',
            'module': 'screens.task.experience.states'
        }, {
            'stateName': 'task-do',
            'urlPrefix': '/works/task/do',
            'type': 'ocLazyLoad',
            'module': 'screens.task.do.states'
        }, {
            'stateName': 'task-spreed',
            'urlPrefix': '/works/task/spreed',
            'type': 'ocLazyLoad',
            'module': 'screens.task.spreed.states'
        }]
    };

});
