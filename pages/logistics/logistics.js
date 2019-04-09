var app = getApp();
Page({
  data: {
    sortindex: 0,
    page: 1, //分页
    orders:[],
    requestFlg: false,
    hasList: true                                                                       
  },
  onLoad: function () {
    //生命周期函数--监听页面加载
    this.fetchSortData();
4
  },
  onShow:function(){
    this.fetchOrderListData();
  },
  fetchSortData: function () { //获取筛选条件
    this.setData({
      "list": [
        {
          "id": 0,
          "title": "全部订单"
        },
        {
          "id": 1,
          "title": "待付款"
        },
        {
          "id": 2,
          "title": "待收货"
        },
      ]
    })
  },
  setSortBy: function (e) { //选择排序方式
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      orders:[],
      sortindex: dataset.sortindex,
      sortid: dataset.sortid,
      page:1
    })
    this.fetchOrderListData();
    console.log('排序方式id：' + this.data.sortid);
  },
  //订单详情
  bindDetail:function(){
    wx.navigateTo({
      url: '../order-detail/order-detail',
    })
  },
  fetchOrderListData: function () { //订单列表ajax
    var self = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })

    wx.request({
      method: "POST",
      url: app.globalData.requestUrl + "?act=getUserOrders",
      data: {
        "token": app.getToken(),
        'page': this.data.page,
        "pageSize": 10,
        "type": this.data.sortindex        
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },      
      success: function (res) {
        if (res.data.result) {
          console.log(res.data.data.orders);
          if (res.data.data.length == 0 && self.data.page == 1) {
            self.setData({
              page: self.data.page - 1,
              hasList: false
            });
          }
        }

        for (var i in res.data.data) {
          self.data.orders.push(res.data.data[i]);
        }

        self.setData({
          orders: self.data.orders,
          requestFlg: false
        })

        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);
      }
    })

  },
  //商品列表滚动
  lower: function (e) {
    if (this.data.requestFlg) {
      return;
    }
    else {
      this.data.requestFlg = true;
      this.setData({
        page: this.data.page + 1
      });
      this.fetchOrderListData()
    }
  },  
})