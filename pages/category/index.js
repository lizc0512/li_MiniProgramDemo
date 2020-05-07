// 0 引入 用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //被点击的左侧的菜单
    currentIndex: 0,
    //右侧内容的滚动条-距离顶部的距离
    scrollTop: 0

  },
  //接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.先判断本地存储中有无旧数据  {tiem:Date.new(),data:[] }
    // 2.无，则请求  ；有，且旧数据没有过期，则使用本地存储中的旧数据

    //1.先获取本地存储中的数据
    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      //不存在  发送请求获取数据
      this.getCates();
    } else {
      //有旧数据 
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  //获取分类数据
  async getCates () {
    // request({
    //   url: "/categories"
    // })
    //   .then(res => {
    //     // 把接口数据存在本地存储中
    //     this.Cates = res.data.message;
    //     wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
    //     //构建左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     //构造右侧的商品数据
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })
    //1.使用es7的async await 来发送请求
    const res = await request({ url: "/categories" })
    this.Cates = res;
    // 把接口数据存在本地存储中
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    //构建左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  //左侧菜单的点击事件
  handleItemTap: function (e) {
    // 获取被点击标题身上的索引
    // 给data中的currentIndex赋值就可以了
    // 根据不同的索引来渲染右侧的商品内容
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    //重新设置右侧内容距离顶部的距离
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})