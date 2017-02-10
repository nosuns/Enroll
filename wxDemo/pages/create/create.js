Page({
  data: {
      showTopTips: false,

      radioItems: [
          {name: 'cell standard', value: '0'},
          {name: 'cell standard', value: '1', checked: true}
      ],
      checkboxItems: [
          {name: 'standard is dealt for u.', value: '0', checked: true},
          {name: 'standard is dealicient for u.', value: '1'}
      ],

      date: "2016-09-01",
      time: "12:01",


      isAgree: false
  },

  bindDateChange: function (e) {
      this.setData({
          date: e.detail.value
      })
  },
  bindTimeChange: function (e) {
      this.setData({
          time: e.detail.value
      })
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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