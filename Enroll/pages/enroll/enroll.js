const app = getApp();
const AV = require('../../libs/av-weapp-min');

Page({
  data:{
    userNum: 1,
    userNote: '',
    error: null,
    userNickname:'',
    userAvatar:'',
    userInfo: {},
    },

// 更新2个input框里的数据
  update_userNum: function ({
    detail: {value}
  }) {
    this.setData({
      userNum: value
    });
  },
  update_userNote: function ({
    detail: {value}
  }) {
    this.setData({
      userNote: value
    });
  },



// // 顶部的红色错误提示   
// showTopTips: function(msg){
//  var that = this;
//       this.setData({
//         errMsg:msg,
//           showTopTips: true
//       });
//       setTimeout(function(){
//           that.setData({
//               showTopTips: false
//           });
//       }, 3000);
// },

  onLoad: function (e) {




    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });

    that.setData({
      userNickname: userInfo.nickName,
      userAvatar:userInfo.avatarUrl,
      userID:AV.User.current(),
      })
    })

  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },


  onSubmit: function() {

    // 声明一个 Todo 类型
    var Members = AV.Object.extend('Members');
    // 新建一个 Todo 对象
    var members = new Members();
    members.set('userID',this.data.userID);
    members.set('meetingID', 1234);
    members.set('userNum', this.data.userNum);
    members.set('userNote', this.data.userNote);
    members.set('userNickname', this.data.userNickname);
    members.set('userAvatar', this.data.userAvatar);
    members.save().then( () => {
        wx.showToast({
          title: '报名成功',
          icon: 'success',
        });
        setTimeout(function(){
          wx.navigateTo({
          url: '../../pages/index/index'
          });
        }, 1200); 
     }, function (error) {
      // 异常处理
      console.error('Failed to create new object, with error message: ' + error.message);
    });



    // if (this.data.userNote) {
    //   new Object('Members').save({
    //     userID: User.current(),
    //     meetingID:1234,
    //     userNum: this.data.userNum,
    //     userNote: this.data.userNote,
    //     userNickname: userInfo.nickName,
    //     userAvatar: userInfo.avatarUrl,
    //   }).then( () => {
    //     wx.showToast({
    //       title: '报名成功',
    //       icon: 'success',
    //     });
    //     setTimeout(function(){
    //       wx.navigateBack();
    //     }, 2000); 
    //   }).catch(console.error);
    // } else {
    //   this.showTopTips('请输入备注');
    //   return false;
    // }


  }
});

