// page/component/new-pages/user/address/address.js
var app = getApp()
var ajaxUrl = require('../../utils/url.js');

Page({
  data: {
    address: {
      name: '',
      phone: '',
      detail: '',
     
    },
    region: []
  },
  onLoad() {
    var self = this;
    this.addressList();
    // wx.getStorage({
    //   key: 'region',
    //   success: function (res) {
    //     self.setData({
    //     region: res.data,
         
    //     })
    //   }
    // }),
    //   wx.getStorage({
    //     key: 'address',
    //     success: function (res) {
    //       self.setData({
    //       address: res.data,

    //       })
    //     }
    //   })

  },
  formSubmit() {
    var self = this;
    if (self.data.address.consignee && self.data.address.mobile && self.data.address.address&&self.data.region) {
      // wx.setStorage({
      //   key: 'region',
      //   data: self.data.region ,
  
      // });
      // wx.setStorage({
      //    key: 'address',
      //    data: self.data.address,
       
      //   });
      // wx.navigateBack();
    

      wx.request({
       
        method: "GET",
        data: {
          "token": app.getToken(),      
          "name": self.data.address.consignee,
          "tel": self.data.address.mobile,
          "adr": self.data.address.address,
          "region0": self.data.region[0],
          "region1": self.data.region[1],
          "region2": self.data.region[2],

        },
        url: app.globalData.requestUrl + "?act=address_list_edit",
        success: function (res) {
          if (res.data.result) {

            wx.showModal({
              title: '提示',
              content: '保存成功',
              showCancel: false
            })

          } else {
            wx.showModal({
              title: 'ERROR',
              content: '操作失败',
              showCancel: false
            })
          }
        }
      })
 
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }

 
  },
  addressList: function () {  
    var self = this;
      wx.request({
        method: "GET",
        data: {        
          "token": app.getToken(),             
        },
        url: app.globalData.requestUrl + "?act=address_list",
        success: function (res) {
          if (res.data.result) {
              self.setData({
                address: res.data.address,
                region: res.data.data,
             })
          }else{

          }
        }
      })
  },

  //省市区选择
  bindRegion: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindName(e) {
    this.setData({
      'address.consignee': e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      'address.mobile': e.detail.value
    })
  },
  bindDetail(e) {
    this.setData({
      'address.address': e.detail.value
    })
  },

 
})
