import MyConsole from './myConsole.js'
import Check from './Check.js'
window.c = new MyConsole()
const cc = new Check({
  WorkerUrl: './js/worker.js',
  time: 3000,
})