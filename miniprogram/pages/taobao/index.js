import {
  get,
  currentDate
} from '../util'
import {
  md5
} from '../md5'


Page({
  data: {
    host: "https://eco.taobao.com/router/rest?",
    method_search: "taobao.tbk.dg.material.optional",
    method_taokouling: "taobao.tbk.tpwd.create",
    adzone_id: "109844050158",
    app_key: "28183318",
    app_secret: "aef6e031bbc734fd2fa2c8dea5194ef5",
    searchList: "",
    searchValue: "双旦",
    v: "2.0",
    nowPage: 1,
    count: 0
  },
  onLoad: function () {
    this.search(1)
  },
  onReachBottom: function () {
    if (this.data.nowPage * 100 < this.data.count) {
      this.search(this.data.nowPage++)
      this.setData({
        nowPage: this.data.nowPage++,
      })
    }
  },
  search_one() {
    this.setData({
      nowPage: 1,
    })
    this.search(1)
  },
  search: function () {
    const timestamp = currentDate(new Date())
    const that = this;
    let sign = this.data.app_secret +
      "adzone_id" + this.data.adzone_id +
      "app_key" + this.data.app_key +
      "formatjson" +
      "method" + this.data.method_search +
      "page_no" + this.data.nowPage +
      "page_size100" +
      "q" + this.data.searchValue +
      "sign_method" + "md5" +
      "timestamp" + timestamp +
      "v" + this.data.v +
      this.data.app_secret;
    sign = md5(sign).toUpperCase()
    let url = this.data.host +
      "app_key=" + encodeURIComponent(this.data.app_key) +
      "&adzone_id=" + encodeURIComponent(this.data.adzone_id) +
      "&method=" + encodeURIComponent(this.data.method_search) +
      "&q=" + encodeURIComponent(this.data.searchValue) +
      "&sign_method=" + "md5" +
      "&page_size=" + "100" +
      "&format=" + "json" +
      "&timestamp=" + encodeURIComponent(timestamp) +
      "&page_no=" + encodeURIComponent(this.data.nowPage) +
      "&v=" + encodeURIComponent(this.data.v) +
      "&sign=" + encodeURIComponent(sign)
    get(url).then(function (res) {
      let newList = "";
      if (that.data.nowPage === 1) {
        newList = res.data.tbk_dg_material_optional_response.result_list.map_data
      } else {
        newList = that.data.searchList.concat(res.data.tbk_dg_material_optional_response.result_list.map_data);
      }

      that.setData({
        searchList: newList,
        count: res.data.tbk_dg_material_optional_response.total_results
      })
    })


  },
  goToShop(e) {
    const shareUrl = "https:" + e.currentTarget.dataset.url
    const title = e.currentTarget.dataset.title
    const timestamp = currentDate(new Date())
    const that = this
    let sign = this.data.app_secret +
      "adzone_id" + this.data.adzone_id +
      "app_key" + this.data.app_key +
      "formatjson" +
      "method" + this.data.method_taokouling +
      "sign_method" + "md5" +
      "text" + title +
      "timestamp" + timestamp +
      "url" + shareUrl +
      "v" + this.data.v +
      this.data.app_secret;
    sign = md5(sign).toUpperCase()
    let url = this.data.host +
      "app_key=" + encodeURIComponent(this.data.app_key) +
      "&adzone_id=" + encodeURIComponent(this.data.adzone_id) +
      "&method=" + encodeURIComponent(this.data.method_taokouling) +
      "&sign_method=" + "md5" +
      "&format=" + "json" +
      "&text=" + encodeURIComponent(title) +
      "&timestamp=" + encodeURIComponent(timestamp) +
      "&v=" + encodeURIComponent(this.data.v) +
      "&url=" + encodeURIComponent(shareUrl) +
      "&sign=" + encodeURIComponent(sign);
    get(url).then(function (res) {
      const taokoulingUrl = res.data.tbk_tpwd_create_response.data.model
      that.clipboardData(title, taokoulingUrl)

    })

  },
  clipboardData(title, taokoulingUrl) {
    wx.showModal({
      title: '復制後打開【手機淘寶】',
      content: title + taokoulingUrl,
      confirmText: '復制',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: taokoulingUrl,
            success: function (t) {
              wx.getClipboardData({
                success: function (t) {
                  console.log(t.data) // data
                }
              })
            }
          })
        }
      },
    })

  },
  bindKeyInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
})
