var test = (function () {
  function $(selector) {
    return document.querySelector(selector);
  }
  function $All(selector) {
    return document.querySelectorAll(selector);
  }
  var datas = [
    "./img/Wallpaper1.jpg",
    "./img/Wallpaper2.jpg",
    "./img/Wallpaper3.jpg",
    "./img/Wallpaper4.jpg",
    "./img/Wallpaper5.jpg",
  ];
  var doms = {
    container: $(".carousel-container"),
    left: $(".arrow .arrow-left"),
    right: $(".arrow .arrow-right"),
    list: $(".carousel-list"),
    indicator: $(".indicator"),
  };
  // 初始化
  function init() {
    // 创建元素
    function _createDoms(doms, datas) {
      // 设置容器宽度
      doms.list.style.width = datas.length + 1 + "00%";
      // 循环创建元素
      var listText = "";
      var itemText = "";
      for (var i = 0; i < datas.length; i++) {
        listText += '<a href="#"><img src="' + datas[i] + '" alt=""></a>';
        itemText += '<div class="indicator-item"></div>';
      }
      listText += '<a href="#"><img src="' + datas[0] + '" alt=""></a>';
      doms.list.innerHTML = listText;
      doms.indicator.innerHTML = itemText;
      checkActive();
    }
    _createDoms(doms, datas);
    initEvents();
    autoStart();
  }
  var containerWidth = doms.container.clientWidth;
  var curIndex = 0;
  var totalTime = 1000; // 动画总时间
  var duration = 15; // 间隔时间
  var isPlaying = false;
  function moveTo(newIndex, onend) {
    if (isPlaying || newIndex === curIndex) {
      return;
    }
    isPlaying = true;
    var from = parseFloat(doms.list.style.left) || 0;
    var to = -newIndex * containerWidth;
    createAnimation({
      from: from,
      to: to,
      totalTime: totalTime,
      duration: duration,
      onmove: function (n) {
        doms.list.style.left = n + "px";
      },
      onend: function () {
        isPlaying = false;
        onend && onend();
      },
    });
    curIndex = newIndex;
    checkActive();
  }
  var state = true;
  function next() {
    state = true;
    var newIndex = curIndex + 1;
    var onend;
    if (newIndex === datas.length) {
      onend = function () {
        doms.list.style.left = 0;
        curIndex = 0;
      };
    }
    moveTo(newIndex, onend);
  }
  function prev() {
    state = false;
    var newIndex = curIndex - 1;
    if (newIndex < 0) {
      doms.list.style.left = -datas.length * containerWidth + "px";
      newIndex = datas.length - 1;
    }
    moveTo(newIndex);
  }
  var delay = 2000;
  var timerId;
  function autoStart() {
    if (timerId) return;
    timerId = setInterval(state ? next : prev, delay);
  }
  function autoStop() {
    clearInterval(timerId);
    timerId = null;
  }
  // 事件绑定
  function initEvents() {
    doms.left.addEventListener("click", prev);
    doms.right.addEventListener("click", next);
    doms.indicator.addEventListener("click", function (e) {
      var tar = e.target;
      if (tar.className.includes("indicator-item")) {
        var index = Array.prototype.slice.call(this.children).indexOf(tar);
        moveTo(index);
      }
    });
    doms.container.addEventListener("mouseenter", autoStop);
    doms.container.addEventListener("mouseleave", autoStart);
  }
  // 判断激活
  function checkActive() {
    curIndex > datas.length - 1 && (curIndex = 0);
    $(".active") && ($(".active").className = "indicator-item");
    var items = Array.prototype.slice.call($All(".indicator-item"));
    $All(".indicator-item")[curIndex].className = "indicator-item active";
  }
  init();
  return {
    doms,
    curIndex,
    moveTo,
    next,
    prev,
    autoStart,
    autoStop,
  };
})();
