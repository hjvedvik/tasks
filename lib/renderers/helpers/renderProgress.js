const chalk = require('chalk')

module.exports = (task, { progressColor }) => {
  const { done, total } = task.progress
  const safeDone = Math.min(done, total)
  const percent = Math.ceil((safeDone / total) * 100)
  const bar = progressBar(percent, progressColor)
  const status = chalk.dim(`${percent.toString().padStart(3, ' ')}%`)

  return `${bar} ${status}`
}

function progressBar (percent, color) {
  const { columns } = process.stdout
  const trackLength = Math.ceil(columns * 0.4)
  const doneLength = Math.ceil(trackLength * (percent / 100))
  const restLength = trackLength - doneLength
  const doneTrack = chalk[color](''.padStart(doneLength, '—'))
  const restTrack = chalk.dim(''.padStart(restLength, '—'))

  return doneTrack + restTrack
}
