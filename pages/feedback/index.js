import {
    request
} from "../../request/index.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 0,
            value: "体验问题",
            isActive: true
        },
        {
            id: 1,
            value: "商品、商家投诉",
            isActive: false
        }
        ],
        // 被选中的图片路径 数组
        chooseImgs: [],
        // 文本域的内容
        textVal: ""
    },
    // 外网的图片的路径数组
    UpLoadImgs: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    // 标题的点击事件
    handleTabsItemChange(e) {
        // 获取被点击的标题索引
        const {
            index
        } = e.detail;
        //修改源数组
        let {
            tabs
        } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        // 赋值到data中
        this.setData({
            tabs
        })
    },
    // 点击“+” 选择图片
    handleChooseImg() {
        // 调用小程序内置的选择图片API
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (result) => {
                this.setData({
                    //    图片数组  进行拼接
                    chooseImgs: [...this.data.chooseImgs, ...result.tempFiles]
                })

            },
            fail: (res) => { },
            complete: (res) => { }
        })
    },
    // 点击自定义图片组件
    handleRemoveImg(e) {
        // 获取被点击的组件的索引
        const { index } = e.currentTarget.dataset;
        // 获取 data中的图片数组
        let { chooseImgs } = this.data;
        // 删除元素
        chooseImgs.splice(index, 1);
        this.setData({
            chooseImgs
        })
    },
    // 文本域的输入事件
    handleTextInput(e) {
        this.setData({
            textVal: e.detail.value
        })
    },
    // 提交按钮的点击
    handleFormSubmit() {
        // 获取文本域的内容
        const { textVal, chooseImgs } = this.data;
        // 合法性的验证
        if (!textVal.trim()) {
            // 不合法
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true
            })
            return;
        }
        // 准备上传图片 到专门的图片服务器
        // 上传文件的api 不支持多个文件同时上传 遍历数组 挨个上传
        wx.showLoading({
            title: '正在上传中',
            mask: true

        })
        // 判断有没有需要上传的图片数组
        if (chooseImgs.length != 0) {
            chooseImgs.forEach((v, i) => {
                wx.uploadFile({
                    // 被上传的文件的路径
                    filePath: v.path,
                    //   上传的文件的名称 后台来获取文件 file
                    name: 'image',
                    //   图片要上传到哪里
                    url: 'https://images.ac.cn/api/upload/upload?apiType=ali&token=e6ca35eb37825da48546f8f58b09',
                    //   顺带的文本信息
                    formData: {},
                    success: (result) => {
                        console.log(result);
                        let url = JSON.parse(result.data);
                        this.UpLoadImgs.push(url);
                        console.log(2 + this.UpLoadImgs);
                        //    所有的图片都上传完毕了才触发  
                        if (i === chooseImgs.length - 1) {
                            wx.hideLoading();
                            console.log("把内容都提交到后台");
                            // 提交成功了  重置页面
                            this.setData({
                                textVal: "",
                                chooseImgs: []
                            })
                            // 返回上一个页面
                            wx.navigateBack({
                                delta: 1

                            })
                        }
                    },

                })
            })
        } else {
            wx.hideLoading({
                complete: (res) => { },
            })
            console.log("只提交了文本");
            wx.navigateBack({
                delta: 1
            })

        }

    }
})