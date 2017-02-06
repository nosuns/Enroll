// pages/userlist/userlist.js
var app = getApp()

Page({
  data: {
    userNote: '',
    meetingID: '1234',
    userNum: '',
    userID: '',

    userInfo: {}
  },

  onLoad: function(options) {
    if (options && options.id) {
      new Query('userList').get(options.id).then( booklist => {
        this.setData({
          objectId: booklist.id,
          title: booklist.get('title'),
          books: booklist.get('books')
        });
      }).catch(console.error);
    };


    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
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
  }
})