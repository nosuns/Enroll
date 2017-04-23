const AV = require('./libs/av-weapp-min');

App({

  onLaunch: function () {
    AV.init({ 
    // appId: 'uzAcOWCdWIPdbXWFzkR9Rpbg-gzGzoHsz', 
    // appKey: '9Rtj5cumncTkXyk2tUXB3cPD',
      appId: 'BvrDHualRFTEUJRX9BIv5YET-gzGzoHsz',
      appKey: 'gIYca9nAlvsqzsmPXH7squpX' 
    });

    // 调用leanCloud登录接口
    AV.User.loginWithWeapp().then(user => {
      this.globalData.leanUser = user.toJSON();
    }).catch(console.error);

    // 获得当前登录用户
    var user = AV.User.current();
    // 调用小程序API，得到用户信息
    wx.getUserInfo({
      success: ({userInfo}) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          this.globalData.leanUser = user.toJSON();
        }).catch(console.error);
      }
    });
  },

  // 获取微信用户信息 
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
    userInfo: null,
    leanUser: null,
    copyright: 'Copyright © 2017 NopleStudio',
    email:'NopleS@163.com'
  }
});