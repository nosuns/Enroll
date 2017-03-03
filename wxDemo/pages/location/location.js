var bmap = require('../../libs/bmap-wx.js');

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        activeAddress: []
    },

    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },

    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });

        var that = this;

        // 新建百度地图对象 
        var BMap = new bmap.BMapWX({ 
            ak: 'ntQQvConZD2oSe4hXE2lfrwNetggT2Ih' 
        }); 
        
        // 发起suggestion检索请求 
        BMap.suggestion({ 
            query: e.detail.value, 
            region: '全国', 
            success: function (res) {
                console.log(res);
                that.setData({
                    activeAddress: res.result
                });
            } 
        }); 
    },

    chooseAddress: function (e) {
        var that = this;
        var index = e.currentTarget.id;
        console.log(index);
        var name = that.data.activeAddress[index].name;
        var lat = that.data.activeAddress[index].location.lat;
        var lng = that.data.activeAddress[index].location.lng;
        var address = {'name': name, 'lat': lat, 'lng': lng};

        // 将选择的地点信息存入缓存中供创建页面调用
        wx.setStorageSync('address', address);
        // 返回创建活动页面
        wx.navigateBack({
            delta: 1
        })
    }

});