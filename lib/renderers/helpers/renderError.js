const chalk = require('chalk')

module.exports = (error, { failColor }) => {
  return chalk[failColor](`- ${error}`)
}
