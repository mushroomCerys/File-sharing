// pages/myQes/myQes.js
const db = wx.cloud.database();
const qesInfo = db.collection('Qes-Info');
const userInfo = db.collection('User-Info')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileCollection: [],
    searchVal: null,
    total: 0,
    filterVal: null,
    userOpenid: null,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getApp().globalData.isMyQes = true

    //获取集合总数
    qesInfo.where({
      _openid: getApp().globalData.userInfo.openid
    }).count({
      success: res => {
        that.setData({
          total: res.total,
          userOpenid: getApp().globalData.userInfo.openid
        })
      }
    })

    //在云数据库qesInfo中根据用户openid查找问题信息集合
    qesInfo.where({
      _openid: getApp().globalData.userInfo.openid
    }).orderBy('qesTime', 'desc').get({
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
    getApp().globalData.isMyQes = true
    this.setData({
      filterVal: null,
    })
    this.onLoad()
  },

  /**筛选 */
  //我的提问
  ask: function () {
    var that = this
    that.setData({
      fileCollection: []
    })
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.searchVal) {

      //获取问题信息集合总数
      qesInfo.where({
        _openid: getApp().globalData.userInfo.openid,
        details: db.RegExp({
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

      qesInfo.where({
        _openid: getApp().globalData.userInfo.openid,
        details: db.RegExp({
          regexp: that.data.searchVal,
          options: 'i'
        })
      }).orderBy('qesTime', 'desc').get({
        success: res => {
          wx.hideLoading()
          that.setData({
            fileCollection: res.data,
            filterVal: null
          })
          //console.log(res, that.data.searchVal)
          that.pageData.skip = 20
        }
      })
    } else {
      //获取问题信息集合总数
      qesInfo.where({
        _openid: getApp().globalData.userInfo.openid,
      }).count({
        success: res => {
          that.setData({
            total: res.total
          })
        }
      })

      qesInfo.orderBy('qesTime', 'desc').where({
        _openid: getApp().globalData.userInfo.openid,
      }).get({
        success: res => {
          wx.hideLoading()
          //console.log(res)
          that.setData({
            fileCollection: res.data,
            filterVal: null
          })
          that.pageData.skip = 20
        },
        fail: err => {
          console.error(err)
        }
      })
    }
  },

  //我的关注
  follow: function () {
    var that = this
    this.setData({
      filterVal: 1,
      fileCollection: [],
    })
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.searchVal) { //搜索+我的关注
      userInfo.where({
        _openid: getApp().globalData.userInfo.openid
      }).get().then(res => {
        //console.log(res)
        this.setData({
          userInfo: res.data[0],
        })
        //循环显示该问题的回答文件
        var length = 0
        var fileCollection = that.data.fileCollection
        var fileLength = that.data.userInfo.follow.length
        if (fileLength > 10) fileLength = 10
        for (var i = 0; i < fileLength; i++) {
          qesInfo.where({
            _id: that.data.userInfo.follow[i],
            details: db.RegExp({
              regexp: that.data.searchVal,
              options: 'i'
            })
          }).get({
            success: res => {
              if (res.data.length != 0) {
                length = length + 1
                //console.log(res.data[0])
                fileCollection.push(res.data[0])
                that.setData({
                  fileCollection
                })
              }
            }
          })
        }
        that.pageData.skip = 10
        wx.hideLoading()
        setTimeout(function () {
          that.setData({
            total: length
          })
        }, 1000)

      })
    } else { //我的关注
      userInfo.where({
        _openid: getApp().globalData.userInfo.openid
      }).get().then(res => {
        //console.log(res.data[0])
        that.setData({
          userInfo: res.data[0],
        })
        //循环显示该问题的回答文件
        var fileCollection = that.data.fileCollection
        var fileLength = that.data.userInfo.follow.length
        if (fileLength > 10) fileLength = 10
        for (var i = 0; i < fileLength; i++) {
          qesInfo.where({
            _id: that.data.userInfo.follow[i],
          }).get({
            success: res => {
              //console.log(res)
              fileCollection.push(res.data[0])
              that.setData({
                fileCollection
              })
              //console.log(that.data.fileCollection)
            }
          })
        }
        setTimeout(function () {
          that.setData({
            total: that.data.userInfo.follow.length
          })
        }, 500)
        that.pageData.skip = 10
        wx.hideLoading()
      })

    }
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
    qesInfo.where({
      _openid: getApp().globalData.userInfo.openid,
      details: db.RegExp({
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


    qesInfo.where({
      _openid: getApp().globalData.userInfo.openid,
      details: db.RegExp({
        regexp: that.data.searchVal,
        options: 'i'
      })
    }).orderBy('qesTime', 'desc').get({
      success: res => {
        wx.hideLoading()
        that.setData({
          fileCollection: res.data,
          filterVal: null
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
      if (that.data.filterVal == 1) { //我的关注
        var length=that.data.total
        var fileCollection = that.data.fileCollection
        var fileLength = that.data.userInfo.follow.length
        if (fileLength > that.pageData.skip + 10) fileLength = that.pageData.skip + 10
        for (var i = that.pageData.skip; i < fileLength; i++) {
          qesInfo.where({
            _id: that.data.userInfo.follow[i],
            details: db.RegExp({
              regexp: that.data.searchVal,
              options: 'i'
            })
          }).get({
            success: res => {
              if (res.data.length != 0) {
                length = length + 1
                //console.log(res.data[0])
                fileCollection.push(res.data[0])
                that.setData({
                  fileCollection
                })
              }
            }
          })
        }
        that.pageData.skip = that.pageData.skip + 10
        setTimeout(function () {
          that.setData({
            total: length
          })
          wx.hideLoading()
        }, 1000)
      } else { //我的提问
        qesInfo.where({
          _openid: getApp().globalData.userInfo.openid,
          details: db.RegExp({
            regexp: that.data.searchVal,
            options: 'i'
          })
        }).skip(that.pageData.skip).orderBy('qesTime', 'desc').get({
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

    } else { //所有资源下拉刷新
      if (that.data.filterVal == 1) { //我的关注
        var that = this;
        var fileCollection = that.data.fileCollection
        var fileLength = that.data.userInfo.follow.length
        if (fileLength > that.pageData.skip + 10) fileLength = that.pageData.skip + 10
        for (var i = that.pageData.skip; i < fileLength; i++) {
          qesInfo.where({
            _id: that.data.userInfo.follow[i],
          }).get({
            success: res => {
              //console.log(res)
              fileCollection.push(res.data[0])
              that.setData({
                fileCollection
              })
              console.log(that.data.fileCollection)
            }
          })
        }
        that.pageData.skip = that.pageData.skip + 10
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)

      } else { //我的提问
        qesInfo.where({
          _openid: getApp().globalData.userInfo.openid
        }).skip(that.pageData.skip).orderBy('qesTime', 'desc').get({
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

    }

  },
  //存放触底刷新跳过的页面数
  pageData: {
    skip: 20
  }


})