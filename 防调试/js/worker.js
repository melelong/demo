this.onmessage = ({ data }) => {
  console = data;
}
/**
 * 后台检测debugger
 */
(() => {
  const checkTimer = 50
  let count = 0
  setInterval(loop, 1);
  function loop() {
    const startTime = new Date().getTime()
    debugger
    if (new Date().getTime() - startTime > checkTimer) {
      count++
      this.postMessage(`调试次数${count}`)
    }
  }
})()