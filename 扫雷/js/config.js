/**
 * 游戏配置文件
 */

// 不同级别的配置信息
var config = {
  easy: {
    row: 10,
    col: 10,
    mineNum: 10,
  },
  normal: {
    row: 15,
    col: 15,
    mineNum: 30,
  },
  hard: {
    row: 20,
    col: 20,
    mineNum: 60,
  },
};

// 当前游戏难度，一开始是 easy
var curLevel = config.easy;
