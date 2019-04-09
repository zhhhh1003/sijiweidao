// page/component/new-pages/cart/cart.js
var app = getApp();
Page({
  data: {
    carts: [],               // 购物车列表
    hasList: true,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true    // 全选状态，默认全选
  },
  onShow() {
    wx.removeStorageSync('selCarts')
    this.getCartInfo();
  },
  getCartInfo:function(){
    wx.showLoading({
      title: '加载中',
    })

    var that = this;

    wx.request({
      method: "GET",
      url: app.globalData.requestUrl + "?act=getCart2",
      data: {
        "token": app.getToken()
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          if (res.data.data.goods_list.length > 0){
            that.setData({
              hasList: true,
              carts: res.data.data.goods_list,
              totalPrice: res.data.data.total
            });

            var selCarts = new Array();

            for (var i = 0; i < that.data.carts.length; i++) {
              var cart = that.data.carts[i]

              if (cart.selected) {
                selCarts.push(cart.rec_id)
              }
            }

            wx.setStorageSync('selCarts', selCarts);
          }
          else{
            wx.showToast({
              title: res.data.data.err_msg,
              duration: 2000,
              complete: function () {
                that.setData({
                  hasList: false
                });
              }
            });
          }
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
          complete:function(){
            that.setData({
              hasList: false
            });   
          }
        });     
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });
    if (!carts.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addGoods(e) {
    var that = this;

    wx.request({
      method: "POST",
      url: app.globalData.requestUrl + "?act=add_goods_cart",
      data: {
        "token": app.getToken(),
        "goodsId": e.currentTarget.dataset.goodsId,
        "productId": e.currentTarget.dataset.productId,
        "type":2
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.result) {
          if (res.data.data.goods_list.length > 0) {
            that.setData({
              hasList: true,
              carts: res.data.data.goods_list,
              totalPrice: res.data.data.total
            });

            var selCarts = new Array();

            for (var i = 0; i < that.data.carts.length; i++) {
              var cart = that.data.carts[i]

              if (cart.selected) {
                selCarts.push(cart.rec_id)
              }
            }

            wx.setStorageSync('selCarts', selCarts);

          }
          else{
            
          }
        }
        else {
          wx.showToast({
            title: res.data.data.err_msg,
            duration: 2000,
            complete: function () {
            }
          });
        }        
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
          complete: function () {
            that.setData({
              hasList: false
            });
          }
        });
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 绑定减数量事件
   */
  deleteGoods(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var action = e.currentTarget.dataset.type;

    if (action == 'one' && this.data.carts[index].goods_number == 1){
      return false;
    }

    wx.request({
      method: "POST",
      url: app.globalData.requestUrl + "?act=remove_goods_cart",
      data: {
        "token": app.getToken(),
        "id": e.currentTarget.dataset.id,
        "type": action
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.result) {
          if (res.data.data.goods_list.length > 0) {
            that.setData({
              hasList: true,
              carts: res.data.data.goods_list,
              totalPrice: res.data.data.total
            });

            var selCarts = new Array();

            for (var i = 0; i < that.data.carts.length; i++) {
              var cart = that.data.carts[i]

              if (cart.selected) {
                selCarts.push(cart.rec_id)
              }
            }

            wx.setStorageSync('selCarts', selCarts);
          }
          else {
            wx.showToast({
              title: res.data.data.err_msg,
              duration: 2000,
              complete: function () {
                that.setData({
                  hasList: false
                });
              }
            });
          }
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
          complete: function () {
            that.setData({
              hasList: false
            });
          }
        });
      },
      complete: function () {
        wx.hideLoading()
      }
    })

  },
  redictDetail:function(e){
    var goodsId = e.currentTarget.dataset.goodsId;
    var productId = e.currentTarget.dataset.productId;
    var link = "../goods/goods?id=" + goodsId + "&productId=" + productId
    wx.navigateTo({
      url: link
    })
  },
  getTotalPrice:function(){
    var selCarts = new Array();
    var totalPrice = 0;
    wx.removeStorageSync('selCarts')

    for (var i =0;i<this.data.carts.length;i++){
      var cart = this.data.carts[i]

      if (cart.selected){
        selCarts.push(cart.rec_id)
        totalPrice += cart.goods_price * cart.goods_number;
      }
    }

    wx.setStorageSync('selCarts', selCarts);

    this.setData({
      totalPrice: totalPrice
    });
  },
  //结算
  btnPay:function(){
    if(this.data.totalPrice > 0){
      wx.navigateTo({
        url: '../orders/orders',
      })
    }
    else{
      wx.showToast({
        title: '请选择商品！',
        duration: 2000
      });
    }
  }
})