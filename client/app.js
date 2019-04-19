const openIdUrl = require('./config').openIdUrl

App({
    onLaunch: function () {
        console.log('App Launch')
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    globalData: {
        hasLogin: false,
        openid: null,
        arrayContainer: []
    },
    // lazy loading openid
    getUserOpenId: function (callback) {
        if (this.globalData.openid) {
            callback(null, this.globalData.openid)
        } else {
            wx.login({
                success: function (data) {
                    wx.request({
                        url: openIdUrl,
                        data: {
                            code: data.code
                        },
                        success: (res) => {
                            console.log('拉取openid成功', res)
                            this.globalData.openid = res.data.openid
                            callback(null, this.globalData.openid)
                        },
                        fail: (res) => {
                            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                            callback(res)
                        }
                    })
                },
                fail: (err) => {
                    console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                    callback(err)
                }
            })
        }
    }
})
