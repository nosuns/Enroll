const {Object, User, Query} = require('../../libs/leancloud-storage');
const AV = require('../../libs/av-weapp-min');

// pages/userlist/userlist.js
var app = getApp();
var meetingID = 1234;

Page({
  data: {
    members:{ },
    userinfo:[],
    uid:'587c67fe1b69e6006bf31ff9',
  },



  onReady: function() {
    new AV.Query('Members')
      .equalTo('meetingID',meetingID)
      .descending('createdAt')
      .find()
      .then(members => {
        this.setData({ members });
         
        // new AV.Query('_User')
        //   .equalTo('objectId','0CN587d8e5a128fe1006b095143')
        //   .find()
        //   .then(userinfo => {
        //     this.setData({ userinfo });
        //   })
        //   .catch(console.error);

      })
      .catch(console.error);

    // var GuangDong = AV.Object.createWithoutData('objectId', '587c67fe1b69e6006bf31ff9');
    // var query = new AV.Query('_User');
    // query.equalTo('dependent', GuangDong);
    // query.find().then(function (userinfo) {
    //     userinfo.forEach(function (nickName, avatarUrl) {
    //         console.log(city.id);
    //     });
    // });

  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
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