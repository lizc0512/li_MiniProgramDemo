"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showToast = exports.showModal = exports.openSetting = exports.chooseAddress = exports.getSetting = void 0;

// promiss 形式 getSetting
var getSetting = function getSetting() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: function success(result) {
        resolve(result);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}; // promiss 形式 chooseAddress


exports.getSetting = getSetting;

var chooseAddress = function chooseAddress() {
  return new Promise(function (resolve, reject) {
    wx.chooseAddress({
      success: function success(result) {
        resolve(result);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}; // promiss 形式 openSetting


exports.chooseAddress = chooseAddress;

var openSetting = function openSetting() {
  return new Promise(function (resolve, reject) {
    wx.openSetting({
      success: function success(result) {
        resolve(result);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}; // promiss 形式 showModal


exports.openSetting = openSetting;

var showModal = function showModal(_ref) {
  var content = _ref.content;
  return new Promise(function (resolve, reject) {
    wx.showModal({
      title: '提示',
      content: content,
      success: function success(res) {
        if (res.confirm) {
          resolve(res);
        }
      },
      fail: function fail(res) {
        reject(res);
      }
    });
  });
}; // promiss 形式 showToast


exports.showModal = showModal;

var showToast = function showToast(_ref2) {
  var title = _ref2.title;
  return new Promise(function (resolve, reject) {
    wx.showToast({
      title: title,
      icon: 'none',
      success: function success(res) {
        if (res.confirm) {
          resolve(res);
        }
      },
      fail: function fail(res) {
        reject(res);
      }
    });
  });
};

exports.showToast = showToast;