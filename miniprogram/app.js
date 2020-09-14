//app.js
wx.cloud.init()
const db = wx.cloud.database();
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      userInfo: {
        openid: null,
        avatarUrl: null,
        nickName: null,
        userSchool:'',
        userFaculty:''
      }, //微信获取用户信息
      isMyFile:false,
      isMyQes:false
    }
  },

  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        //console.log('appid: ', res.result.appid)
        that.globalData.userInfo.openid = res.result.openid
        //console.log('openid: ', that.globalData.userInfo.openid)
        
        db.collection('User-Info').where({
          _openid: res.result.openid,
        }).get({
          success: res => {
              that.globalData.userInfo.userSchool=res.data[0].school,
              that.globalData.userInfo.userFaculty=res.data[0].faculty
              //console.log(that.globalData.userInfo.userSchool)
          },
          fail: err => {
            console.error(err)
          }
        })
      }
    })
    
  },

})