//index.js
//获取应用实例
var app = getApp()

var ajaxUrl = require('../../utils/url.js');
Page({
  data: {
    indexmenu: [],
    reservelist: [],
    servicelist: [],
    scrolltop: null, //滚动位置
    page: 1 , //分页
    postsList: [

    ],//商品列表
    requestFlg: false
  },
  onLoad: function () {
    this.fetchData();
  // this.fetchServiceData();
    this.fetchGoodsListDate();
   
  
  },
  //icon
  fetchData: function () {
    this.setData({
      indexmenu: [
        {
          'icon': './../../images/icon-company.png',
          'text': '公司简介',
          'url': 'company-profile'
        },
        {
          'icon': './../../images/phone.png',
          'text': '联系方式',
          'url': 'contact-us'
        },
        {
          'icon': './../../images/tree.png',
          'text': '果树认领',
          'url': 'logistics'
        },
        {
          'icon': './../../images/icon-classes.png',
          'text': '商品分类',
          'url': 'classes'
        }
      ]
    })
  },
  changeRoute: function (url) {
    wx.navigateTo({
      url: `../${url}/${url}`
    })
  },
  redictDetail: function (e) {  //跳转至详情页
    var id = e.currentTarget.dataset.goodsid;
    var link = "../goods/goods?id=" + id
    wx.navigateTo({
      url: link
    })
  },

  fetchGoodsListDate: function (data) { //商品列表ajax
    wx.showToast({
       title: '加载中',
      icon: 'loading'
    })
      var self = this;
      wx.request({
        method: "GET",
        url: app.globalData.requestUrl + "?act=getGoods",
        data: {
          "type": 'new',
          "token": app.getToken(),
          'page': this.data.page,
          "pageSize": 10
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.result) {
            if (res.data.data.length == 0) {
              self.setData({
                page: self.data.page - 1
              });
            }

            for (var i in res.data.data) {
              self.data.postsList.push({
                imgUrl: res.data.data[i].thumb,
                content: res.data.data[i].name,
                price: "$" + res.data.data[i].final_price,
                account: res.data.data[i].sell_count,
                tag: "立即订购",
                id: res.data.data[i].id
              });
            }
          }
          else{
            wx.showToast({
              title: '报错',
              icon: 'loading'
            })
          }

          self.setData({
            postsList: self.data.postsList
          })

          self.setData({
            requestFlg: false
          })

          setTimeout(function () {
            self.setData({
              hidden: true
            });
          }, 300);
        },
        fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });

          wx.setStorageSync('token', "guest");
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
      this.fetchGoodsListDate()
    }
  },
  /*onPullDownRefresh: function () { //下拉刷新
    this.setData({
      page: 0,
      postList: []
    })
    fetchGoodsListDate
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },*/
    
  onPullDownRefresh: function () {
    //页面相关事件处理函数--监听用户下拉动作
    console.log('onPullDownRefresh');
  },
  onReachBottom: function () {
    //页面上拉触底事件的处理函数
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    console.log('onReachBottom');
  },
   
})
