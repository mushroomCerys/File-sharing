// pages/search/search.js
const db = wx.cloud.database();
const fileInfo = db.collection('File-Info');

Page({

  /* 页面的初始数据 */
  data: {
    fileCollection: [],
    searchVal: null,
    userSchool: null, //筛选要用
    userFaculty: null,
    filterVal: null,
    total: 0
  },

  /* 生命周期函数--监听页面显示*/
  onLoad: function () {
    var that = this;

    that.pageData.skip = 20

    this.setData({
      userSchool: getApp().globalData.userInfo.userSchool,
      userFaculty: getApp().globalData.userInfo.userFaculty,
      filterVal: null
    })

    //获取集合总数
    fileInfo.count({
      success: res => {
        that.setData({
          total: res.total
        })
      }
    })

    //在云数据库fileInfo中查找文件信息集合
    fileInfo.orderBy('fileTime', 'desc').get({
      success: res => {
        console.log(res)
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
      this.setData({
        filterVal: 1
      })
      wx.showLoading({
        title: '加载中...',
      })
      if (that.data.searchVal) { //搜索+本学校

        //获取集合总数
        fileInfo.where({
          userSchool: that.data.userSchool,
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
          userSchool: that.data.userSchool,
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
            //console.log(res, that.data.filterVal)
          }
        })
      } else { //本学校

        //获取集合总数
        fileInfo.where({
          userSchool: that.data.userSchool,
        }).count({
          success: res => {
            that.setData({
              total: res.total
            })
          }
        })

        fileInfo.where({
          userSchool: that.data.userSchool,
        }).orderBy('fileTime', 'desc').get({
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
        filterVal: 2
      })
      wx.showLoading({
        title: '加载中...',
      })
      if (that.data.searchVal) { //搜索+本学校+本学院

        //获取集合总数
        fileInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
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
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
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
            //console.log(res, that.data.filterVal)
          }
        })
      } else { //本学校+本学院

        //获取集合总数
        fileInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
        }).count({
          success: res => {
            that.setData({
              total: res.total
            })
          }
        })

        fileInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
        }).orderBy('fileTime', 'desc').get({
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

  //有用
  good: function () {
    var that = this
    this.setData({
      filterVal: 3
    })
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.searchVal) { //搜索+有用

      //获取集合总数
      fileInfo.where({
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
        fileName: db.RegExp({
          regexp: that.data.searchVal,
          options: 'i'
        })
      }).orderBy('good', 'desc').get({
        success: res => {
          wx.hideLoading()
          that.setData({
            fileCollection: res.data
          })
          that.pageData.skip = 20
          //console.log(res, that.data.filterVal)
        }
      })
    } else { //有用

      //获取集合总数
      fileInfo.count({
        success: res => {
          that.setData({
            total: res.total
          })
        }
      })

      fileInfo.orderBy('good', 'desc').get({
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

  //下载量
  downLoad: function () {
    var that = this
    this.setData({
      filterVal: 4
    })
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.searchVal) { //搜索+下载量

      //获取集合总数
      fileInfo.where({
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
        fileName: db.RegExp({
          regexp: that.data.searchVal,
          options: 'i'
        })
      }).orderBy('downLoad', 'desc').get({
        success: res => {
          wx.hideLoading()
          that.setData({
            fileCollection: res.data
          })
          that.pageData.skip = 20
          //console.log(res, that.data.filterVal)
        }
      })
    } else { //下载量

      //获取集合总数
      fileInfo.count({
        success: res => {
          that.setData({
            total: res.total
          })
        }
      })

      fileInfo.orderBy('downLoad', 'desc').get({
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

      //获取集合总数
      fileInfo.where({
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
        fileName: db.RegExp({
          regexp: that.data.searchVal,
          options: 'i'
        })
      }).orderBy('fileTime', 'desc').get({
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

      //获取集合总数
      fileInfo.count({
        success: res => {
          that.setData({
            total: res.total
          })
        }
      })

      fileInfo.orderBy('fileTime', 'desc').get({
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


  /*关键字搜索*/
  input: function (e) {
    this.setData({
      searchVal: e.detail.value
    })
  },

  search: function () {
    var that = this

    //获取集合总数
    fileInfo.where({
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

    wx.showLoading({
      title: '加载中...',
    })
    fileInfo.where({
      fileName: db.RegExp({
        regexp: that.data.searchVal,
        options: 'i'
      })
    }).orderBy('fileTime', 'desc').get({
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
        fileInfo.where({
          userSchool: that.data.userSchool,
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
      } else if (that.data.filterVal == 2) { //本学院筛选
        fileInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
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
      } else if (that.data.filterVal == 3) { //有用筛选
        fileInfo.where({
          fileName: db.RegExp({
            regexp: that.data.searchVal,
            options: 'i'
          })
        }).skip(that.pageData.skip).orderBy('good', 'desc').get({
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
      } else if (that.data.filterVal == 4) { //下载量筛选
        fileInfo.where({
          fileName: db.RegExp({
            regexp: that.data.searchVal,
            options: 'i'
          })
        }).skip(that.pageData.skip).orderBy('downLoad', 'desc').get({
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
        fileInfo.where({
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
      }

    } else { //所有资源下拉刷新
      if (that.data.filterVal == 1) { //本学校筛选
        fileInfo.where({
          userSchool: that.data.userSchool,
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
      } else if (that.data.filterVal == 2) { //本学院筛选
        fileInfo.where({
          userSchool: that.data.userSchool,
          userFaculty: that.data.userFaculty,
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
      } else if (that.data.filterVal == 3) { //有用筛选
        fileInfo.skip(that.pageData.skip).orderBy('good', 'desc').get({
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
      } else if (that.data.filterVal == 4) { //下载量筛选
        fileInfo.skip(that.pageData.skip).orderBy('downLoad', 'desc').get({
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
        fileInfo.skip(that.pageData.skip).orderBy('fileTime', 'desc').get({
          success: res => {
            console.log(res)
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