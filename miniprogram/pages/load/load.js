// pages/load/load.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo') //判断用户微信版本有无授权功能
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中
    wx.showLoading({
      title: '加载中',
    })
   
    //计时器
    setTimeout(function () {
      wx.hideLoading()
    }, 500)

  },

  //用户第一次登陆授权弹窗
  bindGetUserInfo(e) {
    //console.log('用户信息', e.detail.userInfo)
    if (e.detail.userInfo) {
      //获取用户的openid并存入全局变量
      getApp().getOpenid();

      getApp().globalData.userInfo.avatarUrl = e.detail.userInfo.avatarUrl,
      getApp().globalData.userInfo.nickName = e.detail.userInfo.nickName
      wx.redirectTo({
        url: '/pages/Info/Info',
      })
    }
  },

})