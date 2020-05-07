// 0 引入 用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList: [],
    //导航 数组
    catesList: [],
    //楼层数据
    floorList: [],
    floorItemList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图数据的方法
  getSwiperList() {
    //1.发送异步请求来获取轮播图数据 优化的手段可以通过es6的技术promise来解决这个问题
    // wx-wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   complete: (res) => {},
    //   // data: data,
    //   // header: header,
    //   dataType: 'json',
    //   method: 'GET',
    //   responseType: 'text',
    //   fail: (res) => {},
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // })
    request({ url: "/home/swiperdata" })
      .then(result => {
        const res = result;
        res.forEach(v => v.navigator_url = v.navigator_url.replace('main', 'index'));
        this.setData({
          swiperList: res
        })
      })
  },

  //获取 分类导航数据
  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  //获取 楼层数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        console.log(result);
        // res.forEach(v => v.navigator_url = v.navigator_url.replace('goods_list', 'goods_list/goods_list'));
        this.setData({
          floorList: result,

        })
      })
  },

})