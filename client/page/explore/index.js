const { service } = require('../../config')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hot: [
            { imageSrc: 'https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/0.jpg', linkUrl: '/page/explore/pages/toplist/index?id=1&type=1', label: '24H热门' },
            { imageSrc: 'https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/0.jpg', linkUrl: '/page/explore/pages/toplist/index?id=2&type=2', label: '周榜' },
            { imageSrc: 'https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/0.jpg', linkUrl: '/page/explore/pages/toplist/index?id=3&type=3', label: '月榜' },
        ],
        top: [{
            title: '一周排行榜',
            list: [
                { linkUrl: '/page/evidence/pages/item/index?id=1', label: 'koa.js 中使用 knex.js 问题' },
                { linkUrl: '/page/evidence/pages/item/index?id=2', label: 'dev是什么？' },
                { linkUrl: '/page/evidence/pages/item/index?id=3', label: 'MaHua是什么?' },
                { linkUrl: '/page/evidence/pages/item/index?id=4', label: 'Markdown是什么？' },
                { linkUrl: '/page/evidence/pages/item/index?id=4', label: 'Markdown是什么？' },
            ]
        }, {
            title: '一月排行榜',
            list: [
                { linkUrl: '/page/evidence/pages/item/index?id=1', label: 'koa.js 中使用 knex.js 问题' },
                { linkUrl: '/page/evidence/pages/item/index?id=2', label: 'dev是什么？' },
                { linkUrl: '/page/evidence/pages/item/index?id=3', label: 'MaHua是什么?' },
                { linkUrl: '/page/evidence/pages/item/index?id=4', label: 'Markdown是什么？' },
                { linkUrl: '/page/evidence/pages/item/index?id=4', label: 'Markdown是什么？' },
            ]
        }, {
            title: '一年排行榜',
            list: [
                { linkUrl: '/page/evidence/pages/item/index?id=1', label: 'koa.js 中使用 knex.js 问题' },
                { linkUrl: '/page/evidence/pages/item/index?id=2', label: 'dev是什么？' },
                { linkUrl: '/page/evidence/pages/item/index?id=3', label: 'MaHua是什么?' },
                { linkUrl: '/page/evidence/pages/item/index?id=4', label: 'Markdown是什么？' },
                { linkUrl: '/page/evidence/pages/item/index?id=4', label: 'Markdown是什么？' },
            ]
        }],
        topActiveKey: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getVisvitPage()
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
     * 处理 top Change 事件
     */
    handleChangeSwiperTop: function(e) {
        const { current } = e.detail
        this.setData({
            topActiveKey: current,
        })
    },

    /**
     * 访问页面
     */
    getVisvitPage: function() {
        // wx.request({
        //     url: service.visvitPageUrl,
        //     method: 'POST',
        //     // data: {
        //     //     begin_date: '20180426',
        //     //     end_date: '20180426'
        //     // },
        //     success: (res) => {
        //         console.log(res)
        //     }
        // })
    },
})