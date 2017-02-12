const AV = require('../../libs/av-weapp-min');

Page({
  data:{
    userNum: 1,
    userNote: ''
    },

  // 更新2个input框里的数据
  updateUserNum: function ({
    detail: {value}
  }) {
    this.setData({
      userNum: value
    });
  },
  updateUserNote: function ({
    detail: {value}
  }) {
    this.setData({
      userNote: value
    });
  },

  onLoad: function (e) {

  },

  onSubmit: function() {

    // 将报名信息存入Enroll表
    var campaign = new AV.Object('Campaign');
    campaign.set('name', '八达自驾第一期');
    campaign.set('description', '关于这一期自驾游的详细描述信息');
    campaign.set('location', '拈花湾');

    var user = AV.User.current();

    var enroll = new AV.Object('Enroll');
    // 设置关联
    enroll.set('campaign', campaign);
    enroll.set('user', user);

    // 其他报名字段
    enroll.set('number', this.data.userNum);
    enroll.set('note', this.data.userNote);
    enroll.set('isEnroll', 1);
    enroll.save().then(function(enroll){
      wx.navigateTo({url: '../../pages/success/success'});
    }, function(error){
      console.error('Failed to create enroll, with error message: ' + error.message);
    });

  }
});

