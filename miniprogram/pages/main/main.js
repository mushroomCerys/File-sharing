// pages/main/main.js
const db = wx.cloud.database();
const qesInfo = db.collection('Qes-Info');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileCollection: [],
    userSchool: null,
    userFaculty: null,
    filterVal: null,
    searchVal: null,
    total: 0

  },

  /* 生命周期函数--监听页面显示*/
  onLoad: function () {
    var that = this;

    that.pageData.skip = 20

    //加载中
    wx.showLoading({
      title: '加载中',
    })

    wx.login({
      success(res) {
        //console.log(res)
        if (res.code) {
          // 查看是否授权
          wx.getSetting({
            success(res) {
              //console.log(res)
              if (res.authSetting['scope.userInfo']) {
                getApp().getOpenid() //获取用户的openid并存入全局变量
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function (res) {
                    console.log('用户信息', res.userInfo)
                    getApp().globalData.userInfo.avatarUrl = res.userInfo.avatarUrl,
                      getApp().globalData.userInfo.nickName = res.userInfo.nickName
                    //console.log(getApp().globalData.userInfo.avatarUrl)
                  }
                })
              }
            }

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })

    that.setData({
      filterVal: null
    })

    //计时器
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)

    //获取问题信息集合总数
    qesInfo.count({
      success: res => {
        that.setData({
          total: res.total
        })
      }
    })

    //在云数据库qesInfo中查找问题信息集合
    qesInfo.orderBy('qesTime', 'desc').get({
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

  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    this.onLoad()
  },

  /**筛选 */
  //本学校
  mySchool: function () {

    var that = this
    if (getApp().globalData.userInfo.userSchool == '') {
      wx.navigateTo({
        url: '../load/load',
      })
    } else {
      that.setData({
        filterVal: 1,
        userSchool: getApp().globalData.userInfo.userSchool,
        userFaculty: getApp().globalData.userInfo.userFaculty,
      })
      wx.showLoading({
        title: '加载中...',
      })
      if (that.data.searchVal) { //搜索+本学校

        //获取问题信息集合总数
        qesInfo.where({
          userSchool: that.data.userSchool,
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
          userSchool: that.data.userSchool,
          details: db.RegExp({
            regexp: that.data.searchVal,
            options: 'i'
          })
        }).orderBy('qesTime', 'desc').get({
          success: res => {
            wx.hideLoading()
            that.setData({
              fileCollection: res.data
            })
            that.pageData.skip = 20
            //console.log(res, that.data.filterVal)
          }
        })
      } else { //本学校

        //获取问题信息集合总数
        qesInfo.where({
          userSchool: that.data.userSchool,
        }).count({
          success: res => {
            that.setData({
              total: res.total
            })
          }
        })

        qesInfo.where({
          userSchool: that.data.userSchool,
        }).orderBy('qesTime', 'desc').get({
          success: res => {
            wx.hideLoading()
            that.setData({
              fileCollection: res.data
            })
            that.pageData.skip = 20
            //console.log(res, that.data.filterVal)
          }
        })
      }
    }


  },

  //本学院
  myFaculty: function () {
    var that = this
    if (getApp().globalData.userInfo.userSchool == '') {
      wx.navigateTo({
        url: '../load/load',
      })
    } else {
      this.setData({
        filterVal: 2,
        userSchool: getApp().globalData.userInfo.userSchool,
        userFaculty: getApp().globalData.userInfo.userFaculty,
      })
      wx.showLoading({
        title: '加载中...',
      })
      if (that.data.searchVal) { //搜索+本学校+本学院

        //获取问题信息集合总数
        qesInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
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
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
          details: db.RegExp({
            regexp: that.data.searchVal,
            options: 'i'
          })
        }).orderBy('qesTime', 'desc').get({
          success: res => {
            wx.hideLoading()
            that.setData({
              fileCollection: res.data
            })
            that.pageData.skip = 20
            //console.log(res, that.data.filterVal)
          }
        })
      } else { //本学校+本学院

        //获取问题信息集合总数
        qesInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
        }).count({
          success: res => {
            that.setData({
              total: res.total
            })
          }
        })

        qesInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
        }).orderBy('qesTime', 'desc').get({
          success: res => {
            wx.hideLoading()
            that.setData({
              fileCollection: res.data
            })
            that.pageData.skip = 20
            //console.log(res, that.data.filterVal)
          }
        })
      }
    }


  },

  //已解决
  solved: function () {
    var that = this


    this.setData({
      filterVal: 3,
    })
    wx.showLoading({

      title: '加载中...',
    })
    if (that.data.searchVal) { //搜索+已解决

      //获取问题信息集合总数
      qesInfo.where({
        fileId: db.command.not(db.command.size(0)),
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
        fileId: db.command.not(db.command.size(0)),
        details: db.RegExp({
          regexp: that.data.searchVal,
          options: 'i'
        })
      }).orderBy('qesTime', 'desc').get({
        success: res => {
          wx.hideLoading()
          that.setData({
            fileCollection: res.data
          })
          that.pageData.skip = 20
          //console.log(res, that.data.filterVal)
        }
      })
    } else { //已解决

      //获取问题信息集合总数
      qesInfo.where({
        fileId: db.command.not(db.command.size(0)),
      }).count({
        success: res => {
          that.setData({
            total: res.total
          })
        }
      })

      qesInfo.where({
        fileId: db.command.not(db.command.size(0)), //数组长度不为0
      }).orderBy('qesTime', 'desc').get({
        success: res => {
          wx.hideLoading()
          that.setData({
            fileCollection: res.data
          })
          that.pageData.skip = 20
          //console.log(res, that.data.filterVal)
        }
      })
    }


  },


  //未解决
  unSolved: function () {
    var that = this

    this.setData({
      filterVal: 4,
    })
    wx.showLoading({

      title: '加载中...',
    })
    if (that.data.searchVal) { //搜索+未解决

      //获取问题信息集合总数
      qesInfo.where({
        fileId: [],
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
        fileId: [],
        details: db.RegExp({
          regexp: that.data.searchVal,
          options: 'i'
        })
      }).orderBy('qesTime', 'desc').get({
        success: res => {
          wx.hideLoading()
          that.setData({
            fileCollection: res.data
          })
          that.pageData.skip = 20
          //console.log(res, that.data.filterVal)
        }
      })
    } else { //未解决

      //获取问题信息集合总数
      qesInfo.where({
        fileId: []
      }).count({
        success: res => {
          that.setData({
            total: res.total
          })
        }
      })

      qesInfo.where({
        fileId: [],
      }).orderBy('qesTime', 'desc').get({
        success: res => {
          wx.hideLoading()
          that.setData({
            fileCollection: res.data
          })
          that.pageData.skip = 20
          //console.log(res, that.data.filterVal)
        }
      })
    }


  },

  //全部
  all: function () {
    var that = this

    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.searchVal) {

      //获取问题信息集合总数
      qesInfo.where({
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
      qesInfo.count({
        success: res => {
          that.setData({
            total: res.total
          })
        }
      })

      qesInfo.orderBy('qesTime', 'desc').get({
        success: res => {
          wx.hideLoading()
          console.log(res)
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


  /*关键字搜索*/
  input: function (e) {
    this.setData({
      searchVal: e.detail.value
    })
  },

  search: function () {
    var that = this

    //获取问题信息集合总数
    qesInfo.where({
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

    wx.showLoading({
      title: '加载中...',
    })
    qesInfo.where({
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

  /*下拉刷新*/
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
    })
    if (that.data.searchVal) { //用户搜索结果下拉刷新
      if (that.data.filterVal == 1) { //本学校筛选
        qesInfo.where({
          userSchool: that.data.userSchool,
          detail: db.RegExp({
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
      } else if (that.data.filterVal == 2) { //本学院筛选
        qesInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
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
      } else if (that.data.filterVal == 3) { //已解决筛选
        qesInfo.where({
          fileId: db.command.not(db.command.size(0)), //数组长度不为0
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
      } else if (that.data.filterVal == 4) { //未解决筛选
        qesInfo.where({
          fileId: [],
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
      } else { //纯搜索无筛选
        qesInfo.where({
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
      if (that.data.filterVal == 1) { //本学校筛选
        qesInfo.where({
          userSchool: that.data.userSchool,
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
      } else if (that.data.filterVal == 2) { //本学院筛选
        qesInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
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
      } else if (that.data.filterVal == 3) { //已解决筛选
        qesInfo.where({
          fileId: db.command.not(db.command.size(0)), //数组长度不为0
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
      } else if (that.data.filterVal == 4) { //未解决筛选
        qesInfo.where({
          fileId: [],
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
      } else { //无筛选
        qesInfo.skip(that.pageData.skip).orderBy('qesTime', 'desc').get({
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