//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.removeStorageSync('code')
    wx.setStorageSync('loginStatus', 0);
    wx.setStorageSync('token', '123');
    this.login();
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  login:function(){
    var that = this;
    var token = wx.getStorageSync('token')
    console.log("启动Token：" + token)
    if (token){
      wx.login({
        success: function (res) {
          var code = res.code;
          console.log("启动Code：" + code)
          wx.setStorageSync('code', code);

          wx.request({
            method: "post",
            url: that.globalData.requestUrl + '?act=checkSession',
            data: {
              'token': token,
              'code': code
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.result) {
                wx.setStorageSync('token', res.data.data.token);
                wx.setStorageSync('username', res.data.data.username);
                wx.setStorageSync('loginStatus', 1);
                console.log("登录Token：" + code)
                console.log("登录Username：" + code)
              }
              else{
                wx.setStorageSync('token', "guest");
              }
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
        fail: function () {
          //resolve('login failed');
          wx.showToast({
            title: '登录失败！',
            duration: 2000
          });

          wx.setStorageSync('token', "guest");
        }
      });
    }
    else{
      wx.showToast({
        title: '未登录！',
        duration: 2000
      });
      wx.setStorageSync('token', 'guest');
    }
  },
  globalData: {
    userInfo: null,
    //requestUrl: 'https://www.drefore.cn/saleApple/mobile/wxapp/api.php',
    requestUrl: 'https://192.168.1.128/saleApple/mobile/wxapp/api.php',
    pageSize:10
  },
  getToken:function(){
    return wx.getStorageSync('token');
  },
  loginCheck: function () {
    var token = this.getToken();
    var loginStatus = wx.getStorageSync('loginStatus');

    if (token && token != 'guest' && loginStatus == 1) {
      return true;
    }

    return false
  }  
})
