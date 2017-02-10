// const complexAV = require('./libs/leancloud-storage');
const AV = require('./libs/av-weapp-min');

App({

  onLaunch: function () {
    AV.init({ 
    appId: 'uzAcOWCdWIPdbXWFzkR9Rpbg-gzGzoHsz', 
    appKey: '9Rtj5cumncTkXyk2tUXB3cPD', 
      });

    // AV.User.loginWithWeapp().then(user => {
    //     this.globalData.user = user.toJSON();
    // }).catch(console.error);


  //   complexAV.init({ 
  //   appId: 'uzAcOWCdWIPdbXWFzkR9Rpbg-gzGzoHsz', 
  //   appKey: '9Rtj5cumncTkXyk2tUXB3cPD', 
  //     });
  //   complexAV.User.loginWithWeapp().then(user => {
  //       this.globalData.user = user.toJSON();
  //   }).catch(console.error);

    // 调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },

  
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,

  }
});