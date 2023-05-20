(async () => {
  /**
   * 从网络获取当前的英雄数据
   * @returns Promise
   */
  async function getHeroes() {
    return fetch("https://study.duyiedu.com/api/herolist")
      .then((resp) => resp.json())
      .then((resp) => resp.data.reverse());
  }
  // 防抖函数
  const debounce = (fn, delay) => {
    let timeId;
    return async (...args) => {
      clearTimeout(timeId);
      timeId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  // 封装获取dom方法
  const $ = (selector) => document.querySelector(selector);
  const $All = (selector) => Array.from(document.querySelectorAll(selector));
  // 获取dom
  const doms = {
    types: $(".search .types"),
    input: $(".keyword .input input"),
    heroesContainer: $(".heroesContainer"),
  };
  let heroesData; // 数据
  // 初始化
  async function init() {
    try {
      heroesData = await getHeroes();
      await renderLi(heroesData);
      // 默认全部
      $All(".types .typesList:nth-child(2) .radio")[0].classList.add("checked");
    } catch (err) {
      console.log(err);
    }
  }
  await init();
  // 事件绑定
  doms.types.addEventListener("click", async ({ target }) => {
    if (target.classList.value !== "radio" && doms.input.value === "") return;
    await setCheck(target);
    const config = {
      type: target.dataset.type || "",
      value: target.dataset.value || "",
    };
    await renderLi(await dataFilter(config, heroesData));
  });
  doms.input.addEventListener(
    "input",
    debounce(() => {
      setCheck($All(".types .typesList:nth-child(2) .radio")[0]);
      renderLi(
        heroesData.filter((item) => item.cname.includes(doms.input.value))
      );
    }, 100)
  );
  // 渲染列表
  async function renderLi(data) {
    doms.heroesContainer.innerHTML = data
      .map(
        ({ ename, cname }) =>
          `<li><a href="https://pvp.qq.com/web201605/herodetail/${ename}.shtml"><img class="heroesImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${ename}/${ename}.jpg" alt><span>${cname}</span></a></li>`
      )
      .join("");
  }
  // 过滤数据
  async function dataFilter({ type, value }, data) {
    if (type === "all") return data;
    return type === "pay_type"
      ? data.filter(({ pay_type }) => +value === pay_type)
      : data.filter(
          ({ hero_type, hero_type2 }) =>
            +value === hero_type || +value === hero_type2
        );
  }
  // 选中样式
  async function setCheck({ classList }) {
    $(".checked") && $(".checked").classList.remove("checked");
    classList.add("checked");
  }
})();
