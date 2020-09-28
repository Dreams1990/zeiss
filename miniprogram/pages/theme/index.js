import {
  post,
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
    imageList: '',
    searchValue: "爆款",
    isSearch: false,
    page: 1,
    count: 0,
    now_goods_id: 0,
    sort_type: 0,
    p_id: '8712669_70951125',
    isShowPopup: false,
    activity_type:0
  },
  onReachBottom: function () {
    if (this.data.page * 100 < this.data.count) {
      this.setData({
        page: this.data.page++,
      })
      this.search(this.data.page++,true)
    }
  },
  onShow: function () {
    const pages = getCurrentPages();
    const curPages = pages[pages.length - 1];
    const id = curPages.options.id;
    this.goodlist(id)
  },
  goToDetail(e) {
    const that = this;
    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    let goods_id_list = "[" + e.currentTarget.dataset.id + "]";

    let sign = client_secret +
      "client_id" + client_id +
      "goods_id_list" + goods_id_list +
      "timestamp" + timestamp +
      "typepdd.ddk.goods.detail" +
      client_secret;

    sign = md5(sign).toUpperCase()

    post("https://gw-api.pinduoduo.com/api/router", {
      client_id: client_id,
      goods_id_list: goods_id_list,
      timestamp: timestamp,
      sign: sign,
      type: "pdd.ddk.goods.detail",
    }).then(function (res) {
      that.setData({
        imageList: res.data.goods_detail_response.goods_details[0].goods_gallery_urls,
        isShowPopup: true,
        now_goods_id: e.currentTarget.dataset.id
      })
    })
  },
  goodlist: function (id) {
    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    const that = this;
    const type = "pdd.ddk.theme.goods.search";

    let sign = client_secret +
      "client_id" + client_id +
      "theme_id" + id +
      "timestamp" + timestamp +
      "type" + type +
      client_secret;

    sign = md5(sign).toUpperCase()

    post("https://gw-api.pinduoduo.com/api/router", {
      client_id: client_id,
      timestamp: timestamp,
      theme_id: id,
      sign: sign,
      type: type,
    }).then(function (res) {
      that.setData({
        searchList: res.data.theme_list_get_response.goods_list
      })
    })

  },
  sort: function (e) {
    const id = e.target.dataset.id;
    this.setData({
      sort_type: Math.floor(id),
    });
    this.setData({
      page: 1,
    })
    this.search(1,false)
  },
  activity: function (e) {
    const id = e.target.dataset.id;
    if(id == this.data.activity_type){
      console.log(1);
      this.setData({
        activity_type: 0,
      });
    }else{
      this.setData({
        activity_type: Math.floor(id),
      });
    }
    this.setData({
      page: 1,
    })
    this.search(1,false)
  },
  closePopup: function () {
    this.setData({
      imageList: [],
      isShowPopup: false,
      now_goods_id: 0
    })
  },
  goToShop(e) {
    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    let goods_id_list = "[" + e.currentTarget.dataset.id + "]";
    let sign = client_secret +
      "client_id" + client_id +
      "generate_we_apptrue" +
      "goods_id_list" + goods_id_list +
      "p_id" + this.data.p_id +
      "timestamp" + +timestamp +
      "typepdd.ddk.goods.promotion.url.generate" +
      client_secret;

    sign = md5(sign).toUpperCase()

    post("https://gw-api.pinduoduo.com/api/router", {
      client_id: client_id,
      timestamp: timestamp,
      goods_id_list: goods_id_list,
      sign: sign,
      type: "pdd.ddk.goods.promotion.url.generate",
      p_id: this.data.p_id,
      generate_we_app: true
    }).then(function (res) {
      const url = res.data.goods_promotion_url_generate_response.goods_promotion_url_list[0].we_app_info;
      wx.navigateToMiniProgram({
        appId: url.app_id,
        path: url.page_path,
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
      // that.setData({
      //   searchList: res.data.goods_search_response.goods_list
      // })
    })
  },

  bindKeyInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },

})
