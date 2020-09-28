import {
  showModal,
  formatTime
} from '../util'
const app = getApp()

Page({
  data: {
    inputValue:'',
    showModal:false,
    list:[],
  },

  onLoad: function() {
    this.getList()
  },
  openModal:function(){
    this.setData({
      showModal: true
    });
  },
  closeModal:function(){
    this.setData({
      showModal: false
    });
  },
  //发问题
  postTask: function (res) {
    const that = this;
    if (!this.data.inputValue) {
      showModal('亲爱的', '请填写你想要打卡的任务')
    } else {
      wx.cloud.callFunction({
        name: 'createtask',
        data: {
          "create_time": formatTime(new Date()),
          "name": this.data.inputValue,
        },
        success: res => {
          that.setData({
            showModal: false
          });
        },
        fail: err => {
          console.log(err)
          // that.setData({
          //   hiddenLoadingPost: true
          // });
        }
      })
    }
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  getList: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'tasklist',
      success: res => {
        that.setData({
          list: res.result,
          hiddenLoading: true
        });
      },
      fail: err => {
        console.log(err)
      }
    })

  },



})
