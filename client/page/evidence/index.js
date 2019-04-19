const { service } = require('../../config')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 进场动画
        onShow: false,

        // PageScroll status
        psStatus: true,

        // page__hd
        pageHD: false,

        // 列表
        list: [[], []],
        listStart: 0,
        listSize: 5,

        // 1=未启动 2=进行中 3=无数据
        load: 1,

        // 瀑布流图片显示间隔时间
        throttleInterval: 100,

        // 图片预加载
        preloadImages: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideTabBar()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const { listStart, listSize } = this.data

        this.getListData({
            start: listStart,
            size: listSize,
        })
    },

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
    onPullDownRefresh: function() {
        this.setData({
            pageHD: true,
            psStatus: true,
        })
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        const { listStart, listSize } = this.data

        this.getListData({
            start: listStart + listSize,
            size: listSize,
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},

    /**
     * 页面滚动触发事件的处理函数
     */
    onPageScroll: function(e) {
        const { psStatus } = this.data

        if (e.scrollTop >= 50 && psStatus) {
            wx.pageScrollTo({
                scrollTop: e.scrollTop - 50,
                duration: 300,
            })
            this.setData({
                pageHD: false,
                psStatus: false,
            })
        }
    },

    /**
     * 通过ID来获取元素
     */
    querySelectorAll: function(target) {
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery().selectAll(target).boundingClientRect(res => resolve(res)).exec()
        })
    },

    /**
     * 处理瀑布流效果
     */
    waterfall: function(target, data) {
        const { list, preloadImages, throttleInterval } = this.data

        // 节流函数
        const throttle = (s) => {
            for (let i = s; i < data.length; i++) {
                this.querySelectorAll(target).then(rects => {
                    const minHeight = Math.min(...rects.map(item => item.height))
                    const minIndex = rects.findIndex(item => item.height === minHeight)

                    list[minIndex].push(data[i])

                    this.setData({
                        ['list['+ minIndex +']']: list[minIndex]
                    })

                    if (i === (preloadImages.length - 1)) {
                        this.setData({
                            preloadImages: [],
                            load: 1
                        })
                    }

                    setTimeout(() => throttle(++s), throttleInterval)
                })
                break
            }
        }

        this.imageLoaded = function() {
            let counter = 1
            return function() {
                if (counter === preloadImages.length) {
                    throttle(0)
                }
                return counter += 1
            }
        }()
    },

    /**
     * 获取列表数据
     */
    getListData: function({start, size}) {
        const { load } = this.data

        if (load !== 1) {
            return false
        }

        wx.request({
            url: service.evidenceUrl,
            method: 'GET',
            data: {
                selected: ['id', 'post_title', 'post_thumbnail', 'post_imagesCount', 'post_imagesType'],
                start: start,
                size: size,
            },
            success: (res) => {
                let data = res.data.data || []

                data = data.map(item => Object.assign(item, {
                    post_imagesHasGif: JSON.parse(item.post_imagesType).some(e => e === 'gif')
                }))

                if (data.length) {
                    this.setData({
                        onShow: true,
                        listStart: start,
                        listSize: size,
                        preloadImages: data.map(item => item.post_thumbnail),
                    }, _ => {
                        wx.showTabBar()
                        this.waterfall('.waterfall-col', data)
                    })
                }
                else {
                    this.setData({ load: 3 })
                }
            },
            fail: (err) => {
                this.setData({ load: 3 })
            }
        })

        this.setData({ load: 2 })
    },
})