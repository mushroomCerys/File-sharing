// pages/upfile/upfile.js

const db = wx.cloud.database();
const fileInfo = db.collection('File-Info');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenOne: true,
    hiddenTwo: true,
    fileHidden: true,
    checked: false,
    input: null, //input组件的value值

    //文件信息
    fileUrl: null,
    fileName: '',
    fileTime: 0,
    fileSize: 0,
    fileSuffix: null,
    userSchool:null,
    userFaculty:null
  },

   /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {

    this.setData({
      userSchool:getApp().globalData.userInfo.userSchool,
      userFaculty:getApp().globalData.userInfo.userFaculty
    })

  },



  //隐藏和显示信息
  clickOne: function (e) {
    this.setData({
      hiddenOne: false,
      hiddenTwo: true
    })
  },
  clickTwo: function (e) {
    this.setData({
      hiddenOne: true,
      hiddenTwo: false
    })
  },

  //文件信息表单提交
  onSubmit: function (event) {
    var that = this
    //console.log('表单数据：'+event.detail.value)
    if (!that.data.fileUrl) {
      wx.showModal({
        title: '温馨提示',
        content: '您还未上传文件哦~',
        showCancel: false,
        success(res) {}
      })
    } else {
      //将表单数据上传至云数据库
      fileInfo.add({
        data: {
          need: event.detail.value.need,
          author: event.detail.value.author,
          remark: event.detail.value.remark,
          fileUrl: that.data.fileUrl,
          fileName: that.data.fileName,
          fileTime: that.data.fileTime,
          fileSize: that.data.fileSize,
          fileSuffix: that.data.fileSuffix,
          userSchool:that.data.userSchool,
          userFaculty:that.data.userFaculty,
          good:0,
          downLoad:0
        }
      }).then(res => {
       // console.log('点击完成的返回值：', res)
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        })
      })

      //上传以后页面数据全部初始化
      setTimeout(function () {
        that.setData({
          hiddenOne: true,
          hiddenTwo: true,
          fileHidden: true,
          fileUrl: null,
          fileName: '',
          fileTime: 0,
          fileSize: 0,
          fileSuffix: null,
          input: '',
          checked: false
        })
      }, 2000)
    }

  },

  //文件上传
  selectFile: function (e) {
    var that = this
    if(getApp().globalData.userInfo.userSchool == ''){
      wx.navigateTo({
        url: '../load/load',
      })
    }else{
      wx.chooseMessageFile({ //选择文件
        count: 1, //最多上传一个文件
        type: 'file', //可以选择除了图片和视频之外的其它的文件
  
        success: function (res) {
          console.log('选择文件的返回值：', res)
          wx.showLoading({
            title: '上传中...',
          })
  
          const tempFilePaths = res.tempFiles[0].path //临时文件路径
          const houzhui = tempFilePaths.match(/\.[^.]+?$/)[0]; //文件后缀，不知道这串代码什么意思
          //console.log(houzhui)
          const fileName = new Date().getTime()+res.tempFiles[0].name; //返回1970 年 1 月 1 日到现在的毫秒数
          //获取当前时间戳
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          //console.log(t)
  
          that.setData({
            fileName: res.tempFiles[0].name,
            fileSize: (res.tempFiles[0].size / 1000).toFixed(1), //文件大小统一保存为XXX.X kb格式
            fileTime: timestamp,
            fileSuffix: houzhui
          })
          //console.log(that.data.fileSize)
  
          wx.cloud.uploadFile({ //上传文件
            cloudPath: fileName, //云存储文件名称
            filePath: tempFilePaths, //上传的文件路径，采用临时文件路径
            success: res => {
              console.log('上传文件的返回值：', res)
              wx.cloud.getTempFileURL({
                fileList: [res.fileID],
                success: res => {
                  console.log(res)
                  wx.hideLoading()
                  that.setData({
                    //res.fileList[0].tempFileURL是https格式的路径，可以根据这个路径在浏览器上下载
                    fileUrl: res.fileList[0].tempFileURL,
                    fileHidden: false
                  })
                }
              })
  
            },
            fail: err => {
              wx.hideLoading()
              wx.showModal({
                title: '温馨提示',
                content: '上传失败！',
                showCancel: false,
                success(res) {}
              })
              console.log(err)
            }
          })
        }
      })
    }
    
  },

})