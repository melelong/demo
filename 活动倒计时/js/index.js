// 使用匿名立即执行函数
var test = (function () {
  // 封装获取DOM方法
  function $(selector) {
    return document.querySelector(selector);
  }
  function $All(selector) {
    return document.querySelectorAll(selector);
  }
  // 获取dom
  var doms = {
    hour1: $All(".time-item")[0],
    hour2: $All(".time-item")[1],
    minute1: $All(".time-item")[2],
    minute2: $All(".time-item")[3],
    second1: $All(".time-item")[4],
    second2: $All(".time-item")[5],
  };
  // 获取高度
  var liHeight = $(".time-item").clientHeight;
  // 创建Dom
  function createDoms() {
    function createTimes(num1, num2, node1, node2) {
      var ul1 = document.createElement("ul");
      for (var i = num1; i >= 0; i--) {
        ul1.innerHTML += `<li style="height:${liHeight}px;"><img src="./images/${i}.png"></li>`;
      }
      var ul2 = document.createElement("ul");
      for (var i = num2; i >= 0; i--) {
        ul2.innerHTML += `<li style="height:${liHeight}px;"><img src="./images/${i}.png"></li>`;
      }
      node1.appendChild(ul1);
      node2.appendChild(ul2);
    }
    // 创建时
    createTimes(2, 3, doms.hour1, doms.hour2);
    // 创建分
    createTimes(5, 9, doms.minute1, doms.minute2);
    // 创建秒
    createTimes(5, 9, doms.second1, doms.second2);
  }
  createDoms();
  // 动画
  function changeTimes(node, timer) {
    var times = setInterval(function () {
      var firstLi = node.children[0];
      node.style.transition = "all .5s linear";
      node.style.marginTop = "-" + liHeight + "px";
      node.addEventListener("transitionend", function () {
        node.style.transition = "none";
        node.style.marginTop = "0px";
        node.appendChild(firstLi);
      });
    }, timer);
  }
  // 初始化
  function init() {
    changeTimes(doms.second2.querySelector("ul"), 1000);
    changeTimes(doms.second1.querySelector("ul"), 10000);
    changeTimes(doms.minute2.querySelector("ul"), 60000);
    changeTimes(doms.minute1.querySelector("ul"), 600000);
    changeTimes(doms.hour2.querySelector("ul"), 3600000);
    changeTimes(doms.hour1.querySelector("ul"), 10800000);
  }
  init();
  // return { init };
})();
