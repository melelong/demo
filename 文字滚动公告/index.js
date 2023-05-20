var test = (function () {
  // 列表数据
  var datas = [
    "把大象装冰箱总共分几步？",
    "1.邓哥打开冰箱门",
    "2.邓哥把大象放进去",
    "3.邓哥关上冰箱门",
  ];
  /**
   * 创建li加入ul中
   * @param {*} datas
   */
  var ul = document.querySelector(".list");
  function createLi(datas) {
    // 判断数据长度
    if (!datas.length) return;
    // 循环创建li加入ul中
    for (var i = 0; i < datas.length; i++) {
      var li = document.createElement("li");
      li.innerHTML = datas[i];
      ul.appendChild(li);
    }
    // 克隆第一个li元素加入ul中
    // var firstItem = ul.children[0];
    // var newItem = firstItem.cloneNode(true);
    // ul.appendChild(newItem);
    // 创建第一个li元素加入ul中
    // var li = document.createElement("li");
    // li.innerHTML = datas[0];
    // ul.appendChild(li);
    ul.appendChild(ul.children[0].cloneNode(true));
  }
  /**
   * 滚动动画
   */
  var totalTime = 300; // 总时间
  var interval = 10; // 间隔时间
  var index = 0;
  var moveHeight = ul.clientHeight;
  function moveNext() {
    var from = index * moveHeight; // 开始高度
    index++;
    var to = index * moveHeight; // 下一项高度
    var num = totalTime / interval; // 变化次数
    var dis = (to - from) / num; // 每次变化的距离
    var timerId = setInterval(function () {
      from += dis;
      if (from >= to) {
        clearInterval(timerId);
        if (index === ul.children.length - 1) {
          from = 0;
          index = 0;
        }
      }
      ul.scrollTop = from;
    }, interval);
  }
  /**
   * 开始
   */
  var timerId;
  var time = 2000;
  function start() {
    if (timerId) return;
    timerId = setInterval(moveNext, time);
  }
  /**
   * 停止
   */
  function stop() {
    clearInterval(timerId);
    timerId = null;
  }
  /**
   *  初始化
   */
  function init() {
    createLi(datas);
    start();
  }
  init();
  ul.addEventListener("mouseenter", stop);
  ul.addEventListener("mouseleave", start);
  return {
    init,
    start,
    stop,
    moveNext,
  };
})();
