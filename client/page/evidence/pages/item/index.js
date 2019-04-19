const { service } = require('../../../../config')
const wemark = require('../../../../vendor/wemark/wemark')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail: {},
        wemark: {},
        wemarkHasValue: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getDetailData(options.id)
        this.putPV(options.id)
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
     * 通过 ID 查询 evidence 详情
     */
    getDetailData: function(id) {
        wx.request({
            url: service.evidenceUrl + '/' + id,
            method: 'GET',
            success: (res) => {
                const data = res.data.data[0]

                wemark.parse(data.post_content, this)

                wx.setNavigationBarTitle({
                    title: data.post_title
                })

                this.setData({
                    detail: Object.assign(data, {
                        post_images: JSON.parse(data.post_images)
                    }),
                    wemarkHasValue: data.post_content !== null ? true : false,
                })
            }
        })
    },

    putPV: function(id) {
        wx.request({
            url: service.evidenceUrl + '/' + id,
            method: 'PUT',
            data: {
                visits: 1
            }
        })
    },

    /**
     * 预览图片
     */
    previewImage: function(e) {
        wx.previewImage({
            current: e.target.dataset.src,
            urls: this.data.detail.post_images
        })
    }
})