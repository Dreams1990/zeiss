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
    client_secret:"3160e7beb12f18eddb7d5cfd5f7f812779a37f93",
    client_id:"b6e234a16f9e4a5dbbf0a30180420dda",
    theme_list:[],
    baihuo_list:[],
    muyin_list:[],
    qincang_list:[],
    xihuan_list:[],
    rexiao_list:[],
    currentIndex: 0,
    dots: [],
  },
  currentChange(e) {
    this.setData({
      currentIndex: e.detail.current
    })
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
    this.theme();
    this.recommend(0);
    this.recommend(1);
    this.recommend(2);
    this.recommend(5);
    this.recommend(4)
  },
  link: function (e) {
    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    const p ="8712669_70951125"
    const p_id_list = '["'+ p + '"]';
    const that = this;
    const channel_type = e.currentTarget.dataset.id;
    let sign = client_secret +
      'channel_type' + channel_type +
      'client_id' + client_id +
      "generate_we_apptrue"+
      'p_id_list' + p_id_list  +
      'timestamp' + timestamp +
      'typepdd.ddk.rp.prom.url.generate' + client_secret;

    sign = md5(sign).toUpperCase()
    post("https://gw-api.pinduoduo.com/api/router", {
      channel_type: channel_type,
      client_id: client_id,
      p_id_list: p_id_list,
      generate_we_app:true,
      sign: sign,
      timestamp: timestamp,
      type: "pdd.ddk.rp.prom.url.generate",
    }).then(function (res) {
      const url = res.data.rp_promotion_url_generate_response.url_list[0].we_app_info;
      console.log(res)
      wx.navigateToMiniProgram({
        appId: url.app_id,
        path: url.page_path,
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
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
  themeLink: function(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../theme/index?id="+id
    })
  },
  themeLink02: function(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../theme2/index?id="+id
    })
  },
  theme:function(){
    const that = this;
    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    const type = 'pdd.ddk.theme.list.get';

    let sign = client_secret +
      "client_id" + client_id +
      "timestamp" + timestamp +
      "type" + type +
      client_secret;

    sign = md5(sign).toUpperCase()

    post("https://gw-api.pinduoduo.com/api/router", {
      client_id: client_id,
      timestamp: timestamp,
      sign: sign,
      type: type,
    }).then(function (res) {
      const theme_list = res.data.theme_list_get_response.theme_list;
      that.setData({
        theme_list: res.data.theme_list_get_response.theme_list,
        dots: new Array(res.data.theme_list_get_response.theme_list.length)
      })
    })
  },
  recommend(type){
    // 猜你喜欢场景的商品类目，20100-百货，20200-母婴，20300-食品，20400-女装，20500-电器，20600-鞋包，20700-内衣，20800-美妆，20900-男装，21000-水果，21100-家纺，21200-文具,21300-运动,21400-虚拟,21500-汽车,21600-家装,21700-家具,21800-医药;
    // 0-1.9包邮, 1-今日爆款, 2-品牌清仓,3-相似商品推荐,4-猜你喜欢,5-实时热销,6-实时收益,7-今日畅
    const client_secret = "3160e7beb12f18eddb7d5cfd5f7f812779a37f93";
    const client_id = "b6e234a16f9e4a5dbbf0a30180420dda";
    const timestamp = (new Date()).getTime();
    // const cat_id = type;
    const channel_type = type;
    const limit = 10;
    const that = this;

    let sign = client_secret +
      "channel_type" + channel_type +
      "client_id" + client_id +
      "limit" + limit +
      "timestamp" + +timestamp +
      "typepdd.ddk.goods.recommend.get" +
      client_secret;

    sign = md5(sign).toUpperCase()

    post("https://gw-api.pinduoduo.com/api/router", {
      client_id: client_id,
      timestamp: timestamp,
      // cat_id: cat_id,
      sign: sign,
      type: "pdd.ddk.goods.recommend.get",
      channel_type: channel_type,
      limit: limit
    }).then(function (res) {
      if(type === 0){
        that.setData({
          baihuo_list: res.data.goods_basic_detail_response.list
        })
      }
      if(type === 1){
        that.setData({
          muyin_list: res.data.goods_basic_detail_response.list
        })
      }
      if(type === 2){
        that.setData({
          qincang_list: res.data.goods_basic_detail_response.list
        })
      }
      if(type === 5){
        that.setData({
          rexiao_list: res.data.goods_basic_detail_response.list
        })
      }

      if(type === 4){
        that.setData({
          xihuan_list: res.data.goods_basic_detail_response.list
        })
      }





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
    })
  },

  bindKeyInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },

})
