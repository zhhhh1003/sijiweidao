var app = getApp();
//倒计时
Page({
  data: {
    user: {
      password: '',
      confirm: '',
    },
  },
  formSubmit: function (e) {
    if (this.formValidate(e)) {
      wx.showLoading({
        title: '加载中',
      })

      var self = this;
      var code = wx.getStorageSync('code')
      wx.request({
        method: "POST",
        url: app.globalData.requestUrl + "?act=reg",
        data: {
          "password": self.data.user.password,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.data.result) {
            wx.setStorageSync('token', res.data.data.token);
            wx.setStorageSync('username', res.data.data.username);
            wx.setStorageSync('loginStatus', 1);

           wx.navigateTo({
             url: '../login/login',
           })
          }
          else {
            wx.showToast({
              title: res.data.data.err_msg,
              duration: 2000
            });
          }
        },
        fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
        complete: function () {
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }
      })
    }

    return true;
  },
  formValidate: function (e) {
    var password = e.detail.value.password;
    var confirm = e.detail.value.confirm;
    var passReg = /^.{6,}$/;

    if (!passReg.test(password)) {
      wx.showToast({
        title: '密码不可少于6位',
        icon: 'success',
        duration: 1500
      })
      return false;
    }

    if (password != confirm) {
      wx.showToast({
        title: '两次密码不同',
        icon: 'success',
        duration: 1500
      })
      return false;
    }

    return true;
  },
  bindPassword: function (e) {
    this.setData({
      'user.password': e.detail.value
    })
  },
  bindConfirm: function (e) {
    this.setData({
      'user.confirm': e.detail.value
    })
  },
})

