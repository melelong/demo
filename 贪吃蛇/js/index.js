
/**
 * 绘制蛇的方法
 * @param {*} snake 
 */
function drawSnake(snake) {
    for (var i = 0; i < snake.snakePos.length; i++) {
        if (!snake.snakePos[i].domContent) {
            // 如果进入此 if，说明是第一次创建蛇
            snake.snakePos[i].domContent = document.createElement("div");
            snake.snakePos[i].domContent.style.position = "absolute";
            snake.snakePos[i].domContent.style.width = snakeBody + "px";
            snake.snakePos[i].domContent.style.height = snakeBody + "px";
            snake.snakePos[i].domContent.style.left = snake.snakePos[i].x * snakeBody + "px";
            snake.snakePos[i].domContent.style.top = snake.snakePos[i].y * snakeBody + "px";
            if (snake.snakePos[i].flag === 'head') {
                // 说明当前是蛇头
                snake.snakePos[i].domContent.style.background = `
                    url("./img/snake.png") center/contain no-repeat
                `;
                // 根据方向进行一个旋转
                switch (snake.direction.flag) {
                    case 'top': {
                        snake.snakePos[i].domContent.style.transform = `
                            rotate(-90deg)
                        `;
                        break;
                    }
                    case 'bottom': {
                        snake.snakePos[i].domContent.style.transform = `
                            rotate(90deg)
                        `;
                        break;
                    }
                    case 'left': {
                        snake.snakePos[i].domContent.style.transform = `
                            rotate(180deg)
                        `;
                        break;
                    }
                    case 'right': {
                        snake.snakePos[i].domContent.style.transform = `
                            rotate(0deg)
                        `;
                        break;
                    }
                }
            } else {
                // 说明是蛇身
                snake.snakePos[i].domContent.style.background = "#9ddbb1";
                snake.snakePos[i].domContent.style.borderRadius = '50%';
            }
        }
        // 需要将创建的 DOM 元素添加到 container 容器上面
        document.querySelector(".container").append(snake.snakePos[i].domContent);
    }
}

/**
 * 绘制食物
 */
function drawFood() {
    // 1. 食物的坐标是随机的
    // 2. 食物不能生成在蛇头或者蛇身上面
    while (true) {
        // 构成一个死循环，直到生成符合要求的食物坐标才能退出该循环
        var isRepeat = false; // 默认生成的坐标是符合要求
        // 随机生成一个坐标
        food.x = Math.floor(Math.random() * tr);
        food.y = Math.floor(Math.random() * tr);
        // 查看坐标是否符合要求(遍历蛇)
        for (var i = 0; i < snake.snakePos.length; i++) {
            if (snake.snakePos[i].x === food.x && snake.snakePos[i].y === food.y) {
                // 进入此 if，说明当前生成的食物坐标和蛇的坐标冲突了
                isRepeat = true;
                break;
            }
        }
        if (!isRepeat) {
            // 跳出 while 循环
            break;
        }
    }
    // 整个 while 循环跳出来之后，食物的坐标一定是 OK 的
    if (!food.domContent) {
        food.domContent = document.createElement("div");
        food.domContent.style.width = snakeBody + "px";
        food.domContent.style.height = snakeBody + "px";
        food.domContent.style.position = "absolute";
        food.domContent.style.background = `
            url("./img/food.png") center/contain no-repeat
        `;
        document.querySelector('.container').append(food.domContent);
    }
    food.domContent.style.left = food.x * snakeBody + "px";
    food.domContent.style.top = food.y * snakeBody + "px";
}


/**
 * 初始化游戏方法
 */
function initGame() {
    // 1. 初始化地图
    for (var i = 0; i < tr; i++) {
        for (var j = 0; j < td; j++) {
            gridData.push({
                x: j,
                y: i
            });
        }
    }
    // console.log(gridData);

    // 2. 绘制蛇
    drawSnake(snake);

    // 3. 绘制食物
    drawFood();
}

/**
 * 碰撞检测
 * @param {*} newHead 新计算出来的蛇头坐标
 */
function isCollide(newHead) {
    var collideCheckInfo = {
        isCollide: false, // 是否碰撞墙壁，蛇身
        isEat: false // 是否吃到食物
    }
    // 1. 检测是否碰到墙壁
    if (newHead.x < 0 || newHead.x >= td || newHead.y < 0 || newHead.y >= tr) {
        collideCheckInfo.isCollide = true;
        return collideCheckInfo;
    }

    // 2. 检测是否碰到自己
    for (var i = 0; i < snake.snakePos.length; i++) {
        if (snake.snakePos[i].x === newHead.x && snake.snakePos[i].y === newHead.y) {
            collideCheckInfo.isCollide = true;
            return collideCheckInfo;
        }
    }

    // 3. 检测是否吃到东西
    if (newHead.x === food.x && newHead.y === food.y) {
        collideCheckInfo.isEat = true;
        score++; // 分数自增
    }
    return collideCheckInfo;
}

