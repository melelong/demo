(async () => {
  /**
   * 从网络获取歌词数据
   * @returns Promise
   */
  async function getLrc() {
    return await fetch("https://study.duyiedu.com/api/lyrics")
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }
  const config = {
    mp3Url: "./music.mp3",
    size: {
      liHeight: 30,
      containerHeight: 420,
    },
  };
  const doms = {
    container: document.querySelector(".container"),
  };
  let lrcDatas;
  async function init() {
    // 获取歌词数据
    async function _getData() {
      const datas = await getLrc();
      return {
        time: datas
          .split("\n")
          .filter((item) => item !== "")
          .map((item) => +item.substring(1, 3) * 60 + +item.substring(4, 9)),
        lrc: datas
          .split("\n")
          .filter((item) => item !== "")
          .map((item) => item.replace(/.{10}/, "")),
      };
    }
    try {
      // 等待获取数据
      lrcDatas = await _getData();
      // 创建音频元素
      const audioText = `<audio src="${config.mp3Url}" controls></audio>`;
      // 创建歌词元素
      const lrcText = `<div class='lrcContainer'"><ul class='lrc'>${lrcDatas.lrc
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul></div>`;
      // 把元素加入容器
      doms.container.innerHTML = audioText + lrcText;
      // 获取生成元素的dom
      doms.audio = document.querySelector("audio");
      doms.lrcContainer = document.querySelector(".lrcContainer");
      doms.lrc = document.querySelector(".lrc");
      doms.lrcLis = Array.from(doms.lrc.children);
      config.size.liHeight = doms.lrcLis[0].clientHeight;
      config.size.containerHeight = doms.lrcContainer.clientHeight;
    } catch (err) {
      // 获取失败
      console.log(err);
    }
  }
  await init();
  doms.audio.addEventListener("timeupdate", function () {
    currentState(this.currentTime, config);
  });
  doms.lrcContainer.addEventListener("click", function ({ target }) {
    if (target.tagName !== "LI") return;
    const index = doms.lrcLis.indexOf(target);
    doms.audio.currentTime = lrcDatas.time[index];
  });
  async function currentState(time, { size }) {
    time += 0.5;
    // 清除之前样式
    const select = document.querySelector(".select");
    select && select.classList.remove("select");
    // 添加当前的歌词样式
    let index = null;
    index = lrcDatas.time.indexOf(
      +lrcDatas.time.filter((item, i) => {
        return time > item && time < lrcDatas.time[i + 1];
      })
    );
    if (index < 0) return;
    doms.lrcLis[index].classList.add("select");
    // 滚动
    let top =
      size.liHeight * index - size.containerHeight / 2 - size.liHeight / 2;
    top < 0 && (top = 0);
    doms.lrc.style.transform = `translateY(${-top}px)`;
  }
})();
