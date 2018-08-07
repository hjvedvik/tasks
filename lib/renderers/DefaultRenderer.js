const chalk = require('chalk')
const figures = require('figures')
const logUpdate = require('log-update')
const renderTitle = require('./helpers/renderTitle')
const renderStatus = require('./helpers/renderStatus')
const renderProgress = require('./helpers/renderProgress')
const renderSummary = require('./helpers/renderSummary')
const renderError = require('./helpers/renderError')

class TasksRenderer {
  constructor (tasks, options) {
    this.tasks = tasks
    this.options = options
  }

  render () {
    const indentString = (string, count) => {
      return new Array(count).join(' ') + string
    }

    const genOutput = (tasks, level = 0, output = '') => {
      for (const task of tasks) {
        const indent = level * 2
        const messageIndent = indent + 2
        const title = renderTitle(task, level)

        output += indentString(`${title}\n`, indent)

        if (task.progress && task.isPending) {
          const progress = renderProgress(task)
          output += indentString(`${progress}\n`, messageIndent)
        } else if (task.status && task.isPending) {
          const status = renderStatus(task)
          output += indentString(`${status}\n`, messageIndent)
        } else if (task.summary && task.isDone) {
          const summary = renderSummary(task)
          output += indentString(`${summary}\n`, messageIndent)
        }

        if (task.errors.length) {
          task.errors.forEach(message => {
            const error = renderError(message)
            output += indentString(chalk.dim(`- ${message}\n`), messageIndent)
          })
        }

        if (task.subtasks && this.options.showSubtasks) {
          output = genOutput(task.subtasks.tasks, level + 1, output)
        }
      }

      return output
    }

    logUpdate(genOutput(this.tasks))
  }
}

module.exports = TasksRenderer
