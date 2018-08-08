const Renderer = require('./Renderer')
const logUpdate = require('log-update')
const renderTitle = require('./helpers/renderTitle')
const renderError = require('./helpers/renderError')
const renderStatus = require('./helpers/renderStatus')
const renderSummary = require('./helpers/renderSummary')
const renderProgress = require('./helpers/renderProgress')
const indentString = require('./helpers/indentString')

class TTYRenderer extends Renderer {
  render (task, { level }) {
    const indent = level * 2
    const messageIndent = indent + 2
    const title = renderTitle(task, level, this.options)

    let output = indentString(`${title}\n`, indent)

    if (task.isCurrent && task.progress) {
      const progress = renderProgress(task, this.options)
      output += indentString(`${progress}\n`, messageIndent)
    } else if (task.isCurrent && task.status) {
      const status = renderStatus(task)
      output += indentString(`${status}\n`, messageIndent)
    } else if (task.isDone && task.summary) {
      const summary = renderSummary(task)
      output += indentString(`${summary}\n`, messageIndent)
    }

    if (task.errors.length) {
      task.errors.forEach(message => {
        const error = renderError(message, this.options)
        output += indentString(`${error}\n`, messageIndent)
      })
    }

    return output
  }

  log (output) {
    logUpdate(output.trim())
  }

  done () {
    logUpdate.done()
  }
}

module.exports = TTYRenderer
