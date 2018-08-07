const chalk = require('chalk')
const figures = require('figures')

module.exports = (tasks, totalTime) => {
  const icon = chalk.bold.green(figures.pointer)
  return `${icon} Tasks finished in ${totalTime}s`
}
