// 创建匿名立即执行函数
var test = (function () {
  var imgs = [];
  /**
   * 创建图片数据
   */
  function createData() {
    for (var i = 0; i <= 40; i++) {
      imgs.push("./img/" + i + ".jpg");
    }
  }
  createData();
  /**
   * 创建图片,并且对图片的位置进行归位
   * @param {*} datas 图片数据
   */
  var container = document.querySelector(".container"); // 获取Dom
  function createImg(data) {
    for (var i = 0; i < data.length; i++) {
      var src = data[i]; // 获取图片地址
      var img = document.createElement("img"); // 创建img元素
      img.src = src; // 设置img元素的src
      img.style.width = imgWidth + "px"; // 设置img元素的img
      container.appendChild(img); // 把img元素加入容器中
      img.addEventListener("load", setLayout);
    }
  }
  /**
   * 获取数组最大值
   * @param {*} arr
   */
  function getMax(arr) {
    // var max = arr[0];
    // for (var i = 1; i < arr.length; i++) {
    //   arr[i] > max && (max = arr[i]);
    // }
    // return max;
    return Math.max.apply(null, arr);
  }
  /**
   * 获取数组最小值
   * @param {*} arr
   */
  function getMin(arr) {
    var min = arr[0];
    for (var i = 1; i < arr.length; i++) {
      arr[i] < min && (min = arr[i]);
    }
    return min;
    // return Math.min.apply(null, arr);
  }
  /**
   * 计算列数和间隙空间
   */
  var imgWidth = 220; // 图片宽度
  function cal() {
    var containerWidth = container.clientWidth; // 容器宽度
    var columns = Math.floor(containerWidth / imgWidth); // 列数
    var clearanceNum = columns + 1; // 间隙数
    var totalClearance = containerWidth - columns * imgWidth; // 总间隙
    var clearance = totalClearance / clearanceNum; // 每个间隙空间
    return {
      clearance, // 每个间隙空间
      columns, // 列数
    };
  }
  // 设置每个图片位置
  function setLayout() {
    var info = cal(); // 获取每个间隙空间和列数
    var arr = new Array(info.columns); // 创建一个数组长度为列数
    arr.fill(info.clearance); //填充数组
    for (var i = 0; i < container.children.length; i++) {
      var img = container.children[i];
      var minTop = getMin(arr); // 获取图片最小高度
      img.style.top = minTop + "px"; // 设置图片最小高度
      var index = arr.indexOf(minTop); // 获取最小高度在数组里的下标
      // 新高度 = 图片高度 + 间隙高度
      arr[index] += img.clientHeight + info.clearance; // 改变原来数组最小高度的值
      var left = (index + 1) * info.clearance + index * imgWidth;
      img.style.left = left + "px"; // 设置图片最小高度
    }
    container.style.height = getMax(arr) + "px";
  }
  /**
   * 防抖
   * @param {*} fn 需要防抖的函数
   * @param {*} delay 防抖时间
   * @returns
   */
  function antiShake(fn, delay) {
    var timerId;
    var ags = Array.prototype.slice.call(arguments);
    return function () {
      timerId && clearTimeout(timerId);
      timerId = setTimeout(function () {
        fn.apply(this, ags);
      }, delay);
    };
  }
  /**
   * 初始化
   */
  function init() {
    createImg(imgs);
    initEvents();
  }
  /**
   * 初始化绑定事件
   */
  function initEvents() {
    window.addEventListener("resize", antiShake(setLayout, 500));
  }
  init();
  return {
    init,
  };
})();
