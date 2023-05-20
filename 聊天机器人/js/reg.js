(async () => {
  const LoginIdValidator = new FieldValidator("txtLoginId", async (val) => {
    if (!val) return "请填写账号";
    const resp = await api.exists(val);
    if (resp.data) return "该账号已存在";
  });
  const NicknameValidator = new FieldValidator("txtNickname", async (val) => {
    if (!val) return "请填写昵称";
  });
  const LoginPwdValidator = new FieldValidator("txtLoginPwd", async (val) => {
    if (!val) return "请填写密码";
  });
  const LoginPwdConfirmValidator = new FieldValidator(
    "txtLoginPwdConfirm",
    async (val) => {
      if (!val) return "请填写密码";
      if (val !== LoginPwdValidator.input.value) return "两次密码不一致";
    }
  );
  const rules = [
    LoginIdValidator,
    NicknameValidator,
    LoginPwdValidator,
    LoginPwdConfirmValidator,
  ];
  $(".user_form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const res = await FieldValidator.validate(...rules);
    if (!res) return;
    const formData = new FormData($(".user_form"));
    const req = await api.reg(Object.fromEntries(formData.entries()));
    if (req.code) {
      alert(req.msg);
    } else {
      location.href = "./login.html";
      alert("注册成功");
    }
  });
})();
