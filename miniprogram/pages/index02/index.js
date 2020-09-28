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
    activity_type:0,
    
  },
  onReachBottom: function () {
    if (this.data.page * 100 < this.data.count) {
      this.setData({
        page: this.data.page++,
      })
      this.search(this.data.page++,true)
    }
  },
  onLoad: function () {
    this.goodlist()
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

  //回到顶部，内部调用系统API
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低,无法滚动到顶部。'
      })
    }
  },
  search_one() {
    this.goTop()
    this.setData({
      searchList:"",
      page: 1,
      isSearch: true
    })
    this.search(1,false)
  },
  search: function (page,isScroll) {
    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    const that = this;
    const change = that.data.searchValue;
    let activity_type = "[" + this.data.activity_type + "]";
    let sign = client_secret +
      "activity_tags" + activity_type +
      "client_id" + client_id +
      "keyword" + change +
      "page" + page +
      "sort_type" + that.data.sort_type +
      "timestamp" + timestamp +
      "typepdd.ddk.goods.search" +
      "with_coupontrue" +
      client_secret;

    sign = md5(sign).toUpperCase()

    post("https://gw-api.pinduoduo.com/api/router", {
      client_id: client_id,
      timestamp: timestamp,
      keyword: change,
      sign: sign,
      page: page,
      type: "pdd.ddk.goods.search",
      sort_type: that.data.sort_type,
      with_coupon: true,
      activity_tags: activity_type,
    }).then(function (res) {
      let newList = "";
      if (page === 1) {
        newList = res.data.goods_search_response.goods_list
      } else {
        newList = that.data.searchList.concat(res.data.goods_search_response.goods_list);
      }
      if(that.data.isScroll){
        that.setData({
          sort_type: 0,
          activity_type: 0,
        })
      }
      that.setData({
        count: res.data.goods_search_response.total_count,
        searchList: newList,
        isSearch: true,
      })
    })


  },
  goodlist: function () {
    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    const that = this;
    const limit = 40;

    let sign = client_secret +
      "client_id" + client_id +
      "limit"+ limit +
      "sort_type1" +
      "timestamp" + timestamp +
      "typepdd.ddk.top.goods.list.query" +
      client_secret;

    sign = md5(sign).toUpperCase()

    post("https://gw-api.pinduoduo.com/api/router", {
      client_id: client_id,
      timestamp: timestamp,
      sign: sign,
      limit: limit,
      type: "pdd.ddk.top.goods.list.query",
      sort_type: 1,
    }).then(function (res) {
      that.setData({
        searchList: res.data.top_goods_list_get_response.list
      })
    })

  },
  sort: function (e) {
    this.goTop();
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
