// 匿名立即执行函数
var test = (function () {
  // 封装获取DOM的方法
  function $(selector) {
    return document.querySelector(selector);
  }
  function $All(selector) {
    return document.querySelectorAll(selector);
  }
  // 数据整合
  var dataList = {
    province,
    city,
    allschool,
  };
  // 获取需要用到的DOM
  var doms = {
    province: $("#province"),
    city: $("#city"),
    school: $("#school"),
  };
  /**
   *  渲染
   * @param {*} data 需要渲染的数据
   * @param {*} content 渲染容器
   * @returns
   */
  function createList(data, content) {
    // 数据没有或者没有容器就退出
    if (!data || !content) {
      return;
    }
    // 判断渲染容器是否为第一级，不是就清空内容
    content.id !== "province" && (content.innerHTML = "");
    for (var key in data) {
      var option = document.createElement("option");
      option.value = key;
      option.innerHTML = data[key];
      content.appendChild(option);
    }
  }
  // 获取信息
  function getInfo() {
    return {
      province: doms.province.value,
      city: doms.city.value,
      school: doms.school.value,
    };
  }
  // 初始化
  function init() {
    createList(dataList.province, doms.province);
    initEvents();
  }
  // 初始化事件绑定
  function initEvents() {
    doms.province.addEventListener("change", function (e) {
      if(doms.province.value === "0000"){
        doms.city.innerHTML = '';
        doms.school.innerHTML = '';
      }
      createList(dataList.city[this.value], doms.city);
      createList(dataList.allschool[doms.city.value], doms.school);
      console.log(getInfo());
    });
    doms.city.addEventListener("change", function (e) {
      createList(dataList.allschool[this.value], doms.school);
      console.log(getInfo());
    });
    doms.school.addEventListener("change", function (e) {
      console.log(getInfo());
    });
  }
  init();
  return {
    init,
    getInfo,
  };
})();
