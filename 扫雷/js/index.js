/**
 * 游戏主要逻辑
 */

// 用于存储生成的地雷的数组
var mineArray = null;

// 雷区的容器
var mineArea = $(".mineArea");

// 用于存储整张地图每个格子额外的一些信息
var tableData = [];

// 存储用户插旗的 DOM 元素
var flagArray = [];

// 获取游戏难度选择的所有按钮
var btns = $$(".level>button");

// 插旗数量的 DOM 元素
var flagNum = $(".flagNum");

// 当前级别雷数的 DOM 元素
var mineNumber = $(".mineNum");

/**
 * 生成地雷的方法
 * @returns 返回地雷数组
 */
function initMine() {
  // 生成对应长度的数组
  var arr = new Array(curLevel.row * curLevel.col);
  // 往这个数组里面填充值
  for (var i = 0; i < arr.length; i++) {
    arr[i] = i;
  }
  // 接下来打乱这个数组
  arr.sort(() => 0.5 - Math.random());
  // 只保留对应雷数量的数组长度
  return arr.slice(0, curLevel.mineNum);
}

/**
 * 场景重置
 */
function clearScene() {
  mineArea.innerHTML = "";
  flagArray = []; // 清空插旗的数组
  flagNum.innerHTML = 0; // 重置插旗的数量
  mineNumber.innerHTML = curLevel.mineNum; // 重置当前级别的雷数
}

/**
 * 游戏初始化函数
 */
function init() {
  // 清空场景，或者叫做重新信息
  clearScene();

  // 1. 随机生成所选配置对应数量的雷
  mineArray = initMine();
  //   console.log(mineArray);

  // 2. 生成所选配置的表格
  var table = document.createElement("table");

  // 初始化格子的下标
  var index = 0;

  for (var i = 0; i < curLevel.row; i++) {
    // 创建新的一行
    var tr = document.createElement("tr");
    tableData[i] = [];
    for (var j = 0; j < curLevel.col; j++) {
      var td = document.createElement("td");
      var div = document.createElement("div");

      // 每一个小格子都会对应一个 JS 对象
      // 该对象存储了额外的一些信息
      tableData[i][j] = {
        row: i, // 该格子的行
        col: j, // 该格子的列
        type: "number", // 格子的属性 数字 number 雷 mine
        value: 0, // 周围雷的数量
        index, // 格子的下标
        checked: false, // 是否被检验过，后面会用到
      };

      // 为每一个 div 添加一个下标，方便用户点击的时候获取对应格子的下标
      div.dataset.id = index;
      // 标记当前的 div 是可以插旗的
      div.classList.add("canFlag");

      // 查看当前格子的下标是否在雷的数组里面
      if (mineArray.includes(tableData[i][j].index)) {
        tableData[i][j].type = "mine";
        div.classList.add("mine");
      }

      td.appendChild(div);
      tr.appendChild(td);

      // 下标自增
      index++;
    }

    table.appendChild(tr);
  }
  mineArea.appendChild(table);
  //   console.log(tableData);

  // 这边需要每次初始化的时候，重新绑定一下事件
  // 因为每次游戏结束的时候，是移除了事件的
  // 注意这里要用 mousedown，不要用 click
  // 鼠标点击事件
  mineArea.onmousedown = function (e) {
    if (e.button === 0) {
      // 说明用户点击的是鼠标左键，进行区域搜索操作
      searchArea(e.target);
    }

    if (e.button === 2) {
      // 说明用户按的是鼠标右键，进行插旗操作
      flag(e.target);
    }
  };
}

/**
 * 显示答案
 */
function showAnswer() {
  // 核心逻辑：
  // 要把所有的雷显示出来
  // 有些雷可能是插了旗，需要判断插旗是否正确
  // 正确添加上绿色背景，错误添加上红色背景

  var isAllRight = true;

  // 获取所有雷的 DOM 元素
  var mineArr = $$("td>div.mine");
  for (var i = 0; i < mineArr.length; i++) {
    mineArr[i].style.opacity = 1;
  }

  // 遍历用户的插旗
  for (var i = 0; i < flagArray.length; i++) {
    if (flagArray[i].classList.contains("mine")) {
      // 说明插旗插对了
      flagArray[i].classList.add("right");
    } else {
      flagArray[i].classList.add("error");
      isAllRight = false;
    }
  }

  if (!isAllRight || flagArray.length !== curLevel.mineNum) {
    gameOver(false);
  }

  // 取消事件
  mineArea.onmousedown = null;
}

/**
 * 找到对应 DOM 在 tableData 里面的 JS 对象
 * @param {*} cell
 */
function getTableItem(cell) {
  var index = cell.dataset.id;
  var flatTableData = tableData.flat();
  return flatTableData.filter((item) => item.index == index)[0];
}

/**
 * 会返回该对象对应的四周的边界
 * @param {*} obj 格子对应的 JS 对象
 */
function getBound(obj) {
  // 确定边界

  // 上下边界
  var rowTop = obj.row - 1 < 0 ? 0 : obj.row - 1;
  var rowBottom = obj.row + 1 === curLevel.row ? curLevel.row - 1 : obj.row + 1;

  // 左右边界
  var colLeft = obj.col - 1 < 0 ? 0 : obj.col - 1;
  var colRight = obj.col + 1 === curLevel.col ? curLevel.col - 1 : obj.col + 1;

  return {
    rowTop,
    rowBottom,
    colLeft,
    colRight,
  };
}

