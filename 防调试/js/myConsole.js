/**
 * 重写console
 */
export default class MyConsole {
  // 定时器id
  #_clearId = null;
  // 定时器时间
  clearTimer
  constructor(clearTimer = 1000) {
    this.clearTimer = clearTimer
    this.#_cloneConsole()
    this.#_startClear()
  }
  /**
   * 克隆console
   */
  #_cloneConsole() {
    for (let key in console) {
      const value = console[key]
      if (value instanceof Function && key !== 'clear') {
        this[key] = (...args) => {
          value.bind(console).apply(console, args);
        }
        console[key] = null
      } else {
        this[key] = console[key]
      }
    }
  }
  /**
   * 开启清空
   */
  #_startClear() {
    this.#_clearId = setInterval(this.clear, this.clearTimer)
  }
  /**
   * 停止清空
   */
  stopClear() {
    clearInterval(this.#_clearId)
    this.#_clearId = null
  }
}
