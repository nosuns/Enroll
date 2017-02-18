const app = getApp();
const AV = require('../../libs/av-weapp-min');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    userInfo: {},
    enrolled:'0', 
    copyright:"Copyright © 2017 Nople Studio",
    tabs: ["我参加的聚会", "我发起的聚会"],
    activeIndex: "0",
    sliderOffset: 0,
    sliderLeft: 0
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
    var that = this;
    wx.getSystemInfo({
        success: function(res) {
            that.setData({
                sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2
            });
        }
    });
    var user = AV.User.current();
    this.setData({
      userInfo: user
    })
  },
    
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }  
})
