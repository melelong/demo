var test = (function () {
  function createPages(page, pageNumber, mostNumber, container) {
    // 判断page参数是否正确
    if (page < 1 || page > pageNumber) {
      return;
    }
    // 清空容器
    container.innerHTML = "";
    // 创建一个小容器
    var div = document.createElement("div");
    div.className = "pages";
    /**
     * 创建a标签
     * @param {*} className 类名
     * @param {*} text 文本
     * @param {*} newPage 页面
     */
    function createAnchor(className, text, newPage) {
      // 创建a元素
      var a = document.createElement("a");
      a.innerHTML = text;
      a.className = className;
      div.appendChild(a);
      // 判断一下类名是禁用或者是否为当前页面
      if (className === "disabled" || newPage === page) {
        return;
      }
      // 绑定点击事件
      a.onclick = function () {
        // if (newPage < 1 || newPage > pageNumber || newPage === page) {
        //   return;
        // }
        createPages(newPage, pageNumber, mostNumber, container);
      };
    }
    // 创建首页和上一页
    // 判断是否为第一页,是就赋予禁用类名
    createAnchor(page === 1 ? "disabled" : "", "首页", 1);
    createAnchor(page === 1 ? "disabled" : "", "上一页", page - 1);
    // if (page === 1) {
    //   createAnchor("disabled", "首页", 1);
    //   createAnchor("disabled", "上一页", page - 1);
    // } else {
    //   createAnchor("", "首页", 1);
    //   createAnchor("", "上一页", page - 1);
    // }
    // 中间的a标签
    var min = Math.floor(page - mostNumber / 2);
    min < 1 && (min = 1);
    var max = Math.floor(min + mostNumber - 1);
    max > pageNumber && (max = pageNumber);
    for (var i = min; i <= max; i++) {
      createAnchor(i === page ? "active" : "", i, i);
    }
    // 创建首页和下一页
    // 判断是否为最后一页,是就赋予禁用类名
    createAnchor(page === pageNumber ? "disabled" : "", "下一页", page + 1);
    createAnchor(page === pageNumber ? "disabled" : "", "尾页", pageNumber);
    // if (page === pageNumber) {
    //   createAnchor("disabled", "下一页", page + 1);
    //   createAnchor("disabled", "尾页", pageNumber);
    // } else {
    //   createAnchor("", "下一页", page + 1);
    //   createAnchor("", "尾页", pageNumber);
    // }
    /**
     * 创建span页数
     */
    function createSpan() {
      var span = document.createElement("span");
      span.innerHTML = page + "/" + pageNumber;
      div.appendChild(span);
      container.appendChild(div);
    }
    createSpan();
  }
  return {
    createPages,
  };
})();
