Page({
  data:{
    copyright:"Copyright © 2017 Nople Studio",
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