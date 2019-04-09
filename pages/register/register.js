var app = getApp();
//倒计时
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })

    if(countdown == 60){
      wx.request({
        method: "POST",
        url: app.globalData.requestUrl + "?act=sendCode",
        data: {
          "username": that.data.user.phone,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.data.result) {
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
        }
      }) 
    }

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }
    , 1000)
}
Page({
  data:{
    user: {
      phone: '',
      password: '',
      confirm: '',
      verification:''
    },
    last_time:'',
    is_show:true
  },
  formSubmit: function (e) {
    if (this.formValidate(e)){
      wx.showLoading({
        title: '加载中',
      })

      var self = this;
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.setStorageSync('code', code);

          wx.request({
            method: "POST",
            url: app.globalData.requestUrl + "?act=reg",
            data: {
              "code": code,
              "username": self.data.user.phone,
              "password": self.data.user.password,
              "validateCode": self.data.user.verification
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

                wx.switchTab({
                  url: '../index/index'
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
        },
        fail: function () {
          //resolve('login failed');
          wx.showToast({
            title: '登录失败！',
            duration: 2000
          });
        }
      });   
    }

    return true;
  },
  formValidate: function (e) {
    var mobile = e.detail.value.mobile;
    var password = e.detail.value.password;
    var confirm = e.detail.value.confirm;
    var code = e.detail.value.verification;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; //手机号验证
    var passReg = /^.{6,}$/;

    if (mobile.length != 11 && !myreg.test(mobile)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: '',
        duration: 1500
      })
      return false;
    } 
    
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

    if (code.length === 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: '',
        duration: 1500
      })
      return false;
    } 

    return true;    
  },
  bindPhone: function (e) {
    this.setData({
      'user.phone': e.detail.value
    });
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
  bindVerification: function (e) {
    this.setData({
      'user.verification': e.detail.value
    })
  },  
  // 获取验证码
  bindGetVerification:function(){
    var that = this;
    that.setData({
      is_show: (!that.data.is_show)   //false
    })
    settime(that);
  }
})

