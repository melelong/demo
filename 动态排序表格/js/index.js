// 创建一个匿名立即执行函数，规定我们自己的代码作用域
var test = (function () {
  // 封装获取dom方法
  function $(selector) {
    return document.querySelector(selector);
  }
  function $All(selector) {
    return document.querySelectorAll(selector);
  }
  // 模拟数据
  var datas = [
    {
      header: ["编号", "姓名", "年龄", "职位"],
      body: [
        {
          id: "3",
          name: "王同学",
          age: "24",
          work: "C++程序员",
        },
        {
          id: "5",
          name: "张同学",
          age: "24",
          work: "WEB前端",
        },
        {
          id: "22",
          name: "玛丽",
          age: "30",
          work: "测试员",
        },
        {
          id: "6",
          name: "艾伦",
          age: "21",
          work: "交互设计师",
        },
        {
          id: "17",
          name: "小明同学",
          age: "28",
          work: "PHP工程师",
        },
      ],
    },
  ];
  /**
   * 创建表格
   * @param {*} datas
   */
  var table = $(".table-container");
  var createTable = function (datas, container) {
    var header = datas[0].header; // 获取表头数据
    var body = datas[0].body; // 获取表体数据
    // 创建表头函数
    function createHeader() {
      var thead = document.createElement("thead");
      var tr = document.createElement("tr");
      for (var i = 0; i <= header.length; i++) {
        var th = document.createElement("th");
        i === 0
          ? (th.innerHTML = '<input type="checkbox" class="checkAll">')
          : (th.innerHTML = header[i - 1]);
        (function (i) {
          th.onclick = function (e) {
            if (i === 0) return;
            thClick(i);
          };
        })(i);
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      container.appendChild(thead);
    }
    createHeader();
    // 创建表体函数
    function createBody() {
      var tbody = document.createElement("tbody");
      for (var i = 0; i < body.length; i++) {
        var tr = document.createElement("tr");
        var text = '<td><input type="checkbox"></td>';
        for (var key in body[i]) {
          text += "<td>" + body[i][key] + "</td>";
        }
        tr.innerHTML = text;
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
    }
    createBody();
  };
  createTable(datas, table);
  /**
   * 初始化
   */
  var init = function () {
    initEvents();
  };
  /**
   * 绑定事件函数
   */
  var checkAll = $(".checkAll");
  var tableContainer = $(".table-container");
  function initEvents() {
    tableContainer.addEventListener("change", function (e) {
      if (e.target.tagName !== "INPUT") {
        return;
      }
      e.target.parentElement.tagName === "TH" && onCheckAll();
      e.target.parentElement.tagName === "TD" && onCheckBox(e.target);
    });
  }
  var inputs = Array.prototype.slice.call($All("tbody input[type=checkbox]"));
  var checkNum = 0;
  // 全选事件
  function onCheckAll() {
    for (var i = 0; i < inputs.length; i++) {
      checkNum = checkAll.checked ? inputs.length : 0;
      inputs[i].checked = checkAll.checked;
    }
  }
  // 单选事件
  function onCheckBox(node) {
    node.checked ? checkNum++ : checkNum--;
    checkAll.checked = checkNum === inputs.length;
  }
  // 排序
  var tr = Array.prototype.slice.call($All("tbody tr"));
  var tbody = $("tbody");
  function thClick(index) {
    var trs = tr.sort(function (a, b) {
      if (index === 2 || index === 4)
        return a.children[index].innerHTML.localeCompare(
          b.children[index].innerHTML,
          "zh"
        );
      return a.children[index].innerHTML - b.children[index].innerHTML;
    });
    for (var i = 0; i < trs.length; i++) {
      tbody.appendChild(trs[i]);
    }
  }
  init();

  return {
    init,
  };
})();
