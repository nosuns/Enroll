const AV = require('../../libs/av-weapp-min');
var util = require('../../utils/util.js');
var wxMarkerData = [];
var user = AV.User.current();
var app = getApp();

Page({
  data: {
    copyright: app.globalData.copyright,
    email: app.globalData.email,
    title: '',
    info: '',
    createdBy: '',
    avatarUrl: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    locationAddress: '',
    lat: '',
    lng: '',
    enrollNum: 0,
    campaignId: '',
    isOneDay: false,
    oneDay: '',
    markers: [],
    address: '',
    isEnroll: 1
  },

  openLocation: function (e) {
    var that = this;
    wx.openLocation({
      longitude: that.data.lng,
      latitude: that.data.lat,
      name: that.data.location,
      address: that.data.locationAddress
    })
  },

  onShareAppMessage: function () {
    var that = this;
    return {
      title: user.get('nickName') + ' 邀请你参加聚会',
      desc: that.data.title,
      path: '/pages/info/info?campaignId=' + that.data.campaignId
    }
  },

  onLoad:function(options){
    var that = this;

    wx.getSystemInfo({
        success: function(res) {
          if (res.windowHeight < 450){
            
            that.setData({
                copyright: '',
                email: ''
            });
          }
        }
    });

    var campaignId = options.campaignId;
    that.setData({
      campaignId: campaignId
    })
    // 从Campaign表中查出活动信息
    var query = new AV.Query('Campaign');
    query.include('createdBy');
    query.get(campaignId).then(function(campaign) {
      // 设置当前页面标题为活动名称
      wx.setNavigationBarTitle({
        title: campaign.get('name'),
      });
      // 格式化活动时间
      that.parseCampaignDate(campaign);
      // 赋值其他活动信息
      that.setData({
        title: campaign.get('name'),
        info: campaign.get('description'),
        createdBy: campaign.get('createdBy').get('nickName'),
        avatarUrl: campaign.get('createdBy').get('avatarUrl'),
        lat: campaign.get('lat'),
        lng: campaign.get('lng'),
        location: campaign.get('location'),
        locationAddress: campaign.get('locationAddress')
      })
    })
  },

  onShow: function () {
    var that = this;
    var campaignId = that.data.campaignId;
    // 查出总报名人数
    var query = new AV.Query('Campaign');
    query.get(campaignId).then(function(campaign) {
      that.queryTotalNum(campaign);
    })
  },

  // 查询报名总人数
  queryTotalNum: function (campaign) {
    var that = this;
    // 从Enroll表中查出报名总人数
    var numberQuery = new AV.Query('Enroll');
    numberQuery.select(['number','isEnroll','user']);
    numberQuery.equalTo('campaign', campaign);
    numberQuery.find().then(function(enrollList) {
      var totalNumber = 0;
      var isEnrolled = 0;
      enrollList.forEach(function(enroll, i, a) {
        totalNumber = totalNumber + enroll.get('number');
        // 查看当前用户是否已报名该活动
        if(user.id == enroll.get('user').id) {
          isEnrolled = 1;
        }
      })

      that.setData({
        enrollNum: totalNumber,
        isEnroll: isEnrolled
      });
    })
  },

  // 格式化活动时间：根据开始日期与结束日期是否相等，来显示不同格式的活动时间
  parseCampaignDate: function (campaign) {
    var that = this;
    var startDate = campaign.get('startDate').replace(/-/g, '/');
    var endDate = campaign.get('endDate').replace(/-/g, '/');
    var startTime = campaign.get('startTime');
    var endTime = campaign.get('endTime');
    var isShowTime = campaign.get('isShowTime');
    // 计算星期几
    var startDay = new Date(Date.parse(startDate)).getDay();
    var strStartDay = util.parseDay(startDay);
    var endDay = new Date(Date.parse(endDate)).getDay();
    var strEndDay = util.parseDay(endDay);
    var oneDay = '';
    if (startDate == endDate) {
      if (isShowTime == false) {
        oneDay = startDate + strStartDay + ' 全天';
      } else {
        oneDay = startDate + strStartDay + ' ' + startTime + '-' + endTime;
      }
      that.setData({
        isOneDay: true,
        oneDay: oneDay
      })
    } else {
      if (isShowTime == false) {
        that.setData({
          startDateTime: startDate + strStartDay,
          endDateTime: endDate + strEndDay
        })
      } else {
        that.setData({
          startDateTime: startDate + strStartDay + ' ' + startTime,
          endDateTime: endDate + strEndDay + ' ' + endTime
        })
      }
    }
  }
  
})