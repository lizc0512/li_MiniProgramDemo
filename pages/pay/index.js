// 1 从缓存中获取购物车数据，渲染到页面中
// 这些数据checked=true
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow: function () {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    this.setData({ address });

    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {

      totalPrice += v.num * v.goods_price;
      totalNum += v.num;

    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });

  },
  // 点击支付
  async handleOrderPay() {

    try {
      // 1.判断缓存中是否有token
      const token = wx.getStorageSync('token');
      // 2判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return;
      }
      // 3.创建订单

      // 3.2 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.goods_number,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, cart, goods };
      // 4 准备发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      // 5 发起 预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      // 6.发起微信支付
      await requestPayment(pay);
      // 7.查询后台 订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      await showToast({ title: "支付成功" })
      // 8 手动删除缓存中 已支付了的商品
      let newCar=wx.getStorageSync('cart');
      newCar=newCar.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCar)
      // 8.支付成功，跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (error) {
      await showToast({ title: "支付成功" })
      console.log(error);

    }
  }
})