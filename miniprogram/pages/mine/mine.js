// pages/mine/mine.js
const db = wx.cloud.database()
const userInfo = db.collection('User-Info')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userImg: null,
    userName: "点击登录",
    userOpenid: null,
    userSchool: '',
    userFaculty: '',
    showModal: false,
    change: false,
    info_hidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var app = getApp()
    var that = this
    app.globalData.isMyFile = false
    app.globalData.isMyQes = false
    console.log(app.globalData.userInfo.userSchool)
    setTimeout(function () {
      if (app.globalData.userInfo.userSchool != '') {
        that.setData({
          userImg: app.globalData.userInfo.avatarUrl,
          userName: app.globalData.userInfo.nickName,
          userOpenid: app.globalData.userInfo.openid,
          userSchool: app.globalData.userInfo.userSchool,
          userFaculty: app.globalData.userInfo.userFaculty,
          info_hidden: false
        })
      } else {
        that.setData({
          info_hidden: true,
        })
      }
    }, 1000)


  },

  onShow: function () {
    this.onLoad()
    //getApp().globalData.isMyFile = false
    //getApp().globalData.isMyQes = false
  },

  //点击头像授权登录
  authorize: function () {
    if(getApp().globalData.userInfo.userSchool == ''){
      wx.navigateTo({
        url: '../load/load',
      })
    }
  },

  //修改信息
  change: function () {
    this.setData({
      showModal: true
    })
  },

  close: function () {
    this.setData({
      showModal: false
    })
  },

  preventTouchMove: function () {},

  school: function (e) {
    this.setData({
      userSchool: e.detail.value,
      change: true
    })
    //console.log(this.data.userSchool)
  },

  faculty: function (e) {
    this.setData({
      userFaculty: e.detail.value,
      change: true
    })
    //console.log(this.data.userFaculty)
  },

  infoSubmit: function () {
    var that = this
    var app = getApp()
    if (that.data.change == true) {
      userInfo.where({
        _openid: that.data.userOpenid
      }).update({
        data: {
          school: that.data.userSchool,
          faculty: that.data.userFaculty
        },
        success: res => {
          app.globalData.userInfo.userSchool = that.data.userSchool,
            app.globalData.userInfo.userFaculty = that.data.userFaculty
          wx.showToast({
            title: '更改成功',
            icon: 'success'
          })
          that.setData({
            showModal: false,
            change: false
          })
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您还未填写信息哦~',
        showCancel: false,
        success(res) {}
      })
    }

  }


})