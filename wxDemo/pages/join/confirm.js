const {Object, User, Query} = require('../../libs/leancloud-storage');
var app = getApp()

// pages/join/confirm.js
Page({
  data:{
    userNum: 1,
    userNote: '',
    error: null,
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

// 顶部的红色错误提示   
showTopTips: function(msg){
 var that = this;
      this.setData({
        errMsg:msg,
          showTopTips: true
      });
      setTimeout(function(){
          that.setData({
              showTopTips: false
          });
      }, 3000);
},

  onLoad: function () {
    console.log('onLoad')
        this.setData({
      authur: User.current()
    });
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
    if (this.data.userNote) {
      new Object('userList').save({
        userID: User.current(),
        meetingID:1234,
        userNum: this.data.userNum,
        userNote: this.data.userNote,
      }).then( () => {
        wx.showToast({
          title: '报名成功',
          icon: 'success',
        });
        setTimeout(function(){
          wx.navigateBack();
        }, 2000); 
      }).catch(console.error);
    } else {
      this.showTopTips('请输入备注');
      return false;
    }
  }
});


//  onSubmit: function() {
//  if(this.data.userNote === '') {
//       this.showTopTips('请输入备注');
//       return false;
//   }
//   else{
//       new Object('userList').save({
//         userNum: this.data.userNum,
//         userNote: this.data.userNote,
//         user: User.current()
//       }).then( () => {
//       wx.showToast({
//         title: '报名成功',
//         icon: 'success',
//       });
//       setTimeout(function(){
//         wx.navigateBack();
//       }, 2000);     

//     }, function (error) {
//       // 异常处理
//       console.log(error);
//     });

    
//   }
// }

// })