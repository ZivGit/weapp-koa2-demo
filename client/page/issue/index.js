const { service, cos } = require('../../config')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        aMByte         : 1000000,     // (1 MB = 1048576 B)
        // 标题
        titleValue     : '',
        titleLength    : 0,
        titleMaxlength : 50,
        titleMinlength : 3,
        titleValidate  : true,
        // 图片
        images         : [],          // 图片本地path
        imagesSrc      : [],          // 图片服务端src
        imagesCount    : 9,           // 图片最大上传数量限制
        imagesMinlength: 1,           // 图片最小上传数量限制
        imagesMaxSizeB : cos.maxSize, // 图片最大容量限制
        imagesProgress : [],          // 图片上传进度
        imagesStatus   : [],          // 图片是否上传成功状态
        imagesActivate : false,       // 图片是否可操作状态
        imagesValidate : true,        // 图片验证
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

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
     * 标题
     */
    titleDescribe: function(e) {
        const value = e.detail.value.replace(/^ +| +$/g, '')

        this.setData({
            titleValue: value,
            titleLength: e.detail.cursor,
        })

        // 验证
        if (!this.data.titleValidate) {
            this.validator()
        }
    },

    /**
     * 清空标题
     */
    emptyTitle: function() {
        this.setData({
            titleValue: '',
            titleLength: 0,
            titleValidate: true,
        })
    },

    /**
     * 选择图片
     */
    chooseImage: function() {
        const { images, imagesCount, imagesMaxSizeB, imagesValidate, aMByte } = this.data

        wx.chooseImage({
            sourceType: ['camera', 'album'],
            sizeType: ['compressed', 'original'],
            count: imagesCount,
            success: (res) => {
                const imgSum = res.tempFilePaths.length + images.length <= imagesCount
                const imgSize = res.tempFiles.every(item => item.size <= imagesMaxSizeB * aMByte)

                if (!imgSum) {
                    wx.showToast({
                        title: '最多上传' + imagesCount + '张',
                        image: '/image/warn.png',
                        mask: true,
                    })
                }
                else if (!imgSize) {
                    wx.showToast({
                        title: '单张超过 ' + imagesMaxSizeB + 'MB',
                        image: '/image/warn.png',
                        mask: true,
                    })
                }
                else {
                    this.setData({
                        images: images.concat(res.tempFilePaths),
                        imagesActivate: false,
                    })
                }

                // 验证
                if (!imagesValidate) {
                    this.validator()
                }
            }
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
                const uploadTask = wx.uploadFile({
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
                                ['imagesStatus['+ index +']']: true,
                            })
                        }
                        else {
                            this.setData({
                                ['imagesStatus['+ index +']']: false,
                            })
                        }
                    },
                    fail: (err) => {
                        reject(err)
                        this.setData({
                            ['imagesStatus['+ index +']']: false,
                        })
                    }
                })
                uploadTask.onProgressUpdate((res) => {
                    this.setData({
                        ['imagesProgress['+ index +']']: res.progress,
                    })
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
     * 预览图片
     */
    previewImage: function(e) {
        wx.previewImage({
            current: e.target.dataset.src,
            urls: this.data.images
        })
    },

    /**
     * 激活图片删除功能
     */
    activateImage: function() {
        this.setData({
            imagesActivate: !(this.data.imagesActivate)
        })
    },

    /**
     * 删除图片
     */
    deleteImages: function(e) {
        const index = e.currentTarget.dataset.index

        if (this.data.imagesActivate) {
            const { images } = this.data
            const copyImages = images.slice()
            copyImages.splice(index, 1)

            this.setData({
                images: copyImages,
                imagesActivate: copyImages.length ? true : false,
            })
        }
        else {
            return false
        }
    },

    /**
     * 清空图片
     */
    emptyImages: function() {
        this.setData({
            images: [],
            imagesProgress: [],
            imagesStatus: [],
            imagesValidate: true,
        })
    },

    /**
     * 验证
     */
    validator: function(success, fail) {
        const { titleLength, titleMinlength, images, imagesMinlength } = this.data

        this.setData({
            titleValidate: titleLength >= titleMinlength ? true : false,
            imagesValidate: images.length >= imagesMinlength ? true : false,
        }, () => {
            const { titleValidate, imagesValidate } = this.data

            if (titleValidate && imagesValidate) {
                success && success()
            } else {
                fail && fail()
            }
        })
    },

    /**
     * 下一步
     */
    next: function() {
        const { titleValue, images, } = this.data

        this.validator(() => {
            app.globalData.arrayContainer = app.globalData.arrayContainer.concat(images)
            // 跳转到主要内容编辑页面
            wx.navigateTo({
                url: `/page/issue/pages/write/index?title=${titleValue}`
            })
        })
    },

    /**
     * 提交表单
     */
    submit: function() {
        const { titleValue, images, imagesSrc, } = this.data

        this.validator(() => {
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
                            },
                            success: (res) => {
                                wx.hideLoading()
                                if (res.data.code === 0) {
                                    wx.showToast({
                                        title: '提交成功',
                                        icon: 'success',
                                        mask: true,
                                        success: () => {
                                            wx.navigateTo({
                                                url: '/page/evidence/pages/item/index?id=' + res.data.data.id,
                                                success: () => {
                                                    // 清空数据
                                                    this.emptyTitle()
                                                    this.emptyImages()
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    wx.showModal({
                                        title: '提交失败',
                                        content: '图片上传失败，请长按删除后再试',
                                        showCancel: false,
                                    })
                                }
                            }
                        })
                    },
                    fail: (err) => {
                        wx.showModal({
                            title: '提交失败',
                            content: '图片信息获取失败，请长按删除后再试',
                            showCancel: false,
                        })
                    }
                })
            })
        })
    }
})