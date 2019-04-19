const { service } = require('../../../../config')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        images: [],
        imagesSrc: [],
        titleValue: '',
        contentValue: '',
        contentLength: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const imageConcat = this.data.images.concat(app.globalData.arrayContainer)

        this.setData({
            titleValue: options.title,
            images: imageConcat,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},

    /**
     * 选择证据形式
     */
    menu: function(e) {
        wx.showActionSheet({
            itemList: ['学习Markdown语法', '存为草稿'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    console.log(1, res)
                }
                if (res.tapIndex === 1) {
                    console.log(2, res)
                }
            }
        })
    },

    /**
     * 输入
     */
    contentDescribe: function(e) {
        this.setData({
            contentValue: e.detail.value,
            contentLength: e.detail.cursor,
        })
    },

    /**
     * 获取图片信息
     */
    getImageInfo: function({images, success, fail}) {
        const promise = images.map(item => {
            return new Promise((resolve, reject) => {
                wx.getImageInfo({
                    src: item,
                    success: (res) => {
                        resolve(res)
                    },
                    fail: (err) => {
                        reject(err)
                    }
                })
            })
        })

        Promise.all(promise)
            .then(values => {
                success && success(values)
            })
            .catch(reason => {
                fail && fail(reason)
            })
    },

    /**
     * 图片上传
     */
    uploadImage: function(success, fail) {
        const promise = this.data.images.map((item, index) => {
            return new Promise((resolve, reject) => {
                wx.uploadFile({
                    url: service.uploadUrl,
                    filePath: item,
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    success: (res) => {
                        resolve(res)
                        if (res.statusCode === 200) {
                            const dataJson = JSON.parse(res.data)
                            this.setData({
                                ['imagesSrc['+ index +']']: dataJson.data.imgUrl,
                            })
                        }
                    },
                    fail: (err) => {
                        reject(err)
                    }
                })
            })
        })

        Promise.all(promise)
            .then(values => {
                success && success(values)
            })
            .catch(reason => {
                fail && fail(reason)
                wx.showToast({
                    title: '上传失败',
                    image: '/image/warn.png',
                    mask: true,
                })
            })
    },

    /**
     * 提交表单
     */
    submit: function() {
        const { images, imagesSrc, thumbnail, titleValue, contentValue, contentLength, } = this.data

        if (contentLength >= 6) {
            wx.showLoading({
                title: '正在发布',
                mask: true,
            })
            this.uploadImage(() => {
                // 获取图片信息
                this.getImageInfo({
                    images: images,
                    success: (res) => {
                        const imgType = res.map(item => item.type)

                        wx.request({
                            url: service.evidenceUrl,
                            method: 'POST',
                            data: {
                                images: JSON.stringify(imagesSrc),
                                imgType: JSON.stringify(imgType),
                                thumbnail: imagesSrc[0],
                                title: titleValue,
                                content: contentValue,
                            },
                            success: (res) => {
                                wx.hideLoading()
                                if (res.data.code === 0) {
                                    wx.showToast({
                                        title: '提交成功',
                                        icon: 'success',
                                        mask: true,
                                        success: () => {
                                            wx.redirectTo({
                                                url: '/page/evidence/pages/item/index?id=' + res.data.data.id
                                            })
                                        }
                                    })
                                }
                                else {
                                    wx.showToast({
                                        title: '提交失败',
                                        image: '/image/warn.png',
                                        mask: true,
                                    })
                                }
                            }
                        })
                    },
                    fail: (err) => {
                        wx.showToast({
                            title: '提交失败',
                            image: '/image/warn.png',
                            mask: true,
                        })
                    }
                })
            })
        }
        else {
            wx.showToast({
                title: '字数不足',
                image: '/image/warn.png',
                mask: true,
            })
        }
    }
})