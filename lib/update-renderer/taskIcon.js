const chalk = require('chalk')
const figures = require('figures')

module.exports = (task, level = 0) => {
  const pointer = level === 0 ? 'pointer' : 'pointerSmall'

  if (task.errors.length) return chalk.red(figures.cross)
  if (task.isDone) return chalk.green(figures.tick)
  if (task.isPending) return figures[pointer]

  return chalk.dim(figures[pointer])
}
