/**
 * login login controller
 * @create 2015/07/18
 * @author panwei.pw
 */
define([
    'screens/weixin/module',
    'jq',
    'screens/weixin/utils/url-helper'
], function (module, jq) {

    'use strict';

    module.controller('WeixinTicketCtrl', WeixinTicket);

    ////////
    WeixinTicket.$inject = [
        '$scope',
        '$location',
        '$stateParams',
        'httpRequest',
        'settingCache',
        '$timeout',
        'weixinUrlHelper',
        'CONSTANT',
        'CONSTANT_UTILS',
        'CONSTANT_STYLE_URL_PREFIX'
    ];
    function WeixinTicket($scope, $location, $stateParams, httpRequest, settingCache, $timeout, urlHelper, constant, utils, urlPrefix) {
        var vm = $scope;

        vm.ticketInfo = {
            ticketNo: null,
            registrationNo: null,
            roomNo: null,
            seatNo: null,
            candidatePhoto: null,
            candidateName: null,
            candidateSex: null,
            admissionAddress: null
        };

        function getTicketInfo() {
            var ticketNo = String(parseInt(10000000 * Math.random()));
            var preTicketNo = '';
            for (var i = 0; i < 7 - ticketNo.length; i++) {
                preTicketNo = preTicketNo.concat('0');
            }
            vm.ticketInfo.ticketNo = '2017'.concat(preTicketNo, ticketNo);

            vm.ticketInfo.registrationNo = parseInt(9999999 * Math.random());

            vm.ticketInfo.roomNo = parseInt(999 * Math.random());

            vm.ticketInfo.seatNo = parseInt(30 * Math.random());

        }

        vm.noHeadPhoto = true;

        vm.addressList = ['中国人民大学附属中学', '上海中学', '成都市第七中学', '东北师范大学附属中学', '浙江省杭州第二中学', '西北工业大学附属中学',
            '北京大学附属中学', '兰州炼油化工总厂第一中学', '佛山市南海区石门中学', '珠海市嘉积中学', '琼山中学', '大庆石油中学',
            '佳木斯第一中学', '珠海市第二中学', '南京师范大学附属中学', '南京外国语学校', '南京市金陵中学', '九江市第一中学',
            '临川一中', '东北育才中学', '盘锦市高级中学', '辽河油田第一高级中学', '内蒙古一机集团第一中学', '呼和浩特市第二中学',
            '鄂尔多斯市第一中学', '宁夏银川一中', '宁夏银川一中', '宁夏六盘山高级中学', '西宁二中', '青海湟川中学',
            '青海师范大学附属中学', '西宁市第四中学', '山东市实验中学', '山东省青岛市第二中学', '东营市胜利第一中学', '山西大学附属中学',
            '山西省实验中学', '太原市第五中学', '山西现代双语中学', '西安高新第一中学', '西北工业大学附属中学', '上海中学',
            '华东师范大学第二附属中学', '复旦大学附属中学', '上海市七宝中学', '上海交通大学附属中学', '上海建平中学', '上海外国语大学附属浦东外国语学校',
            '成都市第七中学', '四川省绵阳中学', '成都外国语学校', '成都树德中学', '成都石室中学', '天津市第一中学',
            '天津市南开中学', '天津市耀阳中学', '天津实验中学', '杨村第一中学', '宝坻区第一中学', '拉萨中学',
            '海南华侨中学', '拉萨北京中学', '中国人民大学附属中学', '长沙市长郡中学', '杭州外国语学校', '成都外国语学校',
            '河北衡水中学', '宁夏银川中学', '本溪市高级中学', '浙江省镇海中学', '襄阳市第五中学', '乌鲁木齐市第一中学',
            '日喀则第一高级中学', '日喀则地区上海实验中学', '日喀则第二中学', '西藏林芝地区第一高级中学', '拉萨市第二高级中学', '乌鲁木齐市第一中学',
            '新疆哈密地区第二中学', '新疆兵团农二师华山中学', '乌鲁木齐市第八中学', '新疆实验中学', '乌鲁木齐第七十中学', '石河子第一中学',
            '新疆师范大学附属中学', '云南师范大学附属中学', '曲靖第一中学', '昆明市第一中学', '迪拜', '青藏高原',
            '西川盆地', '布达拉宫', '长白山天池', '大兴安岭', '珠穆朗玛', '白宫',
            '黄山', '泰山之巅', '华山', '衡山', '恒山', '地中海',
            '稻城', '西湖', '青海湖', '香格里拉', '武夷山', '敦煌莫高窟',
            '三清山', '雷峰塔', '五指山', '洱海', '东方之珠', '玉龙雪山',
            '泸沽湖', '丽江木府', '北海', '中南海', '长城', '北海道',
            '鼓浪岛', '钓鱼岛', '马桶上', '床上', '家里', '张家界玻璃栈桥',
            '迪斯尼乐园', '可可西里', '神农架', '楠溪江', '紫禁城', '荔波丛林',
            '甘南', 'KTV', '家里蹲', '万达广场', '外婆家', '弄堂里',
            '妈妈肚子里', '向往的世界', '云顶天宫', '月宫', '向往的生活', '欢乐颂22楼',
            '赵医生家', '电影院', '泰国', '男朋友心里', '女朋友心里', '舞台'
        ];

        vm.sexDialog = {
            isVisible: false,
            items: [{
                text: '女'
            }, {
                text: '男'
            }],
            setValue: function (item) {
                vm.ticketInfo.candidateSex = item.text;
                vm.sexDialog.closeDialog();
            },
            checkSelected: function (item) {
                return (vm.ticketInfo.candidateSex == item.text);
            },
            getItemName: function (item) {
                return item.text;
            },
            openDialog: function () {
                vm.sexDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.sexDialog.isVisible = false;
            }
        };

        vm.ticketShowDialog = {
            isVisible: false,
            openDialog: function () {
                vm.ticketShowDialog.isVisible = true;
            }
        };

        vm.getPhotoUploadUrl = getPhotoUploadUrl;
        vm.onPhotoUploadSuccessFn = onPhotoUploadSuccessFn;

        function getPhotoUploadUrl(imgType, photo) {
            return urlPrefix + urlHelper.getUrl('uploadPhoto');
        }

        function onPhotoUploadSuccessFn(response, imgType, photo) {
            vm.noHeadPhoto = false;
            alert(response.data + '===' + response.filepath);

            var paramData = '';
            paramData = decodeURIComponent(response.filepath);
            vm.aHref = paramData;
            var urlIdx = paramData.indexOf('url');
            if (urlIdx >= 0) {
                var photoUrl = paramData.substr(parseInt(urlIdx) + 4);
            } else {
                var photoUrl = paramData;
            }

            getPhotoUrl(photoUrl);
        }

        vm.showPhotoDialog = {
            isVisible: false,
            title: '零零期',
            openDialog: function (id, maskType) {
                vm.showPhotoDialog.maskType = maskType;
                vm.showPhotoDialog.src = decodeURIComponent(vm.ticketInfo.candidatePhoto);
                vm.showPhotoDialog.isVisible = true;
            },
            closeDialog: function () {
                vm.showPhotoDialog.isVisible = false;
            },
            goBack: function () {
                vm.showPhotoDialog.closeDialog();
            }
        };

        function check() {
            if (utils.isEmpty(vm.ticketInfo.candidatePhoto)) {
                utils.alert('照片不能为空');
                return false;
            }
            if (utils.isEmpty(vm.ticketInfo.candidateName)) {
                utils.alert('姓名不能为空');
                return false;
            }
            if (utils.isEmpty(vm.ticketInfo.candidateSex)) {
                utils.alert('性别不能为空');
                return false;
            }
            if (utils.isEmpty(vm.ticketInfo.admissionAddress)) {
                utils.alert('考点不能为空');
                return false;
            }
            return true;
        }

        vm.submit = submit;
        function submit() {
            var myCanvas = document.getElementById("ticket_canvas");
            getTicketInfo();
            if (check()) {
                draw();
                console.log(123);
                vm.ticketShowImg = myCanvas.toDataURL("image/jpg");
                vm.ticketShowDialog.openDialog();
            }
        }

        function getPhotoUrl(candidatePhoto) {
            httpRequest.getReq(urlHelper.getUrl('admissionTicket'), null, {
                type: 'POST',
                data: {
                    candidatePhoto: candidatePhoto
                },
                ignoreLogin: true,
                isForm: true
            }).then(function (d) {
                if (d) {
                    vm.ticketInfo.candidatePhoto = d;
                }
            })
        }

        vm.randomSelect = randomSelect;
        function randomSelect() {
            var randomNo = parseInt(vm.addressList.length * Math.random());
            vm.ticketInfo.admissionAddress = vm.addressList[randomNo];
        }

        function draw() {
            var ticketNo = vm.ticketInfo.ticketNo,
                userName = vm.ticketInfo.candidateName,
                userSex = vm.ticketInfo.candidateSex,
                ticketAddress = vm.ticketInfo.admissionAddress,
                registrationNo = vm.ticketInfo.registrationNo,
                roomNo = vm.ticketInfo.roomNo,
                seatNo = vm.ticketInfo.seatNo;

            var canvas = document.getElementById('ticket_canvas');
            var ticket = canvas.getContext("2d");
            var QRCode = document.getElementById('QR_code');
            var userImg = document.getElementById('userHeadImg');
            //var userImg = new Image();
            //userImg.src = vm.ticketInfo.candidatePhoto;
            ticket.fillStyle = "#b5b5b5";
            ticket.fillRect(0, 0, 640, 884);
            ticket.fillStyle = "#ffffff";
            ticket.fillRect(3, 3, 634, 878);
            ticket.font = '30px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('2017年全国普通高校招生考试', 132, 50);
            ticket.font = '35px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('准考证', 264, 100);
            ticket.drawImage(userImg, 30, 170, 160, 213);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('准考证号:', 230, 210);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText(ticketNo, 350, 210);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('姓名:', 230, 281);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText(userName, 305, 281);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('性别:', 460, 281);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText(userSex, 535, 281);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('考点:', 230, 352);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText(ticketAddress, 305, 352);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('考试语种:', 30, 450);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('英语', 150, 450);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('考试科目:', 30, 521);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('语文 数学 综合 英语 自选模块', 150, 521);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('报名序号:', 30, 592);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText(registrationNo, 150, 592);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('考场:', 30, 663);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText(roomNo, 105, 663);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('座位号:', 30, 734);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText(seatNo, 130, 734);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('身份证号:', 30, 805);
            ticket.font = '25px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('******************', 150, 805);
            ticket.font = '16px 微软雅黑';
            ticket.fillStyle = "#000000";
            ticket.fillText('扫码报名全国高考', 467, 653);
            ticket.drawImage(QRCode, 450, 660, 160, 160);
        }

        function init() {
            randomSelect();

            //var paramData = decodeURIComponent('https://weixin110.qq.com/security/newreadtemplate?t=webpage_intercept/w_more-info&url=http%3A%2F%2Fllq-bucket.oss-cn-hangzhou.aliyuncs.com%2FhQIPw7CBVZA7MCJ16cyX-g7WHA6zkjKLEHaJ56XtpA7XBJV6v-szkw-p63VMTUrD.jpg%3FExpires%3D33053302733%26OSSAccessKeyId%3DgYRSK58XpADQ4DBf%26Signature%3DndLjX%252BnJZnSkj2USsM7kg%252BgpMNI%253D&block_type=26&exportkey=');
            //var paramData = decodeURIComponent('https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?block_type=26&url=http%3A%2F%2Fllq-bucket.oss-cn-hangzhou.aliyuncs.com%2FhQIPw7CBVZA7MCJ16cyX-g7WHA6zkjKLEHaJ56XtpA7XBJV6v-szkw-p63VMTUrD.jpg%3FExpires%3D33053302733%26OSSAccessKeyId%3DgYRSK58XpADQ4DBf%26Signature%3DndLjX%252BnJZnSkj2USsM7kg%252BgpMNI%253D%26block_type%3D26%26exportkey%3D&version=16050820&devicetype=iPhone+OS8.4.1&lang=zh_CN&scene=1');
            //var urlIdx = paramData.indexOf('url');
            //var photoUrl = paramData.substr(parseInt(urlIdx) + 4);
            //console.log(urlIdx);
            //console.log(photoUrl);
            //vm.aHref = photoUrl;
            //getPhotoUrl(photoUrl);
            //vm.noHeadPhoto = false;
        }


        init();


    }

});
