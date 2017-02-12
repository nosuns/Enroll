const app = getApp();
const AV = require('../../libs/av-weapp-min');

Page({
  data: {
    userInfo: {},
    enrolled:'0', 
    copyright:"Copyright © 2017 Nople Studio",
  },

  onShareAppMessage: function () {
    return {
      title: '聚会报名',
      desc: '报名参加吧',
      path: '/pages/index/index'
    }
  },

  onLoad: function () {
    console.log('onLoad')
    // var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    var user = AV.User.current();
    this.setData({
      userInfo: user
    })
    

    //  new AV.Query('Members')
    //   .equalTo('userID',AV.User.current())
    //   .count()
    //   .then(enrolled => {
    //     this.setData({ enrolled });
    //   })
    //   .catch(console.error); 

  }

})
