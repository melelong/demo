(async () => {
  const req = await api.profile();
  const user = req.data;
  if (!user) {
    location.href = "./login.html";
    alert("你未登录，请先登录");
    return;
  }
  const doms = {
    loginId: $(".chat_aside .aside_name"),
    nickname: $(".chat_aside .aside_account"),
    chat: $(".chat"),
    msgForm: $(".msg_form"),
    msg: $(".msg_form input"),
    close: $(".close"),
    img: $(".chat_aside img"),
  };
  // 获取用户信息
  async function setUserInfo() {
    doms.nickname.innerText = user.nickname;
    doms.loginId.innerText = user.loginId;
  }
  // 获取历史消息
  async function getHistory() {
    const history = await api.getHistory();
    addChat(history.data, doms.chat);
    scrollB(doms.chat);
  }
  // 生成消息
  async function addChat(data, node) {
    const chatText = data
      .map(
        (item) =>
          `<li class="chat_item ${item.from ? "me" : ""}"><img src="./asset/${
            item.from ? "avatar.png" : "robot-avatar.jpg"
          }" alt="" class="chat_avatar"><div class="chat_content">${
            item.content
          }</div><div class="chat_date">${formatDate(
            item.createdAt
          )}</div></li>`
      )
      .join("");
    node.innerHTML = chatText;
  }
  // 时间格式化
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, 0);
    const day = date.getDate().toString().padStart(2, 0);
    const hour = date.getHours().toString().padStart(2, 0);
    const minute = date.getMinutes().toString().padStart(2, 0);
    const second = date.getSeconds().toString().padStart(2, 0);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  // 滚动条滚动到底
  function scrollB(node) {
    node.scrollTop = node.scrollHeight;
  }
  // 滚动条滚动到顶
  function scrollT(node) {
    node.scrollTop = 0;
  }
  // 回到顶部
  doms.img.addEventListener("click", () => {
    scrollT(doms.chat);
  });
  doms.img.addEventListener("dblclick", () => {
    scrollB(doms.chat);
  });
  // 发消息
  doms.msgForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!doms.msg.value) return;
    const formData = new FormData(doms.msgForm);
    await api.sendChat(Object.fromEntries(formData.entries()));
    await getHistory();
    doms.msg.value = "";
  });
  // 退出
  doms.close.onclick = async () => {
    await api.loginOut();
    location.href = "./login.html";
    alert("已退出");
  };
  await setUserInfo();
  await getHistory();
})();
