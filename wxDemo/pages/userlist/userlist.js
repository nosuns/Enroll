const AV = require('../../libs/av-weapp-min');
var tempList = [];
var totalNumber = 0;
var groupNumber = 0;

Page({
  data: {
    enrollList: [],
    sum: 0,
    count: 0,
  },

  onReady: function() {
    // new AV.Query('Members')
    //   .equalTo('meetingID',meetingID)
    //   .descending('createdAt')
    //   .find()
    //   .then(members => {
    //     this.setData({ members });
    //   }).catch(console.error);
    
    var that = this;
    // 获取当前的活动
    var currentCampaign = AV.Object.createWithoutData('Campaign', '58a048fe8d6d81006c99a5d6');
    // 查询该活动下所有已报名的人员
    var campaignQuery = new AV.Query('Enroll');
    campaignQuery.equalTo('campaign', currentCampaign);
    var isEnrollQuery = new AV.Query('Enroll');
    isEnrollQuery.equalTo('isEnroll', 1);
    var query = AV.Query.and(campaignQuery, isEnrollQuery);
    query.include('user');
    query.find().then(function(enrollList) {
      // 遍历每一条报名信息，查出用户信息
      enrollList.forEach(function(enroll, i, a){
        tempList[i] = {'objectId': enroll.get('objectId'),
                       'nickName': enroll.get('user').get('nickName'),
                       'avatarUrl': enroll.get('user').get('avatarUrl'),
                       'number': enroll.get('number'),
                       'note': enroll.get('note')}
        totalNumber = totalNumber + enroll.get('number');
        groupNumber = groupNumber + 1;
      });

      that.setData({enrollList: tempList, 
                    sum: parseInt(totalNumber, 10), 
                    count: groupNumber});
    }).catch(console.error);

  },

  onLoad: function() {
    // 页面加载
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})