var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLaunch: function() {
    qcloud.setLoginUrl(config.service.loginUrl)
  },
  globalData: {
    isRefreshListPage: true,
    isRefreshListPage2:true,
    isLoged:false
  }
})