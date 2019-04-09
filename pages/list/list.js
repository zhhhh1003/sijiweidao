//index.js
//获取应用实例
var app = getApp()

var ajaxUrl = require('../../utils/url.js');
var app = getApp()
Page({
  data: {
    page: 1, //分页
    postsList: [
    ],//商品列表
    hasList: true, 
    fromType:"",//来源
    cateId:0,//分类ID
    requestFlg:false
  },
  onLoad: function (options) {
    this.data.fromType = options.type;
    if (this.data.fromType == 'category'){
      this.data.cateId = options.id
    }

    this.fetchGoodsListDate();
    
  },
  changeRoute: function (url) {
    wx.navigateTo({
      url: `../${url}/${url}`
    })
  },

  redictDetail: function (e) {  //跳转至详情页
    var id = e.currentTarget.dataset.goodsid;
    console.log(id)
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
    var url = "";
    var data = {};
    if (this.data.fromType == 'category') {
      url = app.globalData.requestUrl + "?act=getCategoryGoods"
      data = {
        "id": this.data.cateId,
        "token": '123',
        'page': this.data.page,
        "pageSize": 10
      }
    }

    wx.request({
      method: "GET",
      url: url,
      data: data,
      success: function (res) {
        //console.log(res.data.goods)
        if (res.data.result) {
          console.log(res.data.data.goods);
          if (res.data.data.goods.length == 0 && self.data.page == 1){
            self.setData({
              page: self.data.page - 1,
              hasList: false
            });
          }
          
          for (var i in res.data.data.goods) {
            self.data.postsList.push({
              imgUrl: res.data.data.goods[i].thumb,
              content: res.data.data.goods[i].name,
              price: "$" + res.data.data.goods[i].shop_price,
              account: res.data.data.goods[i].sell_count,
              tag: "立即订购",
              id: res.data.data.goods[i].id
            }); 
          }
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
      }
    })

  },
  //商品列表滚动
  lower: function (e) {
    if (this.data.requestFlg){
      return;
    }
    else{
      this.data.requestFlg = true;
      this.setData({
        page: this.data.page + 1
      });
      this.fetchGoodsListDate()
    }

    console.log(this.data.page);

  },
  /*onPullDownRefresh: function () { //下拉刷新
    console.log(this.data.page);
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
    // console.log('onReachBottom');
  },

})
