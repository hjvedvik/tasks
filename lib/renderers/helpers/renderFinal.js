const chalk = require('chalk')
const figures = require('figures')

module.exports = (tasks, totalTime, { successColor }) => {
  const icon = chalk.bold[successColor](figures.pointer)
  return `${icon} Tasks finished in ${totalTime}s`
}
