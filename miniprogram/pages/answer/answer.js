// pages/answer/answer.js
const db = wx.cloud.database();
const fileInfo = db.collection('File-Info');
const qesInfo = db.collection('Qes-Info');
const userInfo = db.collection('User-Info')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileCollection: [],
    qesInfo: {},
    qesId: null,
    hidden: false,
    isMy:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从我的问题进去关注和回答图标隐藏
    if(getApp().globalData.isMyQes||getApp().globalData.userInfo.userSchool == ''){
      getApp().globalData.isMyQes = false
      this.setData({
        isMy:true,
        qesId:options.id
      })
    }
    
    var that = this
    //查找该问题用户是否曾经关注过
    userInfo.where({
      _openid: getApp().globalData.userInfo.openid,
      follow:options.id
    }).get().then(res => {
      if(res.data.length==0){
        that.setData({
          hidden:false
        })
      }else{
        that.setData({
          hidden:true
        })
      }
    })

    qesInfo.doc(options.id).get().then(res => {
      //console.log(res)
      this.setData({
        qesInfo: res.data,
        qesId: options.id
      })
      //循环显示该问题的回答文件
      var fileCollection = that.data.fileCollection
      var fileLength = that.data.qesInfo.fileId.length
      if (fileLength > 10) fileLength = 10
      for (var i = 0; i < fileLength; i++) {
        fileInfo.where({
          _id: that.data.qesInfo.fileId[i],
        }).get({
          success: res => {
            console.log(res)
            fileCollection.push(res.data[0])
            that.setData({
              fileCollection
            })
          }
        })
      }

    })

  },


  onShow: function () {
    var that = this
    if (that.data.qesId) {
      qesInfo.doc(that.data.qesId).get().then(res => {
        //console.log(res)
        this.setData({
          qesInfo: res.data,
          fileCollection: [],
        })
        //循环显示该问题的回答文件
        var fileCollection = that.data.fileCollection
        var fileLength = that.data.qesInfo.fileId.length
        if (fileLength > 10) fileLength = 10
        for (var i = 0; i < fileLength; i++) {
          fileInfo.where({
            _id: that.data.qesInfo.fileId[i],
          }).get({
            success: res => {
              //console.log(res)
              fileCollection.push(res.data[0])
              that.setData({
                fileCollection
              })
            }
          })
        }
        that.pageData.skip = 10
      })
    }

  },

  //下拉刷新
  onReachBottom: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    var that = this;
    var fileCollection = that.data.fileCollection
    var fileLength = that.data.qesInfo.fileId.length
    if (fileLength > that.pageData.skip + 10) fileLength = that.pageData.skip + 10
    for (var i = that.pageData.skip; i < fileLength; i++) {
      fileInfo.where({
        _id: that.data.qesInfo.fileId[i],
      }).get({
        success: res => {
          //console.log(res)
          fileCollection.push(res.data[0])
          that.setData({
            fileCollection
          })
        }
      })
    }
    that.pageData.skip = that.pageData.skip + 10
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)

  },
  //存放触底刷新跳过的页面数
  pageData: {
    skip: 10
  },

  //关注
  follow: function () {
    var that = this
    //将问题id上传至用户集合
    userInfo.where({
      _openid: getApp().globalData.userInfo.openid
    }).update({
      data: {
        follow: db.command.unshift([that.data.qesId])
      }
    }).then(res => {
      that.setData({
        hidden: true
      })
      wx.showToast({
        title: '关注成功',
        icon: 'success'
      })
    })

    //更新问题信息的关注量
    var set = 'qesInfo.follow'
    qesInfo.where({
      _id:that.data.qesId
    }).update({
      data:{
        follow:db.command.inc(1)
      }
    }).then(res => {
      that.setData({
        [set]: that.data.qesInfo.follow + 1
      })
    })

  },

  //取消关注
  nofollow: function () {
    var that = this
    //将问题id上传至用户集合
    userInfo.where({
      _openid: getApp().globalData.userInfo.openid
    }).update({
      data: {
        follow: db.command.pull(that.data.qesId)
      }
    }).then(res => {
      //console.log(res)
      that.setData({
        hidden: false
      })
      wx.showToast({
        title: '取消关注',
        icon: 'success'
      })
    })

    //更新问题信息的关注量
    var set = 'qesInfo.follow'
    qesInfo.where({
      _id: that.data.qesId
    }).update({
      data: {
        follow: db.command.inc(-1)
      }
    }).then(res => {
      that.setData({
        [set]: that.data.qesInfo.follow - 1
      })
    })
  }

})