/**
 * 蛇的移动方法
 */
function snakeMove() {
    var oldHead = snake.snakePos[snake.snakePos.length - 1];
    // 根据方向计算出新的蛇头的坐标
    var newHead = {
        domContent: "",
        x: oldHead.x + snake.direction.x,
        y: oldHead.y + snake.direction.y,
        flag: 'head'
    }
    // 接下来我们首先要做碰撞检测
    // 看计算出来的新的蛇头有没有碰上食物、蛇身体、墙壁
    var collideCheckResult = isCollide(newHead);
    if (collideCheckResult.isCollide) {
        // 进入此 if，说明碰墙了
        if (window.confirm(`
            游戏结束，您当前的得分为${score}分，是否要重新开始游戏？
        `)) {
            // 重新开始游戏
            document.querySelector('.container').innerHTML = `
                <!-- 开始游戏按钮 -->
                <button class="startBtn" style="display:none"></button>
                <!-- 暂停游戏按钮 -->
                <button class="pauseBtn" style="display:none"></button>
            `;
            score = 0;
            snake = {
                // 蛇一开始移动的方向
                direction: directionNum.right, // 一开始向右边移动
                // 蛇的初始位置
                snakePos: [
                    { x: 0, y: 0, domContent: "", flag: 'body' },
                    { x: 1, y: 0, domContent: "", flag: 'body' },
                    { x: 2, y: 0, domContent: "", flag: 'body' },
                    { x: 3, y: 0, domContent: "", flag: 'head' },
                ]
            }
            food = {
                x: 0, y: 0, domContent: ""
            }
            initGame();
        } else {
            // 结束游戏
            document.onkeydown = null;
            clearInterval(timerStop);
        }
        return;
    }
    // 将旧的头修改为身体
    oldHead.flag = 'body';
    oldHead.domContent.style.background = "#9ddbb1";
    oldHead.domContent.style.borderRadius = "50%";
    snake.snakePos.push(newHead);
    // 判断是否吃到东西
    if (collideCheckResult.isEat) {
        // 1. 重新生成新的食物
        drawFood();
    } else {
        // 说明没有吃到食物
        // 移除最后一个元素
        document.querySelector(".container").removeChild(snake.snakePos[0].domContent);
        snake.snakePos.shift();
    }
    // 重新绘制蛇
    drawSnake(snake);
}

function startGame() {
    timerStop = setInterval(function () {
        snakeMove()
    }, time)
}


/**
 * 绑定事件
 */
function bindEvent() {
    // 1. 首先是键盘事件，用户按下上下左右，蛇能够移动
    document.onkeydown = function (e) {
        if ((e.key === "ArrowUp" || e.key.toLocaleLowerCase() === "w") && snake.direction.flag !== "bottom") {
            // 用户按的是上
            snake.direction = directionNum.top;
        }
        if ((e.key === "ArrowDown" || e.key.toLocaleLowerCase() === "s") && snake.direction.flag !== "top") {
            // 用户按的是下
            snake.direction = directionNum.bottom;
        }
        if ((e.key === "ArrowLeft" || e.key.toLocaleLowerCase() === "a") && snake.direction.flag !== "right") {
            // 用户按的是左
            snake.direction = directionNum.left;
        }
        if ((e.key === "ArrowRight" || e.key.toLocaleLowerCase() === "d") && snake.direction.flag !== "left") {
            // 用户按的是右
            snake.direction = directionNum.right;
        }
    }
    // 2. 计时器自动调用蛇移动的方法
    startGame();

    // 3. 点击整个容器的时候，可以暂停和重新开始游戏
    document.querySelector('.container').onclick = function (e) {
        // 这边是通过事件委托的形式，判断用户究竟点击的是 container 容器还是暂停按钮
        // 从而做出不同的处理
        if (e.target.className === "container") {
            // 那你是要做暂停操作
            document.querySelector('.pauseBtn').style.display = 'block';
            clearInterval(timerStop);
        } else {
            // 恢复游戏操作
            document.querySelector('.pauseBtn').style.display = 'none';
            startGame();
        }

    }
}


/**
 * 游戏的主方法
 */
function main() {
    // 用户点击了开始游戏之后，再做后续的工作
    document.querySelector('.startBtn').onclick = function (e) {
        e.stopPropagation();

        document.querySelector('.startBtn').style.display = "none";

        // 1. 首先第一步：初始化游戏
        initGame();

        // 2. 绑定事件
        bindEvent();
    }
}
main();