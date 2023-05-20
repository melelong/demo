// 游戏相关的配置

var gridData = []; // 存储地图对象

// 整个网格的行与列
var tr = 30;
var td = 30;

// 蛇的身体大小
var snakeBody = 20;

// 要明确新的蛇头和就蛇头之间的位置关系
// 我们在确定新的蛇头坐标的时候，会拿下面的对象和旧蛇头做一个计算
// 从而得出新的蛇头的坐标
var directionNum = {
    left: { x: -1, y: 0, flag: 'left' },
    right: { x: 1, y: 0, flag: 'right' },
    top: { x: 0, y: -1, flag: 'top' },
    bottom: { x: 0, y: 1, flag: 'bottom' },
}

// 蛇相关的配置信息
var snake = {
    // 蛇一开始移动的方向
    direction : directionNum.right, // 一开始向右边移动
    // 蛇的初始位置
    snakePos: [
        { x: 0, y: 0, domContent: "", flag: 'body' },
        { x: 1, y: 0, domContent: "", flag: 'body' },
        { x: 2, y: 0, domContent: "", flag: 'body' },
        { x: 3, y: 0, domContent: "", flag: 'head' },
    ]
}

// 食物相关的配置信息
var food = {
    x: 0, y: 0, domContent: ""
}

// 游戏分数
var score = 0;

// 停止计时器
var timerStop = null;

// 计时器事件
var time = 100;