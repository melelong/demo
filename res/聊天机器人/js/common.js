// 公用方法
// 获取dom
const $ = (selector) => document.querySelector(selector);
const $All = (selector) => document.querySelectorAll(selector);
// 创建元素
const cTag = (tagName) => document.querySelector(tagName);
// 防抖
const fd = (fn, delay) => {
  let timeId;
  return (...args) => {
    timeId && clearTimeout(timeId);
    setTimeout(() => fn(...args), delay);
  };
};
