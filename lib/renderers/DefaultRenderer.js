const Renderer = require('./Renderer')
const renderTitle = require('./helpers/renderTitle')
const renderError = require('./helpers/renderError')
const renderFinal = require('./helpers/renderFinal')
const renderStatus = require('./helpers/renderStatus')
const renderSummary = require('./helpers/renderSummary')
const renderProgress = require('./helpers/renderProgress')

const indentString = (string, count) => {
  return new Array(count).join(' ') + string
}

class DefaultRenderer extends Renderer {
  render (task, { level }) {
    const indent = level * 2
    const messageIndent = indent + 2
    const title = renderTitle(task, level, this.options)

    let output = indentString(`${title}\n`, indent)

    if (task.progress && task.isPending) {
      const progress = renderProgress(task, this.options)
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
        output += indentString(`${error}\n`, messageIndent)
      })
    }

    return output
  }

  summary (tasks, { totalTime }) {
    return renderFinal(tasks, totalTime, this.options)
  }
}

module.exports = DefaultRenderer
