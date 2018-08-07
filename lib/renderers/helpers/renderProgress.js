const chalk = require('chalk')

module.exports = task => {
  const { columns } = process.stdout
  const { done, total } = task.progress
  const bar = progressBar(done, total, columns * 0.4)
  const percent = Math.ceil((done / total) * 100).toString().padStart(3, ' ')
  const status = chalk.dim(`${percent}%`)
  
  return `${bar} ${status}`
}

function progressBar (done, total, trackLength = 24) {
  const progress = done / total
  const doneLength = Math.ceil(trackLength * progress)
  const restLength = trackLength - doneLength
  const doneTrack = chalk.green(''.padStart(doneLength, '—'))
  const restTrack = chalk.dim(''.padStart(restLength, '—'))

  return doneTrack + restTrack
}
