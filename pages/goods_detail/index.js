import {
    request
} from "../../request/index.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        // 商品是否被收藏过
        isCollect: false
    },
    // 商品对象
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let options = currentPage.options;

        const {
            goods_id
        } = options;
        this.getGoodsDetail(goods_id);

    },
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({
            url: "/goods/detail",
            data: {
                goods_id
            }
        });
        this.GoodsInfo = goodsObj;

        // 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || [];
        // 当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                // ios手机不支持webp格式
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics
            },
            isCollect
        })


    },
    // 点击轮播图，放大预览
    handlePrevewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
            // 接受传递过的图片url
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            urls: urls,
            current: current
        })

    },
    handleCartAdd() {
        //  获取缓存中的购物车数组
        let cart = wx.getStorageSync("cart") || [];
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index === -1) {
            // 第一次添加
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo);
        } else {
            // 已经存在
            cart[index].num++;
        }
        // 把购物车添加为回缓存中
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            // 防止用户疯狂点击按钮，等1.5秒以后才可以点
            mask: true
        })

    },
    // 点击商品收藏图标
    handleCollect() {
        let isCollect = false;
        // 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || [];
        // 判断商品是否被收藏过
        let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        // 当index ！=-1 已经收藏过了
        if (index !== -1) {
            // 能找到 已经收藏过了，在数组中删除该商品
            collect.splice(index, 1);
            isCollect = false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true
            })
        } else {
            // 没有收藏过
            collect.push(this.GoodsInfo);
            isCollect = true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true
            })
        }
        // 4 把数组存入到缓存中
        wx.setStorageSync("collect", collect);
        // 5 修改data中的属性  isCollect
        this.setData({
            isCollect
        })


    }
})