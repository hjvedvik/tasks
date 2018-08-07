const chalk = require('chalk')
const figures = require('figures')

module.exports = task => {
  return chalk.dim(`${figures.arrowRight} ${task.status}`)
}
