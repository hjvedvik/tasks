module.exports = (task, theme) => {
  const { done, total } = task.progress
  const safeDone = Math.min(done, total)
  const percent = Math.ceil((safeDone / total) * 100)
  const bar = progressBar(percent, theme)
  const status = theme.dim(`${percent.toString().padStart(3, ' ')}%`)

  return `${bar} ${status}`
}

function progressBar (percent, theme) {
  const { columns = 80 } = process.stdout
  const trackLength = Math.ceil(columns * 0.4)
  const doneLength = Math.ceil(trackLength * (percent / 100))
  const restLength = trackLength - doneLength
  const doneTrack = theme.progress(''.padStart(doneLength, '\u2500'))
  const restTrack = theme.dim(''.padStart(restLength, '\u2500'))

  return doneTrack + restTrack
}
