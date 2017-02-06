const {Object, User, Query} = require('../../libs/leancloud-storage');
const AV = require('../../libs/av-weapp-min');

// pages/userlist/userlist.js
var app = getApp()

Page({
  data: {
    members:[],
  },

  onReady: function() {
    new AV.Query('Members')
      .descending('createdAt')
      .find()
      .then(members => this.setData({ members }))
      .catch(console.error);
      
    
  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },


  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})