/**
 * 返回周围一圈雷的数量
 * @param {*} obj 格子对应的 JS 对象
 */
function findMineNum(obj) {
  var count = 0; // 地雷计数器

  var { rowTop, rowBottom, colLeft, colRight } = getBound(obj);

  for (var i = rowTop; i <= rowBottom; i++) {
    for (var j = colLeft; j <= colRight; j++) {
      if (tableData[i][j].type === "mine") {
        count++;
      }
    }
  }
  return count;
}

/**
 * 根据 tableData 中的 JS 对象返回对应的 div
 * @param {*} obj
 */
function getDOM(obj) {
  // 获取到所有的 div
  var divArray = $$("td>div");
  // 返回对应下标的 div
  return divArray[obj.index];
}

/**
 * 搜索该单元周围的九宫格区域
 * @param {*} cell 用户点击的单元格
 */
function getAround(cell) {
  if (!cell.classList.contains("flag")) {
    // 当前的单元格没有被插旗，我们才进行以下的操作
    cell.parentNode.style.border = "none";
    cell.classList.remove("canFlag");

    // 1. 获取到该 DOM 元素在 tableData 里面所对应的对象
    var tableItem = getTableItem(cell);

    if (!tableItem) {
      return;
    }

    // 代表当前的单元格已经被核对过了
    tableItem.checked = true;

    // 接下来，得到了 DOM 对象所对应的 JS 对象
    // 那我们就可以查看周围一圈是否有雷
    var mineNum = findMineNum(tableItem);
    if (!mineNum) {
      // 进入此 if，说明周围没有雷
      // 需要继续搜索
      var { rowTop, rowBottom, colLeft, colRight } = getBound(tableItem);
      for (var i = rowTop; i <= rowBottom; i++) {
        for (var j = colLeft; j <= colRight; j++) {
          if (!tableData[i][j].checked) {
            getAround(getDOM(tableData[i][j]));
          }
        }
      }
    } else {
      // 说明周围有雷，当前的格子要显示对应雷的数量
      var cl = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
      ];
      cell.classList.add(cl[mineNum]);
      cell.innerHTML = mineNum;
    }
  }
}

/**
 * 区域搜索
 * @param {*} cell 用户点击的 DOM 元素
 */
function searchArea(cell) {
  // 核心思路：
  // 整体分析下来分为三种情况
  // 1. 当前单元格是雷，游戏结束
  if (cell.classList.contains("mine")) {
    // 进入此 if，说明踩雷了
    cell.classList.add("error");
    showAnswer();
    return;
  }

  // 2. 当前单元格不是雷，判断周围一圈有没有雷
  // 如果有雷，显示雷的数量
  // 如果没有雷，继续递归搜索
  getAround(cell);
}

/**
 * 判断用户的插旗是否全部正确
 */
function isWin() {
  for (var i = 0; i < flagArray.length; i++) {
    if (!flagArray[i].classList.contains("mine")) {
      return false;
    }
  }
  return true;
}

/**
 * 游戏结束
 * 分为两种情况
 * @param {*} isWin 这是一个布尔值，true 代表游戏胜利，false 代表游戏失败
 */
function gameOver(isWin) {
  var mess = "";
  if (isWin) {
    mess = "游戏胜利，你找出了所有的雷～";
  } else {
    mess = "游戏失败～";
  }
  setTimeout(function () {
    window.alert(mess);
  }, 0);
}

/**
 *
 * @param {*} cell 用户点击的 DOM 元素
 */
function flag(cell) {
  // 只有点击的 DOM 元素包含 canFlag 样式类
  // 才能进行插旗操作
  if (cell.classList.contains("canFlag")) {
    if (!flagArray.includes(cell)) {
      // 进行插旗操作
      flagArray.push(cell);
      cell.classList.add("flag");

      // 还需要进行插旗数的判断
      if (flagArray.length === curLevel.mineNum) {
        // 判断玩家是否胜利
        if (isWin()) {
          gameOver(true);
        }
        // 无论你游戏是胜利还是失败，我们都应该进入 showAnswer，显示最终答案
        showAnswer();
      }
    } else {
      // 说明这个单元格已经在数组里面了
      // 也就是说，用户现在是要取消插旗
      var index = flagArray.indexOf(cell);
      flagArray.splice(index, 1);
      cell.classList.remove("flag");
    }
    flagNum.innerHTML = flagArray.length;
  }
}

/**
 * 绑定事件
 */
function bindEvent() {
  // 阻止默认的鼠标右键行为
  // 默认会弹出右键菜单
  mineArea.oncontextmenu = function (e) {
    e.preventDefault();
  };

  // 游戏难度选择
  $(".level").onclick = function (e) {
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove("active");
    }
    e.target.classList.add("active");
    switch (e.target.innerHTML) {
      case "初级": {
        curLevel = config.easy;
        break;
      }
      case "中级": {
        curLevel = config.normal;
        break;
      }
      case "高级": {
        curLevel = config.hard;
        break;
      }
    }
    init();
  };
}

/**
 * 程序入口
 */
function main() {
  // 1. 游戏的初始化
  init();

  // 2. 绑定事件
  bindEvent();
}

main();
