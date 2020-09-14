// pages/myFile/myFile.js
const db = wx.cloud.database();
const fileInfo = db.collection('File-Info');
Page({
  /* 页面的初始数据*/
  data: {
    fileCollection: [],
    searchVal: null,
    total: 0
  },

  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    getApp().globalData.isMyFile = true

    //获取集合总数
    fileInfo.where({
      _openid: getApp().globalData.userInfo.openid
    }).count({
      success: res => {
        that.setData({
          total: res.total
        })
      }
    })

    //在云数据库fileInfo中根据用户openid查找文件信息集合
    fileInfo.where({
      _openid: getApp().globalData.userInfo.openid
    }).orderBy('fileTime', 'desc').get({
      success: res => {
        //console.log(res)
        that.setData({
          fileCollection: res.data
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  },

  onShow:function(){
    getApp().globalData.isMyFile = true
  },

  //关键字搜索
  input: function (e) {
    this.setData({
      searchVal: e.detail.value
    })
  },

  search: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })

    //获取集合总数
    fileInfo.where({
      _openid: getApp().globalData.userInfo.openid,
      fileName: db.RegExp({
        regexp: that.data.searchVal,
        options: 'i'
      })
    }).count({
      success: res => {
        that.setData({
          total: res.total
        })
      }
    })


    fileInfo.where({
      _openid: getApp().globalData.userInfo.openid,
      fileName: db.RegExp({
        regexp: that.data.searchVal,
        options: 'i'
      })
    }).orderBy('fileTime', 'desc').get({
      success: res => {
        wx.hideLoading()
        that.setData({
          fileCollection: res.data
        })
        that.pageData.skip = 20
        //console.log(res, that.data.searchVal)
      }
    })
  },

  //下拉刷新
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
    })
    if (that.data.searchVal) { //用户搜索结果下拉刷新
      fileInfo.where({
        _openid: getApp().globalData.userInfo.openid,
        fileName: db.RegExp({
          regexp: that.data.searchVal,
          options: 'i'
        })
      }).skip(that.pageData.skip).orderBy('fileTime', 'desc').get({
        success: res => {
          //console.log(res)
          wx.hideLoading()
          let oldData = that.data.fileCollection
          that.setData({
            fileCollection: oldData.concat(res.data)
          })
          that.pageData.skip = that.pageData.skip + 20;
        },
        fail: err => {
          console.error(err)
        }
      })
    } else { //所有资源下拉刷新
      fileInfo.where({
        _openid: getApp().globalData.userInfo.openid
      }).skip(that.pageData.skip).orderBy('fileTime', 'desc').get({
        success: res => {
          //console.log(res)
          wx.hideLoading()
          let oldData = that.data.fileCollection
          that.setData({
            fileCollection: oldData.concat(res.data)
          })
          that.pageData.skip = that.pageData.skip + 20;
        },
        fail: err => {
          console.error(err)
        }
      })

    }

  },
  //存放触底刷新跳过的页面数
  pageData: {
    skip: 20
  }

})