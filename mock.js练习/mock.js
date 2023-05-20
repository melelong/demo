Mock.mock("/getList", "get", {
  "data|1": [
    {
      code: 400,
      msg: "请求失败",
      data: "",
    },
    {
      code: 0,
      msg: "",
      "data|1-10": [
        {
          imgUrl: "@Image(180x150, #008c8c, #fff, testimage)",
          info: "@csentence",
          "unitPrice|5-800.2": 0,
          "num|1-5": 0,
        },
      ],
    },
  ],
});
Mock.setup({
  timeout: "300-1000",
});
