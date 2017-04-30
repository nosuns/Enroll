// pages/info/description.js
Page({
  data:{
    description:''
    },
  onLoad:function(options){
    var that = this;

    wx.getStorage({
      key: 'description',
      success: function(res) {
        that.setData({
          description: res.data
        })
      } 
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