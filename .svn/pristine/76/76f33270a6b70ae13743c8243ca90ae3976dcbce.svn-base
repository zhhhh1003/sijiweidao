// page/component/orders/orders.js
var app = getApp();
Page({
  data: {
    address: {},
    region: [],
    hasAddress: false,
    amount: 0,//商品总金额
    shipping_fee:0,//运费
    total_price:0,//实际支付金额
    goods: []
  },

  onReady() {
  },

  onShow: function () {
    var that = this;
    wx.request({
      method: "POST",
      url: app.globalData.requestUrl + "?act=flow&step=checkout",
      data: {
        "token": app.getToken(),
        "rids": wx.getStorageSync('selCarts')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.result) {
          if (res.data.data.goods.length > 0) {
            that.setData({
              goods: res.data.data.goods,
            });
          }

          //地址相关
          if (!res.data.data.address){
            that.setData({
              hasAddress: false
            });
          }
          else{
            that.setData({
              address: res.data.data.address,
              hasAddress:true
            });
          }

          //金额相关
          that.setData({
            amount: res.data.data.fee.amount,
            shipping_fee: res.data.data.fee.shipping_fee,
            total_price: res.data.data.fee.total_price,
          });
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

    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    }),
      wx.getStorage({
        key: 'region',
        success(res) {
          self.setData({
            region: res.data,
            hasAddress: true
          })
        }
      })
  },
  //微信支付
  btnPay:function() {
    var that = this;
    //是否填写地址
    if (!this.data.hasAddress){
      wx.showToast({
        title: '请填写收货地址！',
        duration: 2000
      });
      return;
    }

    wx.showModal({
      title: '提示',
      content: '是否付款',
      success:function(res){
        if (res.confirm) {
          console.log('开始付款........')
          wx.login({
            success: function (res) {
              var code = res.code;
              console.log("启动Code：" + code)
              //wx.setStorageSync('code', code);

              wx.request({
                method: "post",
                url: app.globalData.requestUrl + '?act=flow&step=submit',
                data: {
                  'token': app.getToken(),
                  'code': code,
                  "rids": wx.getStorageSync('selCarts')
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res)
                  if (res.data.nonceStr && res.data.package && res.data.paySign
                    && res.data.timeStamp){
                    wx.requestPayment({
                      timeStamp: res.data.timeStamp,
                      nonceStr: res.data.nonceStr,
                      package: res.data.package,
                      signType:'MD5',
                      paySign: res.data.paySign,
                      success:function(res){
                        console.log(res)
                      },
                      fail:function(res){
                        console.log(res)
                      }
                    })
                  }
                },
                fail: function () {
                  // fail
                  wx.showToast({
                    title: '支付异常',
                    duration: 2000
                  });
                }
              })
            },
            fail: function () {
              wx.showToast({
                title: '支付异常',
                duration: 2000
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})