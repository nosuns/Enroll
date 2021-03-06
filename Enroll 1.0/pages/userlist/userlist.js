const AV = require('../../libs/av-weapp-min');

Page({
  data: {
    enrollList: [],
    sum: 0,
    count: 0,
    campaignId: '',
    scrollHeight: 0,
  },

  onLoad: function(options) {
    this.setData({
      campaignId: options.campaignId
    })
    var that = this;
    // 获取屏幕高度、scrollHeight
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 144 * res.windowWidth / 750,
        });
      }
    });
  },

  onReady: function() {
    var that = this;
    // 获取当前的活动
    var currentCampaign = AV.Object.createWithoutData('Campaign', this.data.campaignId);
    // 查询该活动下所有已报名的人员
    var campaignQuery = new AV.Query('Enroll');
    campaignQuery.equalTo('campaign', currentCampaign);
    var isEnrollQuery = new AV.Query('Enroll');
    isEnrollQuery.equalTo('isEnroll', 1);
    var query = AV.Query.and(campaignQuery, isEnrollQuery);
    query.include('user');
    query.find().then(function(enrollList) {
      var tempList = [];
      var totalNumber = 0;

      // 遍历每一条报名信息，查出用户信息
      enrollList.forEach(function(enroll, i, a){

        // 4.29匿名处理
        var nickName = enroll.get('user').get('nickName');
        var avatarUrl = enroll.get('user').get('avatarUrl');
        if (nickName == null){
          nickName = "匿名";
          avatarUrl = "../../img/anonymous.png";
        }

        tempList[i] = {'objectId': enroll.get('objectId'),
                       'nickName': nickName,
                       'avatarUrl': avatarUrl,
                       'number': enroll.get('number'),
                       'note': enroll.get('note')}
        totalNumber = totalNumber + enroll.get('number');
      });

      that.setData({enrollList: tempList, 
                    sum: totalNumber, 
                    count: tempList.length});
    }).catch(console.error);

  },

})