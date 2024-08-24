export default class Check {
  time
  constructor({ WorkerUrl, time = 0 }) {
    this.time = time
    this._checkTool()
    this._checkDebugger(WorkerUrl)
  }
  /**
   * 检测打开开发者工具
   */
  _checkTool() {
    const checkWidth = 0.7959606421543242
    const checkHeight = 0.691470054446461
    const checkWidthSize = 0.95
    const checkHeightSize = 0.79
    const getWidthSize = () => {
      return window.innerWidth / window.outerWidth
    }
    const getHeightSize = () => {
      return window.innerHeight / window.outerHeight
    }
    let open = (getWidthSize() <= checkWidthSize && getWidthSize() !== checkWidth) || (getHeightSize() <= checkHeightSize && getHeightSize() !== checkHeight)
    open && this._checkClose()
    const d = this._debounce(() => {
      open = (getWidthSize() <= checkWidthSize && getWidthSize() !== checkWidth) || (getHeightSize() <= checkHeightSize && getHeightSize() !== checkHeight)
      open && this._checkClose()
    }, 500)
    window.addEventListener('resize', d)
  }
  /**
   * 检测debugger
   */
  _checkDebugger(WorkerUrl) {
    const worker = new Worker(WorkerUrl)
    worker.onmessage = async ({ data }) => {
      this._checkClose()
    }
    worker.postMessage('不要打印')
  }
  async _checkClose() {
    const span = document.querySelector('span')
    span.innerText = `检测到调试${this.time}毫秒后关闭`
    this.time !== 0 && await this._sleep(this.time)
    this._closeWindow()
  }
  _debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  /**
   * 关闭当前标签页
   */
  _closeWindow() {
    window.open('https://www.baidu.com', '_self')
    window.close()
  }
  /**
   * 睡眠
   * @param {*} time 
   * @returns 
   */
  _sleep(time = 1000) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time)
    })
  }
}