(function () {
  // 封装获取dom方法
  function $(selector) {
    return document.querySelector(selector);
  }
  function $All(selector) {
    return document.querySelectorAll(selector);
  }
  // 获取dom
  var doms = {
    video: $(".container video"),
    btnPlay: $(".btnPlay"),
    progress: {
      range: $('.progress input[type="range"]'),
      current: $(".progress .current"),
      total: $(".progress .total"),
    },
    rate: $(".rate"),
    volume: {
      range: $('.volume input[type="range"]'),
      current: $(".volume .current"),
      muted: $(".volume .muted"),
    },
    btns: {
      save: $(".save"),
      load: $(".load"),
      clear: $(".clear"),
      default: $(".default"),
    },
    controls: Array.prototype.slice.apply($All(".controls")),
  };
  var defaultConfig = {
    currentTime: 0,
    rate: 1,
    volume: 0.5,
    muted: false,
  };
  // 设置进度
  function setProgress() {
    doms.progress.current.innerHTML = formatTime(doms.video.currentTime);
    doms.progress.total.innerHTML = formatTime(doms.video.duration);
    doms.progress.range.value =
      (doms.video.currentTime / doms.video.duration) * 100;
  }
  // 设置播放速率
  function setRate() {
    $(".rate .active") && $(".rate .active").classList.remove("active");
    $(
      ".rate button[data-rate='" + doms.video.playbackRate + "']"
    ).classList.add("active");
  }
  // 设置音量
  function setVolume() {
    var current = Math.floor(doms.video.volume * 100);
    doms.video.muted && (current = 0);
    doms.volume.range.value = current;
    doms.volume.current.innerHTML = current + "%";
  }
  // 设置静音
  function setMuted() {
    setVolume();
    doms.video.muted
      ? doms.volume.muted.classList.add("active")
      : doms.volume.muted.classList.remove("active");
  }
  // 播放暂停
  function videoPlayer() {
    doms.video.paused ? doms.video.play() : doms.video.pause();
  }
  // 保存设置
  function saveSettings() {
    var videoSettings = {
      currentTime: doms.video.currentTime,
      rate: doms.video.playbackRate,
      volume: doms.video.volume,
      muted: doms.video.muted,
    };
    localStorage.setItem("videoSettings", JSON.stringify(videoSettings));
    alert("本地设置成功");
  }
  // 加载设置
  function loadSettings() {
    if (!localStorage.getItem("videoSettings")) {
      alert("没有找到设置");
      return;
    }
    var config = JSON.parse(localStorage.getItem("videoSettings"));
    doms.video.currentTime = config.currentTime;
    setProgress();
    doms.video.playbackRate = config.rate;
    setRate();
    doms.video.volume = config.volume;
    setVolume();
    doms.video.muted = config.muted;
    setMuted();
    alert("本地设置加载成功");
  }
  //
  function clearSettings() {
    localStorage.removeItem("videoSettings");
    alert("本地设置已清空");
  }
  // 默认设置
  function defaultSettings() {
    doms.video.currentTime = defaultConfig.currentTime;
    setProgress();
    doms.video.playbackRate = defaultConfig.rate;
    setRate();
    doms.video.volume = defaultConfig.volume;
    setVolume();
    doms.video.muted = defaultConfig.muted;
    setMuted();
    alert("默认设置加载成功");
  }
  function formatTime(time) {
    var hour = Math.floor(time / 3600);
    time -= hour * 3600;
    var minute = Math.floor(time / 60);
    time -= minute * 60;
    time = Math.floor(time);
    function _format(n) {
      return n < 10 ? "0" + n : n;
    }
    return _format(hour) + ":" + _format(minute) + ":" + _format(time);
  }
  // 初始化
  function init() {
    setProgress();
    setRate();
    setVolume();
    for (var i = 0; i < doms.controls.length; i++) {
      doms.controls[i].style.display = "block";
    }
    // 事件绑定
    doms.btnPlay.addEventListener("click", videoPlayer);
    doms.video.addEventListener("timeupdate", setProgress);
    doms.progress.range.addEventListener("input", function () {
      doms.video.currentTime = (this.value / 100) * doms.video.duration;
      setProgress();
    });
    doms.rate.addEventListener("click", function (e) {
      doms.video.playbackRate = e.target.dataset.rate;
      setRate();
    });
    doms.volume.range.addEventListener("input", function () {
      doms.video.volume = this.value / 100;
      setVolume();
    });
    doms.volume.muted.addEventListener("click", function () {
      doms.video.muted = !doms.video.muted;
      setMuted();
    });
    doms.btns.save.addEventListener("click", saveSettings);
    doms.btns.load.addEventListener("click", loadSettings);
    doms.btns.clear.addEventListener("click", clearSettings);
    doms.btns.default.addEventListener("click", defaultSettings);
  }
  doms.video.addEventListener("loadeddata", init);
})();
