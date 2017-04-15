const AV = require('../../libs/av-weapp-min');

Page({
  data: {
      title: '',
      info: '',
      infoLength: 0,
      startDate: '2017-01-01',
      startTime: '00:00',
      endDate: '2017-01-01',
      endTime: '00:00',
      isShow: false,
      location: '',
      lat: 0,
      lng: 0
  },

  updateTitle: function(e) {
      this.setData({
          title: e.detail.value
      })
  },

  updateInfo: function(e) {
      this.setData({
          info: e.detail.value,
          infoLength: e.detail.value.length
      })
  },

  bindStartDateChange: function(e) {
      this.setData({
          startDate: e.detail.value
      })
  },

  bindStartTimeChange: function(e) {
      this.setData({
          startTime: e.detail.value
      })
  },

  bindEndDateChange: function (e) {
      this.setData({
          endDate: e.detail.value
      })
  },

  bindEndTimeChange: function(e) {
      this.setData({
          endTime: e.detail.value
      })
  },

  switchChange: function(e) {
      this.setData({
          isShow: !this.data.isShow
      })
  },

  onShow: function() {
    // 页面显示
    try {
      var address = wx.getStorageSync('address')
      if (address) {
        this.setData({
            location: address.name,
            lat: address.lat,
            lng: address.lng
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  onSubmit: function() {
      // 将活动信息存入Campaign表
      var campaign = new AV.Object('Campaign');
      // 设置关联
      var user = AV.User.current();
      campaign.set('createdBy', user);
      // 其他活动字段
      campaign.set('name', this.data.title);
      campaign.set('description', this.data.info);
      campaign.set('startDate', this.data.startDate);
      campaign.set('endDate', this.data.endDate);
      campaign.set('startTime', this.data.startTime);
      campaign.set('endTime', this.data.endTime);
      campaign.set('isShowTime', this.data.isShow);
      campaign.set('location', this.data.location);
      campaign.set('lat', this.data.lat);
      campaign.set('lng', this.data.lng);
      campaign.save().then(function(campaign){
          wx.removeStorageSync('address');
          wx.redirectTo({url: '../../pages/info/info?campaignId='+campaign.id});
      })
  }

})