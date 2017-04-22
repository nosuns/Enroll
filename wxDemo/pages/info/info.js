const AV = require('../../libs/av-weapp-min');
var bmap = require('../../libs/bmap-wx.js');
var util = require('../../utils/util.js');
var user = AV.User.current();

var wxMarkerData = [];

Page({
  data: {
    title: '',
    info: '',
    createdBy: '',
    avatarUrl: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
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
  
  // markertap:function(e) {
  //   var that = this; 
  //   var id = e.markerId; 
  //   that.showSearchInfo(wxMarkerData, id); 
  // },

  onShareAppMessage: function () {
    var that = this;
    console.log(user)
    return {
      title: user.get('nickName') + ' 邀请你参加聚会',
      desc: that.data.title,
      path: '/pages/info/info?campaignId=' + that.data.campaignId
    }
  },

  onLoad:function(options){
    var that = this;
    var campaignId = options.campaignId;
    // 从Campaign表中查出活动信息
    var query = new AV.Query('Campaign');
    query.include('createdBy');
    query.get(campaignId).then(function(campaign) {
      // 设置当前页面标题为活动名称
      wx.setNavigationBarTitle({
        title: campaign.get('name'),
      });
      
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

      // 根据开始日期与结束日期是否相等，来显示不同格式的活动时间
      var startDate = campaign.get('startDate').replace(/-/g, '/');
      var endDate = campaign.get('endDate').replace(/-/g, '/');
      var startTime = campaign.get('startTime');
      var endTime = campaign.get('endTime');
      // 计算星期几
      var startDay = new Date(Date.parse(startDate)).getDay();
      var strStartDay = util.parseDay(startDay);
      var endDay = new Date(Date.parse(endDate)).getDay();
      var strEndDay = util.parseDay(endDay);
      if (startDate == endDate) {
        var oneDay = startDate + strStartDay + ' ' + startTime + '-' + endTime;
        that.setData({
          isOneDay: true,
          oneDay: oneDay
        })
      } else {
        that.setData({
          startDateTime: startDate + strStartDay + ' ' + startTime,
          endDateTime: endDate + strEndDay + ' ' + endTime
        })
      }

      // 赋值其他活动信息
      that.setData({
        campaignId: campaign.id,
        title: campaign.get('name'),
        info: campaign.get('description'),
        createdBy: campaign.get('createdBy').get('nickName'),
        avatarUrl: campaign.get('createdBy').get('avatarUrl'),
        lat: campaign.get('lat'),
        lng: campaign.get('lng')
      })

      // 根据经纬度来获取地址信息
      var BMap = new bmap.BMapWX({ 
        ak: 'ntQQvConZD2oSe4hXE2lfrwNetggT2Ih' 
      }); 

      BMap.regeocoding({
        location: String(that.data.lat)+','+String(that.data.lng),
        iconPath: '../../img/marker_red.png', 
        iconTapPath: '../../img/marker_red.png',
        success: function (res) {
          wxMarkerData = res.wxMarkerData;
          var address = wxMarkerData[0].address;
          that.setData({
            markers: wxMarkerData,
            location: campaign.get('location') + ' ' + address
          })
        }
      })

    })

  }
  
})