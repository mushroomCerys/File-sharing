// pages/downfile/downfile.js
const db = wx.cloud.database();
const fileInfo = db.collection('File-Info');

Page({

  /* 页面的初始数据*/
  data: {
    //文件信息
    fileInfo: {},
    imgSrc: null,
    hidden: false,
    isMy: false
  },

  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    fileInfo.doc(options.id).get().then(res => {
      //console.log(res)
      this.setData({
        fileInfo: res.data
      })
    })

    if (getApp().globalData.isMyFile||getApp().globalData.userInfo.userSchool == '') {
      this.setData({
        isMy: true
      })
      getApp().globalData.isMyFile = false
    }

  },

  //缓存并预览文件
  openfile: function () {
    var that = this
    if(getApp().globalData.userInfo.userSchool == ''){
      wx.navigateTo({
        url: '../load/load',
      })
    }else{
      wx.showLoading({
        title: '加载中...',
      })
      //根据https路径可以获得http格式的路径(指定文件下载后缓存的路径 (本地路径)),根据这个路径可以预览
      wx.downloadFile({
        url: that.data.fileInfo.fileUrl,
        success: (res) => {
          //console.log(res)
          that.setData({
            httpfile: res.tempFilePath
          })
          //预览文件
          wx.openDocument({
            filePath: that.data.httpfile,
            showMenu: true,
            success: res => {
              wx.hideLoading()
              //console.log(res)
            },
            fail: err => {
              console.log(err);
              wx.hideLoading()
              wx.showModal({
                title: '温馨提示',
                content: '文件格式不支持预览',
                showCancel: false,
                success(res) {}
              })
            }
          })
        },
        fail: (err) => {
          console.log('读取失败', err)
        }
      })
    }
    
  },

  //复制文件路径并在浏览器打开下载
  savefile: function () {
    var that = this
    
    if(getApp().globalData.userInfo.userSchool == ''){
      wx.navigateTo({
        url: '../load/load',
      })
    }else{//复制下载链接到剪切板
      wx.setClipboardData({
        data: that.data.fileInfo.fileUrl,
        success: res => {
          //console.log(that.data.fileInfo.fileUrl)
          wx.showToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    }

    //更新文章下载量
    var set = 'fileInfo.downLoad'
    fileInfo.where({
      _id: that.data.fileInfo._id
    }).update({
      data: {
        downLoad: db.command.inc(1)
      }
    }).then(res => {
      that.setData({
        [set]: that.data.fileInfo.downLoad + 1
      })
    })
  },

  //点赞有用
  good: function () {
    var that = this
    var set = 'fileInfo.good'
    fileInfo.where({
      _id: that.data.fileInfo._id
    }).update({
      data: {
        good: db.command.inc(1)
      }
    }).then(res => {
      that.setData({
        [set]: that.data.fileInfo.good + 1,
        hidden: true
      })
    })
  },

  //取消有用
  noGood: function () {
    var that = this
    var set = 'fileInfo.good'
    fileInfo.where({
      _id: that.data.fileInfo._id
    }).update({
      data: {
        good: db.command.inc(-1)
      }
    }).then(res => {
      that.setData({
        [set]: that.data.fileInfo.good - 1,
        hidden: false
      })
    })
  }

})