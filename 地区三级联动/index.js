(async () => {
  /**
   * 远程获取省市区数据，当获取完成后，得到一个数组
   * @returns Promise
   */
  async function getDatas() {
    return fetch("https://study.duyiedu.com/api/citylist")
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }
  // 封装获取dom方法
  const $ = (selector) => document.querySelector(selector);
  // 获取dom
  const doms = {
    selProvince: $(".selProvince"),
    selCity: $(".selCity"),
    selArea: $(".selArea"),
  };
  // 数据存放
  const datas = {
    provinceData: null,
    cityData: null,
    areaData: null,
  };
  // 初始化
  async function init({ selProvince, selCity, selArea }) {
    try {
      datas.provinceData = await getDatas();
      await createLi(selProvince, datas.provinceData);
      await createLi(selCity);
      await createLi(selArea);
      await publicEvents(selProvince);
      await publicEvents(selCity);
      await publicEvents(selArea);
    } catch (err) {
      console.log(err);
    }
  }
  await init(doms);
  // 公共事件
  async function publicEvents(node) {
    node.addEventListener("click", async function ({ target }) {
      if (this.classList.contains("no_select") || target.tagName === "UL")
        return;
      if (target.tagName === "LI") {
        this.querySelector("span").innerHTML = target.innerHTML;
        this.querySelector(".active") &&
          this.querySelector(".active").classList.remove("active");
        target.classList.add("active");
        await otherEvents(target.innerHTML, this.nextElementSibling);
      }
      await chang(this);
    });
    async function chang(node) {
      $(".show")
        ? $(".show").classList.remove("show")
        : node.classList.add("show");
    }
  }
  // 其他事件
  async function otherEvents(keyword = "", node) {
    if (!node) return;
    let data;
    const filterData = (data) =>
      data.filter((item) => item.label === keyword)[0];
    if (node.dataset.type === "城市") {
      data = datas.cityData = filterData(datas.provinceData);
      !("children" in data) && (data = []);
      createLi(node, data);
      createLi(doms.selArea);
    }
    if (node.dataset.type === "地区") {
      data = datas.areaData = filterData(datas.cityData.children);
      !("children" in data) && (data = []);
      createLi(node, data);
    }
  }
  // 渲染列表
  async function createLi(node, list = []) {
    list.length !== 0
      ? node.classList.remove("no_select")
      : node.classList.add("no_select");
    node.querySelector("span").innerHTML = `请选择${node.dataset.type}`;
    node.querySelector(".options").innerHTML = `${
      Array.isArray(list)
        ? list.map((item) => `<li>${item.label}</li>`).join("")
        : list.children.map((item) => `<li>${item.label}</li>`).join("")
    }`;
  }
})();
