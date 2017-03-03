const AV = require('../../libs/av-weapp-min');
var bmap = require('../../libs/bmap-wx.js');
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
    address: ''
  },
  // markertap:function(e) {
  //   var that = this; 
  //   var id = e.markerId; 
  //   that.showSearchInfo(wxMarkerData, id); 
  // },

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
      numberQuery.select(['number']);
      numberQuery.equalTo('campaign', campaign);
      numberQuery.find().then(function(numbers) {
        var totalNumber = 0;
        numbers.forEach(function(number, i, a) {
          totalNumber = totalNumber + number.get('number');
        })
        that.setData({enrollNum: totalNumber});
      })

      // 根据开始日期与结束日期是否相等，来显示不同格式的活动时间
      var startDate = campaign.get('startDate').replace(/-/g, '/');
      var endDate = campaign.get('endDate').replace(/-/g, '/');
      var startTime = campaign.get('startTime');
      var endTime = campaign.get('endTime');
      // 计算星期几
      var startDay = new Date(Date.parse(startDate)).getDay();
      var strStartDay = that.parseDay(startDay);
      var endDay = new Date(Date.parse(endDate)).getDay();
      var strEndDay = that.parseDay(endDay);
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

  },

  parseDay: function(day) {
    var dayStr;
    switch(day) {
      case 0:
        dayStr = '(星期日)';
        break;
      case 1:
        dayStr = '(星期一)';
        break;
      case 2:
        dayStr = '(星期二)';
        break;
      case 3:
        dayStr = '(星期三)';
        break;
      case 4:
        dayStr = '(星期四)';
        break;
      case 5:
        dayStr = '(星期五)';
        break;
      case 6:
        dayStr = '(星期六)';
        break;
    }

    return dayStr;
  }
  
})