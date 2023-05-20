var test = (function () {
  // 模拟数据
  var datas = [
    {
      title: "菜单1",
      children: ["菜单1", "菜单2", "菜单3", "菜单4"],
    },
    {
      title: "菜单2",
      children: ["菜单1", "菜单2", "菜单3", "菜单4"],
    },
    {
      title: "菜单3",
      children: ["菜单1", "菜单2", "菜单3", "菜单4"],
    },
    {
      title: "菜单4",
      children: ["菜单1", "菜单2", "菜单3", "菜单4", "菜单5", "菜单6"],
    },
  ];
  var container = document.querySelector(".menu-container");
  /**
   *  根据模拟数据创建Dom
   * @param {*} datas
   */
  function createDom(datas) {
    if (!datas.length) return;
    for (var i = 0; i < datas.length; i++) {
      var li = document.createElement("li");
      var h2 = document.createElement("h2");
      var ul = document.createElement("ul");
      li.className = "menu";
      h2.innerHTML = datas[i].title;
      li.appendChild(h2);
      ul.className = "submenu";
      ul.setAttribute("status", "closed");
      //循环创建子菜单里的li
      for (var j = 0; j < datas[i].children.length; j++) {
        var subLi = document.createElement("li");
        subLi.innerHTML = datas[i].children[j];
        ul.appendChild(subLi);
        li.appendChild(ul);
      }
      container.appendChild(li);
    }
  }
  /**
   *  初始化
   */
  function init() {
    createDom(datas);
  }
  init();
  /**
   * 打开子菜单
   */
  var itemHeight = document.querySelector(".submenu li").clientHeight; // 每个子菜单的高度
  var totalTime = 200; // 动画总时间
  var duration = 10; // 间隔时间
  function openSubmenu(subMenu) {
    // 子菜单是有状态(关闭，打开，正在播放动画)
    // 通过自定义属性status,判断状态
    var status = subMenu.getAttribute("status");
    if (status !== "closed" && status) return;
    // 将子菜单的高度从0变到(子项数量*itemHeight)
    subMenu.setAttribute("status", "playing");
    createAnimation({
      from: 0,
      to: itemHeight * subMenu.children.length,
      totalTime: totalTime,
      duration: duration,
      onMove: function (n) {
        subMenu.style.height = n + "px";
      },
      onEnd: function () {
        subMenu.setAttribute("status", "opened");
      },
    });
  }
  /**
   * 关闭子菜单
   */
  function closeSubmenu(subMenu) {
    // 子菜单是有状态(关闭，打开，正在播放动画)
    // 通过自定义属性status,判断状态
    var status = subMenu.getAttribute("status");
    if (status !== "opened" && status) return;
    // 将子菜单的高度从0变到(子项数量*itemHeight)
    subMenu.setAttribute("status", "playing");
    createAnimation({
      from: itemHeight * subMenu.children.length,
      to: 0,
      totalTime: totalTime,
      duration: duration,
      onMove: function (n) {
        subMenu.style.height = n + "px";
      },
      onEnd: function () {
        subMenu.setAttribute("status", "closed");
      },
    });
  }
  /**
   * 切换子菜单
   */
  function toggle(subMenu) {
    var status = subMenu.getAttribute("status");
    if (status === "playing") {
      return;
    } else if (status === "opened") {
      closeSubmenu(subMenu);
    } else {
      openSubmenu(subMenu);
    }
  }
  // 绑定事件，使用事件委托
  container.addEventListener("click", function (e) {
    if (e.target.tagName !== "H2") return;
    var beforeOpened = document.querySelector(".submenu[status=opened]");
    beforeOpened && closeSubmenu(beforeOpened);
    toggle(e.target.nextElementSibling);
  });
  var testMenu = container.children[0].children[1];
  return {
    init,
    openSubmenu,
    closeSubmenu,
    testMenu,
  };
})();
