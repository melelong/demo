var api = (() => {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";
  // get
  function get(url) {
    const headers = {};
    localStorage.getItem(TOKEN_KEY) &&
      (headers.authorization = `Bearer ${localStorage.getItem(TOKEN_KEY)}`);
    return fetch(`${BASE_URL}${url}`, { headers });
  }
  // post
  function post(url, bodyObj) {
    const headers = { "Content-Type": "application/json" };
    localStorage.getItem(TOKEN_KEY) &&
      (headers.authorization = `Bearer ${localStorage.getItem(TOKEN_KEY)}`);
    return fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj),
    });
  }
  // 登录
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const res = await resp.json();
    res.code === 0 &&
      localStorage.setItem(TOKEN_KEY, resp.headers.get("authorization"));
    return res;
  }
  // 注册
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }
  async function exists(loginId) {
    const resp = await get(`/api/user/exists?loginId=${loginId}`);
    return await resp.json();
  }
  // 用户信息
  async function profile() {
    const resp = await get(`/api/user/profile`);
    return await resp.json();
  }
  // 发信息
  async function sendChat(content) {
    const resp = await post("/api/chat", content);
    return await resp.json();
  }
  // 获取历史
  async function getHistory() {
    const resp = await get(`/api/chat/history`);
    return await resp.json();
  }
  // 退出
  async function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
    return "退出";
  }
  return {
    login,
    reg,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
    TOKEN_KEY,
  };
})();
