var test = (function () {
  // 封装获取dom方法
  function $(selector) {
    return document.querySelector(selector);
  }
  function $All(selector) {
    return document.querySelectorAll(selector);
  }
  function random(max, min) {
    min = min || 0;
    return Math.floor(Math.random() * max + min);
  }
  var imgDatas = ["t1.png", "t2.png", "t3.png", "t4.png", "t5.png"];
  var doms = {
    changeImg: $(".changeImg"),
    imgBox: $(".imgBox"),
    imgBlock: $(".imgBlock"),
    imgGap: $(".imgGap"),
    title: $(".imgContainer h3"),
    slider: $(".slider"),
    btn: $(".slider .btn"),
    span: $(".slider span"),
  };
  function randomImg(data) {
    var imgIndex = random(data.length);
    doms.imgBox.style.backgroundImage = `url(./img/${data[imgIndex]})`;
    doms.imgBlock.style.backgroundImage = `url(./img/${data[imgIndex]})`;
  }
  function randomPosition() {
    var maxHeight = doms.imgBox.offsetHeight - doms.imgBlock.offsetHeight;
    var maxWidth = doms.imgBox.offsetWidth / 2 - doms.imgBlock.offsetWidth;
    var top = random(maxHeight);
    var left = random(maxWidth) + doms.imgBox.offsetWidth / 2;
    doms.imgGap.style.left = left + "px";
    doms.imgGap.style.top = top + "px";
    doms.imgBlock.style.top = top + "px";
    doms.imgBlock.style.left = "0px";
    doms.imgBlock.style.backgroundPosition = `-${left}px -${top}px`;
  }
  // 初始化
  function init() {
    // 随机生成背景图片
    randomImg(imgDatas);
    // 随机位置
    randomPosition();
    initEvents();
  }
  function initEvents() {
    doms.btn.onmousedown = function (e) {
      doms.imgBlock.style.opacity = 1;
      doms.imgBlock.style.transition = "none";
      doms.title.innerHTML = "拖动图片完成验证";
      doms.title.style.color = "#000";
      doms.span.style.opacity = 0;
      doms.btn.style.transition = "none";
      doms.slider.onmousemove = function (ev) {
        var newLeft = ev.clientX - doms.slider.offsetLeft - e.offsetX;
        newLeft < -2 && (newLeft = -2);
        newLeft > doms.imgBox.offsetWidth - doms.imgBlock.offsetWidth &&
          (newLeft = doms.imgBox.offsetWidth - doms.imgBlock.offsetWidth);
        doms.imgBlock.style.left = newLeft + "px";
        doms.btn.style.left = newLeft + "px";
      };
      document.onmouseup = function () {
        var diffLeft = doms.imgGap.offsetLeft - doms.imgBlock.offsetLeft;
        if (diffLeft < 5 && diffLeft > -5) {
          doms.imgBlock.style.opacity = 0;
          doms.imgGap.style.opacity = 0;
          doms.title.innerHTML = "验证成功";
          doms.title.style.color = "red";
          doms.btn.onmousedown =
            doms.slider.onmousemove =
            document.onmouseup =
              null;
        } else {
          doms.imgBlock.style.left = "0px";
          doms.btn.style.left = "-2px";
          doms.imgBlock.style.transition = "all .5s";
          doms.btn.style.transition = "all .5s";
          doms.slider.onmousemove = document.onmouseup = null;
          doms.title.innerHTML = "验证失败";
          doms.title.style.color = "green";
          doms.span.style.opacity = 1;
        }
      };
    };
  }
  init();
  doms.changeImg.onclick = function () {
    doms.title.innerHTML = "拖动图片完成验证";
    doms.title.style.color = "#000";
    doms.imgBlock.style.left = "0px";
    doms.btn.style.left = "-2px";
    doms.span.style.opacity = 1;
    doms.imgGap.style.opacity = 1;
    init();
  };
  return {
    init,
    randomImg,
    randomPosition,
    initEvents,
  };
})();
