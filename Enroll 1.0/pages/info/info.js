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
    isEnroll: 1,
    moreDescription: 0,
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

      // 判断活动介绍的文字长度
      var description = campaign.get('description');
      var desLineLimit = 100;  
      var info = '';
      try {
        var res = wx.getSystemInfoSync()

        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)

        desLineLimit = (res.windowWidth - 30)/15 * 4 

        console.log(desLineLimit)

      } catch (e) {
        // Do something when catch error
      }
      if(description.length > (desLineLimit) ) {
        info = description.substring(0,desLineLimit-8)
        wx.setStorage({
          key:"description",
          data:description
        })
        that.setData({
          moreDescription: 1
        })
      }else{
        info = description
      }

      // 4.29匿名处理
      var nickName = campaign.get('createdBy').get('nickName');
      var avatarUrl = campaign.get('createdBy').get('avatarUrl');
      if (nickName == null){
        nickName = "匿名";
        avatarUrl = "../../img/anonymous.png";
      }

      // 赋值其他活动信息
      that.setData({
        title: campaign.get('name'),
        info: info,
        // info: campaign.get('description'),
        createdBy: nickName,
        avatarUrl: avatarUrl,
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
  },
  
  toIndex:function(){
      try {
        var res = wx.getSystemInfoSync()
      } catch (e) {
        // Do something when catch error
      }

    if (wx.canIUse('reLaunch') && res.platform == 'ios'){
      wx.reLaunch({
        url: '../index/index'
      });
    } else{
      wx.redirectTo({
        url: '../index/index',
      });
    }
  },

  enroll: function(){
      wx.navigateTo({
      url: '../enroll/enroll?campaignId='+this.data.campaignId
    });   
  }

  // enroll: function(){
  //   var that = this;
  //   if (typeof(user.get('nickName')) != "undefined") {
  //     wx.navigateTo({
  //       url: '../enroll/enroll?campaignId='+that.data.campaignId
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