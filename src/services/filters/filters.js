/**
 * filters
 *
 * @create  2015/10/29
 * @author  panwei
 * @summary currently the name "filters" is too common, when projects scales increase,
 *          common names should be switched to specific names.
 */
define(['angular', 'moment', 'lodash'], function (angular, moment, _) {

    'use strict';

    function htmlEncode(str) {
        var s = "";
        if (str) {
            if (str.length == 0) return "";
            s = str.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/≤/g, "&le;");
            s = s.replace(/≥/g, "&ge;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            s = s.replace(/—/g, "&mdash;");
            s = s.replace(/“/g, "&ldquo;");
            s = s.replace(/”/g, "&rdquo;");
            s = s.replace(/\r\n/g, "&lt;br&gt;");
            s = s.replace(/\n/g, "&lt;br&gt;");
        }
        return s;
    }

    function htmlDecode(str) {
        var s = "";
        if (str) {
            if (str.length == 0) return "";
            s = str.replace(/&amp;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&le;/g, "≤");
            s = s.replace(/&ge;/g, "≥");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, '\"');
            s = s.replace(/&middot;/g, "·");
            s = s.replace(/&mdash;/g, "—");
            s = s.replace(/&ldquo;/g, "“");
            s = s.replace(/&rdquo;/g, "”");
            //s = s.replace(/\r\n/g, "<br>");
            //s = s.replace(/\n/g, "<br>");
        }
        return s;
    }

    angular
        .module('services.filters', [])
        // 过滤器：订单状态
        // @author panwei
        .filter("orderStatus", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'draft')return '新状态';
                    if (d === 'manual_follow')return '新状态';
                    if (d === 'wait_part_pay')return '订金待支付';
                    if (d === 'wait_confirmed')return '等待面签';
                    if (d === 'wait_subscribe')return '等待预约';
                    if (d === 'wait_interview')return '确认预约,等待面签';
                    if (d === 'wait_audit')return '面签完成,等待审核';
                    if (d === 'audit_pass')return '审核通过';
                    if (d === 'audit_no_pass')return '审核不通过';
                    if (d === 'wait_pay')return '等待支付';
                    if (d === 'wait_pay_result')return '等待支付结果';
                    if (d === 'pay_success')return '支付成功';
                    if (d === 'part_pay_success')return '订金支付成功';
                    if (d === 'pay_fail')return '支付失败';
                    if (d === 'part_pay_fail')return '支付失败';
                    if (d === 'wait_delivery')return '等待收货';
                    if (d === 'confirm_delivery')return '确认收货';
                    if (d === 'finished')return '交易成功';
                    if (d === 'closed')return '关闭';
                    if (d === 'aging_ing')return '分期中';
                    if (d === 'waiting_audit') return '等待审核';
                    if (d === 'waiting_pay_to') return '打款中';
                    if (d === 'waiting_charge') return '充值中';
                    if (d === 'charge_fail') return '充值失败';
                    if (d === 'contract_audit_fail') return '确认合同失败';
                    if (d === 'waiting_contract_audit') return '等待确认合同';
                    if (d === 'distribution_completed') return '配货中';
                }
                return d;
            }
        })
        //过滤器：资金明细状态
        .filter("billStatus", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'aging_ing')return '分期中';
                    if (d === 'finished')return '交易完成';
                    if (d === 'wait_confirmed')return '待确认';
                    if (d === 'part_success')return '支付成功(部分)';
                    if (d === 'failed')return '支付失败';
                    if (d === 'un_know')return '未知异常';
                    if (d === 'success')return '支付成功';
                }
                return d;
            }
        })
        //过滤器：Coupon
        .filter('couponType', function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'red_envelope')return '红包';
                    if (d === 'shop_coupon')return '优惠券';
                }
                return d;
            }
        })
        //过滤器：兼职状态
        .filter('workStatus', function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'applying')return '申请中';
                    if (d === 'accept')return '确认中';
                    if (d === 'reject')return '被驳回';
                    if (d === 'signed')return '签订完成';
                    if (d === 'tasking')return '任务中';
                    if (d === 'settled')return '结算完成';
                    if (d === 'finish')return '已完成';
                    if (d === 'finished')return '已完成';
                    if (d === 'markread')return '已查看';
                    if (d === 'expired')return '过期';
                    if (d === 'uncheck')return '未审核';
                    if (d === 'unpass')return '未通过';
                    if (d === 'recruiting')return '招募中';
                    if (d === 'closed')return '已关闭';
                    if (d === 'user_cancel')return '用户取消';
                    if (d === 'waiting_interview')return '待面试';
                    if (d === 'pending')return '待确认';
                    if (d === 'day')return '/天';
                    if (d === 'daily')return '日结';
                    if (d === 'hour')return '/小时';
                    if (d === 'week')return '/周';
                    if (d === 'weekly')return '周结';
                    if (d === 'month')return '/月';
                    if (d === 'monthly')return '月结';
                    if (d === 'year')return '/年';
                    if (d === 'yearly')return '年结';
                    if (d === 'times')return '/次';
                    if (d === 'other')return '';
                    if (d === 'once')return '次';
                    if (d === 'processing')return '处理中';
                    if (d === 'auditing')return '审核中';
                    if (d === 'back')return '被驳回';
                }
                return d;
            }
        })
        //过滤器：银行卡类型
        .filter("cardType", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'person_pingan')return '平安支付';
                    if (d === 'person_yeepay_api')return '易宝支付';
                    if (d === 'person_yxt_api')return '易行通支付';
                }
                return d;
            }
        })
        //过滤器：手机号加密
        .filter("hidePhone", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    d = d.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                }
                return d;
            }
        })
        // 过滤器：还款计划状态
        // @author panwei
        .filter("scheduleStatus", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'wait_pay')return '付款';
                    if (d === 'wait_pay_result')return '等待支付结果';
                    if (d === 'success')return '支付完成';
                    if (d === 'failed')return '付款';
                    if (d === 'overdue')return '逾期付款';
                    if (d === 'refund')return '退款';
                    if (d === 'close')return '关闭';
                    if (d === 'finished')return '完成';
                }
                return d;
            }
        })
        // 过滤器：我的优惠券状态
        // @author panwei
        .filter("couponStatus", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'grant_success')return '已使用';
                    if (d === 'expired')return '已失效';
                    if (d === 'granting')return '使用中';
                }
                return d;
            }
        })
        // 过滤器：自动代扣状态
        // @author panwei
        .filter("autoRepaySignStatus", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'sign_after_aging')return '放款后自动签约';
                    if (d === 'signed')return '签约完成';
                    if (d === 'signing')return '签约审核中';
                    if (d === 'sign_failed')return '签约失败';
                    if (d === 'un_sign')return '未签订';
                }
                return d;
            }
        })
        // 过滤器：高级认证 认证状态
        // @author panwei
        .filter("autoV2SuperStatus", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'wait')return '待审核';
                    if (d === 'failed')return '认证失败';
                    if (d === 'finished')return '认证完成';
                    if (d === 'NULL')return '未完成';
                } else if (!d) {
                    return "未完成";
                }
                return d;
            }
        })

        //认证2.0认证状态过滤器
        .filter("authStatus", function () {
            return function (d) {
                console.log(d);
                if (d !== undefined && d !== null) {
                    if (d === 'not_submit')return '未申请';
                    if (d === 'on_going' || d === 'wait_audit')return '审核中';
                    if (d === 'passed')return '已认证';
                    if (d === 'rejected')return '未通过';
                    if (d === 'supplement')return '为提交材料';
                    if (d === 'reject_resubmit')return '未通过';
                }
                return d;
            }
        })



        // 过滤器：首付款比例
        // @author panwei
        .filter("payRadio", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 0)return '零首付';
                    if (d === 1)return '全额付';
                    return (d * 100) + "%";
                }
                return d;
            }
        })
        // 过滤器：折扣
        // @author panwei
        .filter("discount", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    var dc = parseInt(d) / 10;
                    if (dc >= 10) {
                        return '全价';
                    }
                    return dc.toFixed(1) + '折';
                }
                return d;
            }
        })
        // 过滤器：账户类型
        // @author panwei
        .filter("fundType", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'person_pingan')return '银行卡';
                    if (d === 'person_alipay')return '支付宝';
                }
                return d;
            }
        })
        // 过滤器：html转码
        // @author panwei
        .filter("htmlEncode", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    return htmlEncode(d);
                }
                return d;
            }
        })
        // 过滤器：html解码
        // @author panwei
        .filter("htmlDecode", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    return htmlDecode(d);
                }
                return d;
            }
        })
        // 过滤器：html去除标签
        // @author panwei
        .filter("delTag", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    d = htmlDecode(d);
                    d = d.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
                    d = d.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
                    d = d.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
                    return d;
                }
                return d;
            }
        })
        // 过滤器：百分比
        // @author panwei
        .filter('percentage', function () {
            return function (value, unit) {
                unit = unit || '%';
                var res = value || '';
                if (isNaN(res)) {
                    return '--';
                }
                var calValue = Math.round(res * Math.pow(10, 4)) / Math.pow(10, 2);
                if (1000 < calValue) {
                    calValue = Math.round(calValue);
                }
                if (5000 < calValue) {
                    res = '>' + 5000 + unit;
                } else {
                    res = calValue + unit;
                }
                return res;
            };
        })
        // 过滤器：数字特殊格式化
        // @author panwei
        .filter('formatNum', function () {
            return function (num, type) {
                if (void 0 === num || 0 === num) {
                    return num;
                }
                if ('clickCtr' === type || 'payRate' === type) {
                    num = Math.round(num * Math.pow(10, 4)) / Math.pow(10, 2);
                    return num + '%';
                }
                num = num + '';
                var arr = num.split('.'), reg = /(-?\d+)(\d{3})/;
                while (reg.test(arr[0])) {
                    arr[0] = arr[0].replace(reg, '$1,$2');
                }
                if (1 < arr.length) {
                    arr[1] = Math.round(Number('0.' + arr[1]) * Math.pow(10, 2));
                    num = arr[0] + '.';
                    if (0 < arr[1] && 10 > arr[1]) {
                        num += '0' + arr[1];
                    } else {
                        num += arr[1];
                    }
                    return num;
                }
                return arr[0];
            };
        })
        // 过滤器： 空
        // @author panwei
        .filter('formatEmpty', function () {
            return function (num, emptyStr) {
                if (isNaN(num)) {
                    return num;
                }
                if (0 > num) {
                    return (emptyStr || '-');
                }
                return num;
            };
        })
        // 过滤器：绝对差值
        // @author panwei
        .filter('absDiff', function () {
            return function (input, comparison) {
                if (isNaN(input) || isNaN(comparison)) {
                    return '--';
                }
                return Math.abs(input - comparison);
            };
        })
        // 过滤器：绝对值
        // @author panwei
        .filter('abs', function () {
            return function (input) {
                if (isNaN(input) || (!isFinite(input))) {
                    return '--';
                }
                return Math.abs(input);
            };
        })
        // 对象浅复制,调用:$filter('shallowClone')(targetObj, src1, src2)
        // @author panwei
        .filter('shallowClone', function () {
            return function () {
                var options, name, src, copy
                    , target = arguments[0] || {}
                    , i = 1
                    , length = arguments.length;

                if (typeof target !== 'object' && typeof target !== 'function') {
                    target = {};
                    return target;
                }
                for (; i < length; ++i) {
                    if ((options = arguments[i]) !== null) {
                        for (name in options) {
                            src = target[name];
                            copy = options[name];
                            if (src === copy) {
                                continue;
                            }
                            if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }
                return target;
            };
        })
        // 过滤器：日期
        .filter('dateTitle', function () {
            return function (input) {
                var dName;
                switch (input) {
                    case '7':
                        dName = '最近7天';
                        break;
                    case '30':
                        dName = '最近30天';
                        break;
                    default:
                        dName = '--';
                }
                return dName;
            };
        })
        // 过滤器：转化为趋势
        .filter('translateTrend', function () {
            return function (diff) {
                if (isNaN(diff) || diff === 0) {
                    return 'flat';
                }
                if (0 > diff) {
                    return 'down';
                }
                return 'up';
            };
        })
        .filter('paySuccessStatus', function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'llq_pay_order')return '订单支付';
                    if (d === 'llq_part_pay_order')return '订单部分支付';
                    if (d === 'llq_left_pay_order')return '订单剩余部分支付';
                    if (d === 'llq_repay_order')return '还款支付';
                    if (d === 'llq_part_repay_order')return '订单部分还款支付';
                    if (d === 'llq_all_repay_order')return '全部还款支付';
                    if (d === 'llq_repay_cash')return '零白条还款';
                    if (d === 'llq_merge_pay_order')return '合并支付';
                    if (d === 'repay')return '订单支付';
                    if (d === 'aging')return '还款';
                }
                return d;
            }
        })
        // 过滤器：转化为趋势中文
        .filter('translateTrendCn', function () {
            return function (diff) {
                if (isNaN(diff)) {
                    return '-';
                }
                if (0 > diff) {
                    return '低';
                } else if (0 === diff) {
                    return '相等';
                }
                return '高';
            };
        })
        // 过滤器: 趋势差值
        // @author panwei
        .filter('trendDiff', function () {
            return function (input, compareValue) {
                if (isNaN(input) || isNaN(compareValue)) {
                    return '--';
                }
                return Math.abs(input / compareValue - 1);
            };
        })
        //安全URL
        // @author panwei
        .filter('trustAsResourceUrl', ['$sce', function ($sce) {
            return function (val) {
                return $sce.trustAsResourceUrl(val);
            };
        }])
        // encodeURIComponent
        // @author panwei
        .filter('encodeURIComponent', function () {
            return function (val) {
                return window.encodeURIComponent(val);
            };
        })
        // decodeURIComponent
        // @author panwei
        .filter('decodeURIComponent', function () {
            return function (val) {
                return window.decodeURIComponent(val);
            };
        })
        // 字符串截断
        // @author panwei
        .filter('omitStr', function () {
            return function (str, limitLen) {
                if (!angular.isString(str)) {
                    return '--';
                } else if (0 >= limitLen || str.length <= limitLen) {
                    return str;
                } else {
                    return str.substr(0, limitLen) + '...';
                }
            };
        })
        // jsonObject 2 stringObj and revert
        // @author penglei
        .filter('Json2String', function () {
            return function (jsonObj) {
                return JSON.stringify(jsonObj);
            };
        })
        .filter('String2Json', function () {
            return function (stringObj) {
                return JSON.parse(stringObj);
            };
        })
        .filter('jsonParamEncode', function () {
            return function (jsonObj) {

                if (_.isEmpty(jsonObj)) {
                    return null;
                }

                var stringResult = JSON.stringify(jsonObj);
                return encodeURIComponent(stringResult);
            };
        })
        .filter('jsonParamDecode', function () {
            return function (stringObj) {

                var jsonResult = decodeURIComponent(stringObj);
                return JSON.parse(jsonResult);
            };
        })
        .filter('chartDateRange', function () {
            return function (lastday, dateType) {

                var rangeStart = {
                    'recent7': moment(lastday, 'YYYY-MM-DD').add(-6, 'days'),
                    'recent30': moment(lastday, 'YYYY-MM-DD').add(-29, 'days')
                };

                if (!rangeStart[dateType]) {
                    return '';
                }

                return [rangeStart[dateType].format('MM.DD'), moment(lastday).format('MM.DD')].join('-');
            };
        })
        .filter('unitConversion', function () {
            return function (indexCode) {

                var conversionName = '';

                switch (indexCode) {
                    case 'uv':
                        conversionName = '人';
                        break;
                    case 'payAmt':
                        conversionName = '元';
                        break;
                    case 'payRate':
                        conversionName = '';
                        break;
                    default :
                        break;
                }

                return conversionName;
            };
        })
        // 保留几位小数
        // @author panwei
        .filter('keepFixed', function () {
            return function (target, num) {

                var fixedNum = num;

                if (!target) {
                    return 0;
                }

                if (_.isNull(fixedNum)) {
                    fixedNum = 2;
                }

                return Math.round(target * Math.pow(10, fixedNum)) / Math.pow(10, fixedNum);
            };
        })
        // 保留几位小数
        // @author panwei
        .filter('moneyFixed', function () {
            return function (target, def) {

                var fixedNum = 2;

                if (!target && target !== 0) {
                    if (def != undefined) {
                        return def;
                    }
                    return '0元';
                }

                return (Math.round(target * Math.pow(10, fixedNum)) / Math.pow(10, fixedNum)) + "元";
            };
        })
        .filter('numShortHand', function () {
            return function (targetNum) {
                var num = targetNum;
                var numRange = 0;
                var unit = '';

                if (void 0 === num || 0 === num) {
                    return num;
                }

                if (targetNum > 100000) {

                    if (targetNum > 100000000) {
                        num = targetNum / Math.pow(10, 8);
                        numRange = 2;
                    } else {
                        num = targetNum / Math.pow(10, 4);
                        numRange = 1;
                    }
                }

                switch (numRange) {
                    case 1:
                        unit = '万';
                        break;
                    case 2:
                        unit = '亿';
                        break;
                    default :
                        unit = '';
                        break;
                }

                num = num + '';

                var arr = num.split('.'), reg = /(-?\d+)(\d{3})/;
                while (reg.test(arr[0])) {
                    arr[0] = arr[0].replace(reg, '$1,$2');
                }
                if (1 < arr.length) {
                    arr[1] = Math.round(Number('0.' + arr[1]) * Math.pow(10, 2));
                    num = arr[0] + '.';
                    if (0 < arr[1] && 10 > arr[1]) {
                        num += '0' + arr[1];
                    } else {
                        num += arr[1];
                    }

                    return num + unit;
                }
                return arr[0] + unit;
            };
        })
        //Author Yuhao
        //Return sorting order in chinese
        .filter('indicatorSorting', function () {
            return function (indicator, sorting) {
                //return 'It works';
                if (sorting = 'Des') return indicator + '从高到低';
                if (sorting = 'Asc') return indicator + '从低到高';
                return indicator;

            };
        })
        //Author Yuhao
        //Convert percentVal to be adopted with arrow
        .filter('percentWithArrow', function () {
            return function (value, unit) {
                unit = unit || '%';
                var res = value || '';
                if (isNaN(res)) {
                    return '--';
                }
                var calValue = Math.round(res * Math.pow(10, 4)) / Math.pow(10, 2);
                //return zero if the percentage is zero
                if (calValue == 0) {
                    return '--';
                }
                if (1000 < calValue) {
                    calValue = Math.round(calValue);
                }
                if (5000 < calValue) {
                    res = '>' + 5000 + unit;
                } else {
                    res = calValue + unit;
                }
                return res;
            }
        })
        .filter("dateFormat", function () {
            return function (d, format) {
                var date = d;

                if (!isNaN(d)) {
                    date = new Date(d);
                }

                if (date) {
                    var o = {
                        "M+": date.getMonth() + 1, //month
                        "d+": date.getDate(), //day
                        "h+": date.getHours(), //hour
                        "m+": date.getMinutes(), //minute
                        "s+": date.getSeconds(), //second
                        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                        "S": date.getMilliseconds() //millisecond
                    };

                    format = format || "yyyy-MM-dd hh:mm:ss";

                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                    }

                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                        }
                    }
                    return format;
                }
            };
        })
        //时间格式过滤器
        .filter("msgTime", function () {
            function fixed(val, num) {
                var rtn = val + "";
                for (var i = 0; i < (num - rtn.length); i++) {
                    rtn = '0' + rtn;
                }
                return rtn;
            }

            return function (d) {
                if (d !== undefined && d !== null) {
                    var date = new Date(d),
                        now = new Date(),
                        yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);

                    var rtn = "";
                    if (date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
                        rtn = rtn + "今天";
                    } else if (date.getFullYear() == yesterday.getFullYear() && date.getMonth() == yesterday.getMonth() && date.getDate() == yesterday.getDate()) {
                        rtn = rtn + "昨天";
                    } else {
                        rtn = rtn + fixed(date.getMonth() + 1, 2) + "-" + fixed(date.getDate(), 2);
                    }

                    rtn = rtn + " " + fixed(date.getHours(), 2) + ":" + fixed(date.getMinutes(), 2);

                    return rtn;
                }
                return d;
            }
        })
        .filter('isEmpty', function () {
            return function (jsonObj) {
                return _.isEmpty(jsonObj);
            };
        })
        .filter('isNotEmpty', function () {
            return function (jsonObj) {
                return !_.isEmpty(jsonObj);
            };
        })
        .filter('fixImage', function () {
            return function (url, subfix) {

                var newUrl = htmlDecode(url);
                if (subfix) {
                    newUrl = newUrl + subfix;
                }

                return (_.isEmpty(url)) ? "/app/assets/imgs/base/empty.png" : newUrl;
            };
        })

        // 压缩图片过滤
        // @author dxw
        .filter('filterImg', function () {
            return function (imgUrl, subfix) {
                if (imgUrl) {

                    var newUrl = htmlDecode(imgUrl);
                    if (imgUrl.indexOf('007fenqi') >= 0) {
                        if (imgUrl.indexOf('@!') < 0) {
                            if (subfix) {
                                newUrl = imgUrl + subfix;
                            } else {
                                newUrl = imgUrl;
                            }
                        } else {
                            newUrl = imgUrl;
                        }
                    } else {
                        newUrl = imgUrl;
                    }

                    return (_.isEmpty(imgUrl)) ? "/app/assets/imgs/base/empty.png" : newUrl;
                }
            };
        })
        // 过滤器：活动中心
        // @author dxw
        .filter("activeFilter", function () {
            return function (d) {
                if (d !== undefined && d !== null) {
                    if (d === 'wait')return '未开始';
                    if (d === 'doing')return '抢券中';
                    if (d === 'end')return '已结束';
                }
                return d;
            }
        })
        .filter('toTrusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(htmlDecode(text));
            };
        }])

    // 过滤器：贷款超市

        .filter('numHand', function () {
            return function (targetNum) {
                var num = 0;
                if (targetNum !== undefined && targetNum !== null) {
                    if(targetNum >= 10000){
                        num = (targetNum / Math.pow(10, 4)).toFixed(1) + "万";
                    }else{
                        num = targetNum;
                    }
                }
                return num;
            };
        })
});
