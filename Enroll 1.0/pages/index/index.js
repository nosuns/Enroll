const AV = require('../../libs/av-weapp-min');
var util = require('../../utils/util.js')
var sliderPadding = 10; // 需要设置slider的边距
var user = AV.User.current();

Page({
  data: {
    enrolled:'0', 
    tabs: ["我参加的聚会", "我发起的聚会"],
    activeIndex: "0",
    sliderOffset: 0,
    sliderLeft: sliderPadding,
    sliderWidth: 0,
    scrollviewHeight: 0,
    enrolledList: [],
    createdList: [],
    enrolledNumbers: 0
  },

  onShareAppMessage: function () {
    return {
      title: '轻量级聚会报名工具',
      desc: '帮助你快速组织聚会、统计人数。',
      path: '/pages/index/index'
    }
  },

  onLoad: function () {
    var that = this;
    // 获取屏幕宽度，计算tab位置
    wx.getSystemInfo({
        success: function(res) {
            that.setData({
                scrollviewHeight: res.windowHeight - 51 - 74,
                sliderWidth: res.windowWidth / that.data.tabs.length - sliderPadding * 2
            });
        }
    });
  },

  onShow: function () {
    var that = this;

    // 从Enroll表中查出用户参加的所有聚会
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
    var isShowTime = campaign.get('isShowTime');
    // 计算星期几
    var startDay = new Date(Date.parse(startDate)).getDay();
    var strStartDay = util.parseDay(startDay);
    var endDay = new Date(Date.parse(endDate)).getDay();
    var strEndDay = util.parseDay(endDay);
    if (startDate == endDate) {
      if (isShowTime == false) {
        oneDay = startDate + strStartDay + ' 全天';
      } else {
        oneDay = startDate + strStartDay + ' ' + startTime + '-' + endTime;
      }
    } else {
      if (isShowTime == false) {
        startDateTime =  startDate + strStartDay;
        endDateTime = endDate + strEndDay;
      } else {
        startDateTime =  startDate + strStartDay + ' ' + startTime;
        endDateTime = endDate + strEndDay + ' ' + endTime;
      }
    }

    return [oneDay, startDateTime, endDateTime];
  },
    
  tabClick: function (e) {
      this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
      });
  },  


  create: function(){
    wx.navigateTo({
      url: '../create/create'
    });
  }
  // create: function(){
  //   console.log(user);
  //   console.log(user.get('nickName'));
  //   if (typeof(user.get('nickName')) != "undefined") { 
  //     wx.navigateTo({
  //       url: '../create/create'
  //     });
  //   } 
  //   else {
  //     wx.showModal({
  //       title: '该功能需要授权',
  //       content: '请先在您的小程序列表中删除小程序，再重新搜索「聚会报名」并打开，即可重新授权。（我们只需要您的昵称，请放心授权）',
  //       showCancel: false,
  //       confirmText: '我知道了',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //         }
  //       }
  //     })
  //   }
  // }

})
