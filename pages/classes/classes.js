var app = getApp()
Page({
  data: {
    sortindex: 0,
    isScroll: false,
  },
  onLoad:function(){
    var self = this;

    wx.request({
      method: "GET",
      url: app.globalData.requestUrl + "?act=getCategories",
      data: {
        "token": '123',
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          console.log(res.data.data.cate1)
          console.log(res.data.data.cate2)
          self.setData({
            list: res.data.data.cate1,
            cate1: res.data.data.cate2
          })
        }
      }
    })
  },
  onReady() {
    var self = this;
  },

  //tab切换
  setSortBy: function (e) { //选择排序方式
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex: dataset.sortindex,
      sortid: dataset.sortid
    })
    console.log('排序方式id：' + this.data.sortid);
  },

})