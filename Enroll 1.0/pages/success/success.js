var app = getApp()

Page({
  data:{
    copyright: app.globalData.copyright,
    email: app.globalData.email,
    campaignId: '',
    // canIUse: wx.canIUse('navigator.open-type.navigateBack')
  },

  onLoad:function(options){
    this.setData({
      campaignId: options.campaignId
    })

    wx.setNavigationBarTitle({
      title: '报名成功',
    });
  },

  backToInfo: function(){
    wx.navigateBack({
      delta: 1, // 回退到活动详情页面
    })
  }

})