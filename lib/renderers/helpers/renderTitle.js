const chalk = require('chalk')
const figures = require('figures')

module.exports = (task, level) => {
  const icon = taskIcon(task, level)
  let title = task.title

  if (task.skipped) {
    title += chalk.dim(' [skipped]')
  } else if (task.errors.length && task.totalTime) {
    title += chalk.dim(` [failed after ${task.totalTime}s]`)
  } else if (task.isDone && task.totalTime) {
    title += chalk.dim(` ${task.totalTime}s`)
  }

  return `${icon} ${title}`
}

function taskIcon (task, level) {
  const pointer = level === 0 ? 'pointer' : 'pointerSmall'

  if (task.errors.length) return chalk.bold.red(figures[pointer])
  if (task.isDone) return chalk.bold.green(figures[pointer])
  if (task.isPending) return chalk.bold(figures[pointer])

  return chalk.bold.dim(figures[pointer])
}
