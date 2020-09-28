import {
  post,
  get,
  showModal,
  formatTime,
  login
} from '../util'
import {
  md5
} from '../md5'
import config from '../config'
var qcloud = require('../../vendor/wafer2-client-sdk/index')

//index.js
const app = getApp()

Page({
  data: {
    searchList: "",
    searchValue: "",
    app_key: "6a56b019bb0906a0f0ca8357e22d4aee",
    app_secret: "29fc3210c7614a669183a1633e39f211",
    method: "jd.union.open.goods.jingfen.query",
    v: "1.0"
  },
  onLoad: function () {
    console.log(getCurrentPages())
    const timestamp = this.currentDate(new Date())
    const that = this;
    const param_json = JSON.stringify({ "goodsReq": { "eliteId": "22", "pageSize": "50" } })
    let sign = this.data.app_secret +
      "app_key" + this.data.app_key +
      "formatjson" +
      "method" + this.data.method +
      "param_json" + param_json +
      "sign_method" + "md5" +
      "timestamp" + timestamp +
      "v" + this.data.v +
      this.data.app_secret;
    sign = md5(sign).toUpperCase()
    let url = "https://router.jd.com/api?" +
      "&app_key=" + encodeURIComponent(this.data.app_key) +
      "&format=json" +
      "&method=" + encodeURIComponent(this.data.method) +
      "&param_json=" + encodeURIComponent(param_json) +
      "&sign_method=" + "md5" +
      "&timestamp=" + encodeURIComponent(timestamp) +
      "&v=" + "1.0" +
      "&sign=" + encodeURIComponent(sign)
    get(url).then(function (res) {
      console.log(JSON.parse(res.data.jd_union_open_goods_jingfen_query_response.result).data)
      that.setData({
        searchList: JSON.parse(res.data.jd_union_open_goods_jingfen_query_response.result).data
      })
    })


  },
  currentDate(date) {
    var year = date.getFullYear();        //年 ,从 Date 对象以四位数字返回年份
    var month = date.getMonth() + 1;      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
    var day = date.getDate();             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
    var hours = date.getHours();          //小时 ,返回 Date 对象的小时 (0 ~ 23)
    var minutes = date.getMinutes();      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
    var seconds = date.getSeconds();      //秒 ,返回 Date 对象的秒数 (0 ~ 59)
    //修改月份格式
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    //修改日期格式
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    //修改小时格式
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    //修改分钟格式
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    //修改秒格式
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    //格式(yyyy-mm-dd hh:mm:ss)
    var currentFormatDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return currentFormatDate;
  },

  search: function () {

    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    const that = this;
    const change = that.data.searchValue;

    let sign = client_secret +
      "client_id" + client_id +
      "keyword" + change +
      "timestamp" + timestamp +
      "typepdd.ddk.goods.search" +
      client_secret;
    console.log(sign)
    sign = md5(sign).toUpperCase()

    post("https://gw-api.pinduoduo.com/api/router", {
      client_id: client_id,
      timestamp: timestamp,
      keyword: change,
      sign: sign,
      type: "pdd.ddk.goods.search",
    }).then(function (res) {
      that.setData({
        searchList: JSON.parse(res.goods_search_response.goods_list)
      })
      console.log(JSON.parse(res.data.goods_search_response.goods_list))
    })


  },

  goToShop(e) {
    console.log(e)
    const timestamp = this.currentDate(new Date())
    const that = this;
    const param_json = JSON.stringify({ "goodsReq": { "eliteId": "22", "pageSize": "50" } })
    let sign = this.data.app_secret +
      "app_key" + this.data.app_key +
      "formatjson" +
      "method" + this.data.method +
      "param_json" + param_json +
      "sign_method" + "md5" +
      "timestamp" + timestamp +
      "v" + this.data.v +
      this.data.app_secret;
    sign = md5(sign).toUpperCase()
    let url = "https://router.jd.com/api?" +
      "&app_key=" + encodeURIComponent(this.data.app_key) +
      "&format=json" +
      "&method=" + encodeURIComponent(this.data.method) +
      "&param_json=" + encodeURIComponent(param_json) +
      "&sign_method=" + "md5" +
      "&timestamp=" + encodeURIComponent(timestamp) +
      "&v=" + "1.0" +
      "&sign=" + encodeURIComponent(sign)
    get(url).then(function (res) {
      console.log(JSON.parse(res.data.jd_union_open_goods_jingfen_query_response.result).data)
      that.setData({
        searchList: JSON.parse(res.data.jd_union_open_goods_jingfen_query_response.result).data
      })
    })
  },

  bindKeyInput(e) {
    console.log(e.detail.value)
    this.setData({
      searchValue: e.detail.value
    })
  },

})
