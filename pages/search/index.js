import {
    request
} from "../../request/index.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        // 取消按钮是否显示
        isFoucus: false,
        // 输入框的值
        inpValue: ""
    },
    TimeId: -1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    // 输入框的值改变，就会触发的事件
    handleInput(e) {
        // 获取输入框的值
        const { value } = e.detail;
        // 检测合法性
        if (!value.trim()) {
            // 值不合法
            this.setData({
                isFoucus: false,
                goods: []
            })
            return;
        }
        // 准备发送请求，获取数据
        this.setData({
            isFoucus: true
        })
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {

            this.qsearch(value);
        }, 1000);

    },
    // 发送请求，获取搜索建议，数据
    async qsearch(query) {
        const res = await request({ url: "/goods/search", data: { query } });
        console.log(res);
        this.setData({
            goods: res.goods
        })

    },
    // 点击取消按钮
    handleCancle() {
        this.setData({
            inpValue: "",
            isFoucus: false,
            goods: []

        })
    }
})