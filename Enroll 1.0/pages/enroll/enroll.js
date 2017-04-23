const AV = require('../../libs/av-weapp-min');

Page({
  data:{
    userNum: 0,
    userNote: '',
    campaignId: ''
  },

  // 更新2个input框里的数据
  updateUserNum: function (e) {
    this.setData({
      userNum: parseInt(e.detail.value, 10)
    });
  },
  updateUserNote: function (e) {
    this.setData({
      userNote: e.detail.value
    });
  },

  onLoad: function (options) {
    this.setData({
      campaignId: options.campaignId
    })

  },

  onSubmit: function() {

    // 将报名信息存入Enroll表
    var campaign = AV.Object.createWithoutData('Campaign', this.data.campaignId);
    var user = AV.User.current();
    var newEnroll = new AV.Object('Enroll');
    // 设置关联
    newEnroll.set('campaign', campaign);
    newEnroll.set('user', user);
    // 其他报名字段
    newEnroll.set('number', this.data.userNum);
    newEnroll.set('note', this.data.userNote);
    newEnroll.set('isEnroll', 1);
    newEnroll.save().then(function(newEnroll){
      wx.redirectTo({url: '../../pages/success/success?campaignId='+campaign.id});
    }, function(error){
      var that = this;
      console.error('Failed to create enroll, with error message: ' + error.message);
      if (error.message.indexOf('unique') > 0) {
        wx.showModal({title: '提示',
                      content: '您已经成功报名本次活动，请勿重复报名！',
                      showCancel: false,
                      success: function(res) {
                        if (res.confirm) {
                          wx.redirectTo({url: '../../pages/info/info?campaignId='+campaign.id})
                        }
                      }
        });
      }
    });
      
  }

});