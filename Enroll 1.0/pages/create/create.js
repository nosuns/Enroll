const AV = require('../../libs/av-weapp-min');
var util = require('../../utils/util.js');  
var app = getApp()

Page({
  data: {
    copyright: app.globalData.copyright,
    email: app.globalData.email,
    title: '',
    info: '',
    infoLength: 0,
    startDate: '2017-01-01',
    startTime: '09:00',
    endDate: '2017-01-01',
    endTime: '18:00',
    isShow: false,
    location: '',
    locationAddress: '',
    hasLocation: false,
    lat: 0,
    lng: 0,
    isSubmit: 0
  },

  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          hasLocation: true,
          lat: Number(res.latitude),
          lng: Number(res.longitude),
          location: res.name,
          locationAddress: res.address
        })
      }
    })
  },
  clear: function () {
    this.setData({
      hasLocation: false
    })
  },

  onLoad: function () {  
    var date = util.formatTimeDateOnly(new Date());  
    this.setData({  
        startDate: date,
        endDate: date
         });  
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

  // 顶部的红色错误提示   
  showTopTips: function(msg) {
    var that = this;
        this.setData({
            errMsg:msg,
            showTopTips: true
        });
        setTimeout(function(){
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },

  onSubmit: function() {
    //按钮点击后立即设为disable，防连点  
    this.setData({isSubmit: 1});  

    if(this.data.startDate > this.data.endDate) {
        this.showTopTips('开始日期 必须早于 结束日期');
        this.setData({isSubmit: 0});  
        return false;
    }
    else if(this.data.startDate == this.data.endDate && this.data.startTime > this.data.endTime) {
        this.showTopTips('开始时间 必须早于 结束时间');
        this.setData({isSubmit: 0});  
        return false;
    }
    else{
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
      campaign.set('locationAddress', this.data.locationAddress);
      campaign.set('lat', this.data.lat);
      campaign.set('lng', this.data.lng);
      campaign.save().then(function(campaign){
          wx.showToast({
              title: '创建成功',
              icon: 'success',
          })
          setTimeout(function(){
              wx.redirectTo({url: '../../pages/info/info?campaignId='+campaign.id});
          },1500)       
      }).catch(console.error)
    }
  }

})