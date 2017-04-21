const AV = require('../../libs/av-weapp-min');
var util = require('../../utils/util.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    enrolled:'0', 
    copyright:"Copyright © 2017 Nople Studio",
    tabs: ["我参加的聚会", "我发起的聚会","测试链接"],
    activeIndex: "0",
    sliderOffset: 0,
    sliderLeft: 0,
    enrolledList: [],
    createdList: [],
    enrolledNumbers: 0
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
    // 获取屏幕宽度，计算tab位置
    wx.getSystemInfo({
        success: function(res) {
            that.setData({
                sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2
            });
        }
    });

    // 从Enroll表中查出用户参加的所有聚会
    var user = AV.User.current();
    var equery = new AV.Query('Enroll');
    equery.equalTo('user', user);
    equery.include('campaign');
    equery.find().then(function(enrollList) {
      var tempEnrolledList = [];
      enrollList.forEach(function(enroll, i, a) {
        // 格式化活动时间
        var dateList = [];
        dateList = that.parseCampaignDate(enroll.get('campaign'));
        // 计算参加该活动的总人数
        // var numberQuery = new AV.Query('Enroll');
        // numberQuery.select('number');
        // numberQuery.equalTo('campaign', enroll.get('campaign'));
        // numberQuery.find().then(function(numbers) {
        //   var totalNumber = 0;
        //   numbers.forEach(function(number, i, a) {
        //     totalNumber = totalNumber + number.get('number');
        //   })
        //   that.setData({enrolledNumbers:totalNumber})
        // })
        // 是否为本人发起
        var isOwner = 0;
        if(enroll.get('campaign').get('createdBy').id == user.id) {
          isOwner = 1;
        }
        tempEnrolledList[i] = {'campaignId': enroll.get('campaign').id,
                               'name': enroll.get('campaign').get('name'),
                               'startTime': dateList[1],
                               'endTime': dateList[2],
                               'allDay': dateList[0],
                               'isOwner': isOwner}
      })
      that.setData({enrolledList: tempEnrolledList});
      console.log(that.data.enrolledList);
    }).catch(console.error);

    // 从Campaign表中查出用户发起的所有聚会
    var cquery = new AV.Query('Campaign');
    cquery.equalTo('createdBy', user);
    cquery.find().then(function(campaignList) {
      var tempCreatedList = [];
      campaignList.forEach(function(campaign, i, a) {
        // 格式化活动时间
        var dateList = [];
        dateList = that.parseCampaignDate(campaign);
        tempCreatedList[i] = {'campaignId': campaign.id,
                              'name': campaign.get('name'),
                              'startTime': dateList[1],
                              'endTime': dateList[2],
                              'allDay': dateList[0]}
      })
      that.setData({createdList: tempCreatedList});
    }).catch(console.error);

  },

  gotoInfo: function (e) {
    wx.navigateTo({
      url: '../info/info?campaignId=' + e.currentTarget.dataset.campaignid
    })
  },

  // 格式化活动时间：根据开始日期与结束日期是否相等，来显示不同格式的活动时间
  parseCampaignDate: function (campaign) {
    var oneDay = '';
    var startDateTime = '';
    var endDateTime = '';
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
      oneDay = startDate + strStartDay + ' ' + startTime + '-' + endTime;
    } else {
      startDateTime =  startDate + strStartDay + ' ' + startTime;
      endDateTime = endDate + strEndDay + ' ' + endTime;
    }

    return [oneDay, startDateTime, endDateTime];
  },
    
  tabClick: function (e) {
      this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
      });
  }  
})
