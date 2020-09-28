// 工具函数库
import config from './config'
const qcloud = require('../vendor/wafer2-client-sdk/index')
const app = getApp()

// http get / post工具函数 获取数据
export function get(url, token) {
  return request(url, 'GET', '', token)
}

export function post(url, data) {
  return request(url, 'POST', data)
}

function request(url, method, data = {}, token) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      header: {
        'content-type': 'application/json',
        'Authorization': token || ""
      },
      url: url,
      success: function (res) {
        resolve(res)
      }
    })
  })
}

// login
export function login() {

  const session = qcloud.Session.get()

  if (session) {
    // 第二次登录
    // 或者本地已经有登录态
    // 可使用本函数更新登录态
    qcloud.loginWithCode({
      success: res => {
        // this.setData({ userInfo: res, logged: true })
        // util.showSuccess('登录成功')
      },
      fail: err => {
        console.error(err)
        util.showModel('登录错误', err.message)
      }
    })
  } else {
    // 首次登录
    qcloud.login({
      success: res => {
        // this.setData({ userInfo: res, logged: true })
        // util.showSuccess('登录成功')
      },
      fail: err => {
        console.error(err)
        util.showModel('登录错误', err.message)
      }
    })
  }
}

// format data
export function currentDate(date) {
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
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



// showModal,showToast
export function showModal(title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}
export function showSuccess(text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}

// getToken
export function token() {
  return wx.getStorageSync('weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A').skey;
}

export function open_id() {
  return wx.getStorageSync('weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A').userinfo.openId;
}

export function url_options() {
  const pages = getCurrentPages();
  const curPages = pages[pages.length - 1];
  return curPages.options
}

export function loginAgain() {
  showModal('长时间未登录', "帮你跳转到登录页面")
  wx.navigateTo({
    url: '../welcome/welcome'
  })
}
