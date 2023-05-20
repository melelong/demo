function createAnimation(option) {
  var from = option.from; // 开始值
  var to = option.to; // 下一项值
  var totalTime = option.totalTime || 1000; // 动画总时间
  var duration = option.duration || 15; // 动画间隔时间
  var num = Math.floor(totalTime / duration); // 变化次数
  var dis = (to - from) / num; // 每次变化值
  var index = 0; // 已经变化的次数
  var timerId = setInterval(function () {
    from += dis;
    index++; // 增加已经变化的次数
    // 判断是否完成变化次数
    if (index >= num) {
      from = to;
      clearInterval(timerId);
      option.onMove && option.onMove(from);
      option.onEnd && option.onEnd();
      return;
    }
    option.onMove && option.onMove(from);
  }, duration);
}
