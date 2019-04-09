  var ajaxUrl = require('../../utils/url.js');
var WxParse = require('../../plugins/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    imgUrls: [],
    sortindex:0, //规格参数tab
    curindex: 0, //属性分类
    num: 1,//购买数量初始值
    totalNum: 0,//已加入数量合计
    hasCarts: false,
    goodsId:0,//商品ID
    productId: 0,//产品ID
    show: false,
    scaleCart: false,
    content:'',
    price:'',
    attribute1CurrentIndex: [],
  },
  onLoad: function (options) {
    //生命周期函数--监听页面加载
    console.log(options)

    this.setData({
      goodsId: options.id,
      productId: options.productId?options.productId:0
    })

    this.fetchSortData();
    this.fetchData();
    //this.fetchSwiperData();
    //this.fetchData(options.viewUserId, options.suitId);

  },
  fetchSwiperData: function (imgArr) { //轮播
    this.setData({
      imgUrls: imgArr,
    }),
     
    wx.setNavigationBarTitle({  //导航栏文字修改
      title: this.data.content
    })
  },
  //商品详情
  fetchData: function () {
    wx.showLoading({
      title: '加载中',
    })

    var self = this;

    wx.request({
      method: "GET",
      url: app.globalData.requestUrl + "?act=getGoodsInfo",
      data: {
        "token": app.getToken(),
        "id": this.data.goodsId,
        "productId":this.data.productId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          console.log(res.data.data.gallery)
          //商品信息
          self.fetchGoodsInfoData(res.data.data)
          //图片滚动
          self.fetchSwiperData(res.data.data.gallery)
          //规格属性
          self.fetchAttributeData(res.data.data.property.spe, res.data.data.spec)
          //获取对应规格属性价格
          self.getSelectAttrGoodsPrice();
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
      complete:function(){
        wx.hideLoading()
      }      
    })
   
  },
  fetchGoodsInfoData: function (info) { //商品信息
    console.log(info)
    this.setData({
      content: info.base.goods_name,//商品名称
      price: info.base.shop_price,//商品价格
      goodProperty:info.property.pro//商品属性
    })

    WxParse.wxParse('desc', 'html', info.base.goods_desc, this, 5);
  },
  fetchAttributeData: function (attribute,spec) { //处理规格属性
    console.log(attribute)
    console.log(spec)
    var tmpAttributeIndex = [];

    if (spec.length > 0){
      for (var i = 0; i < spec.length; i++) {
        var id = spec[i]
        var flg = false

        for (var j = 0; j < attribute.length; j++) {
          for (var z = 0; z < attribute[j].values.length; z++) {
            if (attribute[j].values[z].id == id) {
              flg = true;
              tmpAttributeIndex[j] = z
              break;
            }
          }

          if (flg) {
            flg = false
            break;
          }
        }
      }
    }
    else{
      for (var i = 0; i < attribute.length; i++) {
        tmpAttributeIndex[i] = 0;
      }
    }

    this.setData({
      attribute1: attribute,
      attribute1CurrentIndex: tmpAttributeIndex
    })
  },
  fetchSortData: function () { //获取筛选条件
    this.setData({
      "sort": [
        {
          "id": 1,
          "title": "商品介绍"
        },
        {
          "id": 2,
          "title": "规格参数"
        },
      ]
    })
  },  
  //选择排序方式
  setSortBy: function (e) {
    var d = this.data;
    var dataset = e.currentTarget.dataset;
    this.setData({
      sortindex: dataset.sortindex,
      sortid: dataset.sortid
    })
    //WxParse.wxParse('desc', 'html', info.base.goods_desc, this, 5);
  },
  // 商品属性选择
  switchAttr: function (e) {
    var d = this.data;
    var dataset = e.currentTarget.dataset;
    // console.log(d)
    // console.log(dataset)
    var parindex = dataset.parindex;
    var chindex = dataset.chindex;
    console.log(parindex);
    console.log(chindex);


    var tmpAttribute1CurrentIndex = d.attribute1CurrentIndex;
    tmpAttribute1CurrentIndex[parindex] = chindex;

    console.log(tmpAttribute1CurrentIndex);

    this.setData({
      attribute1CurrentIndex: tmpAttribute1CurrentIndex,
      sortid: dataset.sortid
    })

    this.getSelectAttrGoodsPrice();
    // console.log('排序方式id：' + dataset.curindex);
  },
  // //选择排序方式
  // setSortBy: function (e) { 
  //   var d = this.data;
  //   var dataset = e.currentTarget.dataset;
  //   this.setData({
  //     sortindex: dataset.sortindex,
  //     sortid: dataset.sortid
  //   })
  // },

  //立即购买
  addShopCart(){
    //判断是否选择规格
    if ((this.data.attribute1.length > 0 && this.data.attribute1CurrentIndex.length == this.data.attribute1.length)
      || this.data.attribute1.length == 0) {
      wx.navigateTo({
        url: '../orders/orders'
      })
    }
    else {
      wx.showToast({
        title: '商品规格选择不正确！',
        duration: 2000
      });
    }
  },

  addToCart() {  //加入购物车
    const that = this;

    //判断是否选择规格
    if ((this.data.attribute1.length > 0 && this.data.attribute1CurrentIndex.length == this.data.attribute1.length)
      || this.data.attribute1.length == 0) {
      const num = this.data.num;
      let total = this.data.totalNum;

      wx.request({
        method: "POST",
        url: app.globalData.requestUrl + "?act=add_goods_cart",
        data: {
          "token": app.getToken(),
          "goodsId": this.data.goodsId,
          "spec": this.getSelectAttribute(),
          "num": this.data.num,
          "type": 1
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.result) {
            setTimeout(function () {
              that.setData({
                scaleCart: true
              })
              setTimeout(function () {
                that.setData({
                  scaleCart: false,
                  hasCarts: true,
                  totalNum: num + total
                })
              }, 200)
            }, 300)
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
          wx.hideLoading()
        }
      })
    }
    else {
      wx.showToast({
        title: '商品规格选择不正确！',
        duration: 2000
      });
    }
  },

  // 加减数量事件
  changeNum: function (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
      if (this.data.num <= 1) {
        num: 1
      } else {
        this.setData({
          num: this.data.num - 1
        })
      };
    } else {
      this.setData({
        num: this.data.num + 1
      })
    };
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  //获得已选属性
  getSelectAttribute:function(){
    var attrArr = new Array()

    for (var i = 0; i < this.data.attribute1CurrentIndex.length;i++){
      var index = this.data.attribute1CurrentIndex[i];

      for (var j = 0; j < this.data.attribute1[i].values.length;j++){
        if(j==index){
          attrArr[i] = this.data.attribute1[i].values[j].id;
          break;
        }
      }
    }

    return attrArr;
  },
  getSelectAttrGoodsPrice:function(){
    var that = this;
    wx.request({
      method: "POST",
      url: app.globalData.requestUrl + "?act=getGoodsPrice",
      data: {
        "token": app.getToken(),
        "goodsId": this.data.goodsId,
        "spec": this.getSelectAttribute(),
        "num": 1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.result) {
          that.setData({
            price: res.data.data.shop_price,//商品价格
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
        wx.hideLoading()
      }
    })
  }
})