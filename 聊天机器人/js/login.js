(async () => {
  // 账号校验
  const LoginIdValidator = new FieldValidator("txtLoginId", async (val) => {
    if (!val) return "请填写账号";
  });
  // 密码校验
  const LoginPwdValidator = new FieldValidator("txtLoginPwd", async (val) => {
    if (!val) return "请填写密码";
  });
  const rules = [LoginIdValidator, LoginPwdValidator];
  // 表单提交
  $(".user_form").addEventListener("submit", async function (e) {
    e.preventDefault();
    // 全部校验结果
    const res = await FieldValidator.validate(...rules);
    if (!res) return;
    const formData = new FormData($(".user_form"));
    // 登录请求
    const req = await api.login(Object.fromEntries(formData.entries()));
    // 跳转页面
    if (req.code) {
      alert("登录失败");
      LoginIdValidator.p.innerText = "账号或密码错误";
      LoginIdValidator.input.value = "";
      LoginPwdValidator.input.value = "";
    } else {
      alert("登录成功");
      location.href = "./index.html";
    }
  });
})();
