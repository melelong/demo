// 用户登录和注册的表单项验证的通用代码
class FieldValidator {
  /**
   *
   * @param {String} txtId 文本框ID
   * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若无返回值则表示验证无错误。
   */
  constructor(txtId, validatorFunc) {
    this.input = $(`#${txtId}`);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => this.validate();
  }
  /**
   * 验证器
   * @returns {Boolean}
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    this.p.innerText = err ? err : "";
    return !err;
  }
  /**
   * 多验证器: 所有验证器通过返回true,否则返回false
   * @param {validators[]} validators 验证器数组
   * @returns {Boolean}
   */
  static async validate(...validators) {
    const pram = validators.map((v) => v.validate());
    const res = await Promise.all(pram);
    return res.every((r) => r);
  }
}
