// pages/ask/ask.js
const db = wx.cloud.database();
const qesInfo = db.collection('Qes-Info');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: null,
    //问题信息
    userSchool: null,
    userFaculty: null,
    details: null,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userSchool: getApp().globalData.userInfo.userSchool,
      userFaculty: getApp().globalData.userInfo.userFaculty
    })
  },

  question: function (e) {
    this.setData({
      details: e.detail.value
    })

  },

  qesSubmit: function () {
    var that = this
    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    if (getApp().globalData.userInfo.userSchool == '') {
      wx.navigateTo({
        url: '../load/load',
      })
    } else {
      if (that.data.details == null||that.data.details=="") {
        wx.showModal({
          title: '温馨提示',
          content: '您还未填写问题哦~',
          showCancel: false,
          success(res) {}
        })
      } else {
        qesInfo.add({
          data: {
            userSchool: that.data.userSchool,
            userFaculty: that.data.userFaculty,
            details: that.data.details,
            fileId: [],
            follow: 0,
            qesTime: timestamp
          }
        }).then(res => {
          //console.log('点击发布的返回值：', res)
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          })
          that.setData({
            input: '',
            details: null
          })
        })
      }
    }

  }
})