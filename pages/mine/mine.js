var app = getApp()
Page({
  data: {
    hasAccount:false,//是否拥有账户
    userInfo: {},//微信用户信息
    account:'',//商城账号
    menu:[]
  },

  onLoad: function () {
    console.log('onLoad')
  },
  onShow:function(){
    this.login();
  },
  login:function(){
    var that = this
    if (app.loginCheck()) {
      this.setData({
        hasAccount: true,
        account: wx.getStorageSync('username'),
        menu: [
          '../address/address',
          '../logistics/logistics',
          '../logistics/logistics',
          '../logistics/logistics'
        ]
      })

      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
    else {
      this.setData({
        menu: [
          '../login/login',
          '../login/login',
          '../login/login',
          '../login/login',
        ]
      })
    }
  },
  //登录
  bindLogin:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  bindAddressMng:function(){
    // wx.chooseAddress({
    //   success: function (res) {
    //     console.log(JSON.stringify(res))
    //   },
    //   fail: function (err) {
    //     console.log(JSON.stringify(err))
    //   }
    // })

    if(this.loginCheck()){
      wx.navigateTo({
        url: '../address/address',
      })
    }
  }
})
