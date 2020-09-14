// pages/Info/Info.js
const db = wx.cloud.database();
const userInfo = db.collection('User-Info');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  

  //用户信息表单提交
  onSubmit: function (event) {
    //console.log(event.detail.value)

    //将用户填写的学校学院信息存入全局变量
    getApp().globalData.userInfo.userSchool = event.detail.value.school,
      getApp().globalData.userInfo.userFaculty = event.detail.value.faculty

    //将用户填写的用户信息存入云数据库
    if (event.detail.value.school == "" || event.detail.value.faculty == "") {
      wx.showModal({
        title: '温馨提示',
        content: '您还未完善信息哦~',
        showCancel: false,
        success(res) {}
      })
    } else {
      userInfo.add({
        data: {
          picture: getApp().globalData.userInfo.avatarUrl,
          name: getApp().globalData.userInfo.nickName,
          school: event.detail.value.school,
          faculty: event.detail.value.faculty,
          follow: []
        }
      }).then(res => {
        //console.log('点击完成的返回值：', res)
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
      })

      setTimeout(function () {
        wx.navigateBack({
          delta: 2,
        })
      }, 2000)

    }

  },

})