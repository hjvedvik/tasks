const chalk = require('chalk')
const figures = require('figures')

module.exports = (done, total, trackLength = 24) => {
  const progress = done / total
  const doneLength = Math.ceil(trackLength * progress)
  const restLength = trackLength - doneLength
  const doneTrack = ''.padStart(doneLength, figures.square)
  const restTrack = chalk.dim(''.padStart(restLength, figures.square))

  return doneTrack + restTrack
}
