var app = getApp()

Page({
  data:{
    copyright: app.globalData.copyright,
    email: app.globalData.email,
    campaignId: ''
  },

  onLoad:function(options){
    this.setData({
      campaignId: options.campaignId
    })

    wx.setNavigationBarTitle({
      title: '报名成功',
    });
  }

})