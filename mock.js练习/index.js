$(async function () {
  async function init() {
    async function _renderList(data) {
      const listText = data
        .map(
          (item) => `<div class="item">
          <div class="check">
            <input type="checkbox" class="checkItem" />
          </div>
          <div class="info">
            <img
              src="${item.imgUrl}"
              alt=""
            />
            <a href="">
              ${item.info}
            </a>
          </div>
          <div class="price"><em>￥${item.unitPrice}</em></div>
          <div class="num">
            <a href="" class="decr">-</a>
            <input type="text" value="${item.num}" class="txt" />
            <a href="" class="incr">+</a>
          </div>
          <div class="sum"><em>￥${(item.num * item.unitPrice).toFixed(
            2
          )}</em></div>
          <div class="del">
            <a href="">删除</a>
          </div>
        </div>`
        )
        .join("");
      $(".list").html(listText);
    }
    try {
      const resp = await axios.get("/getList");
      resp.data.data.code === 0
        ? await _renderList(resp.data.data.data)
        : console.log(resp.data.data.msg);
    } catch (err) {
      console.log(err.message);
    }
  }
  await init();
  // 计算所有
  function setAll() {
    let sums = 0;
    $(".checkItem:checked").each(
      (i, el) =>
        (sums += +$(el)
          .parents(".item")
          .find(".sum em")
          .text()
          .replace("￥", ""))
    );
    $(".nums em").text($(".checkItem:checked").length);
    $(".sums em").text(`￥${sums.toFixed(2)}`);
  }
  // 计算单个商品价钱
  function setOne(node) {
    const num = +$(node).parents(".item").find(".num .txt").val();
    const price = +$(node)
      .parents(".item")
      .find(".price em")
      .text()
      .replace("￥", "");
    $(node)
      .parents(".item")
      .find(".sum em")
      .text(`￥${(num * price).toFixed(2)}`);
  }
  // 修改txt数值
  function changeOne(node, type) {
    let num = +$(node).parents(".item").find(".num .txt").val();
    let value = type ? ++num : --num;
    value < 1 && (value = 1);
    $(node).parents(".item").find(".num .txt").prop("value", value);
    setOne(node);
    setAll();
  }
  // 减
  $(".num .decr").click(function (e) {
    e.preventDefault();
    changeOne(this);
  });
  // 加
  $(".num .incr").click(function (e) {
    e.preventDefault();
    changeOne(this, 1);
  });
  // 改
  $(".num .txt").change(function () {
    setOne(this);
    setAll();
  });
  // 选
  $(".checkItem").change(function () {
    $(".checkAll").prop(
      "checked",
      $(".checkItem:checked").length === $(".checkItem").length
    );
    setAll();
  });
  $(".checkAll").change(function () {
    $(":checkbox").not(this).prop("checked", this.checked);
    setAll();
  });
  // 删
  $(".del a").click(function (e) {
    e.preventDefault();
    $(this).parents(".item").remove();
    setAll();
  });
  $(".delChecked").click(function (e) {
    e.preventDefault();
    $(".checkItem:checked").parents(".item").remove();
    setAll();
  });
  $(".clearAll").click(function (e) {
    e.preventDefault();
    $(".item").remove();
    setAll();
  });
});
