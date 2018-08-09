const Renderer = require('./Renderer')
const logUpdate = require('log-update')
const renderProgress = require('./helpers/renderProgress')
const indentString = require('./helpers/indentString')

class TTYRenderer extends Renderer {
  render (task, { level }) {
    const indent = level * 2
    const messageIndent = indent + 2
    const icon = this.renderIcon(task, level)
    const duration = this.renderDuration(task)
    const skipped = this.renderSkipped(task)

    let title = this.renderTitle(task)

    if (skipped) title += ` ${skipped}`
    if (duration) title += ` ${duration}`

    let output = indentString(`${icon} ${title}\n`, indent)

    if (task.isCurrent && task.progress) {
      const progress = renderProgress(task, this.theme)
      output += indentString(`${progress}\n`, messageIndent)
    } else if (task.isCurrent && task.status) {
      const status = this.renderSubtitle(task.status)
      output += indentString(`${status}\n`, messageIndent)
    } else if (task.isDone && task.summary) {
      const summary = this.renderSubtitle(task.summary)
      output += indentString(`${summary}\n`, messageIndent)
    }

    if (task.isFailed) {
      task.errors.forEach(message => {
        const error = this.renderError(message)
        output += indentString(`${error}\n`, messageIndent)
      })
    }

    return output
  }

  renderIcon (task, level = 0) {
    const icon = super.renderIcon(task, level)

    if (task.isFailed && task.isDone) return this.theme.error(icon)
    else if (task.isCurrent) return icon
    else if (task.isSkipped) return this.theme.dim(icon)
    else if (task.isDone) return this.theme.success(icon)
    else if (task.isPending) return this.theme.dim(icon)

    return icon
  }

  renderTitle (task) {
    return task.isFailed && task.isDone
      ? this.theme.error(task.title)
      : task.title
  }

  renderSkipped (task) {
    return task.isSkipped ? this.theme.dim('skipped') : null
  }

  renderDuration (task) {
    return this.theme.dim(super.renderDuration(task))
  }

  renderSubtitle (string) {
    return this.theme.dim(super.renderSubtitle(string))
  }

  renderError (string) {
    return this.theme.dim(super.renderError(string))
  }

  log (output) {
    logUpdate(output.trim())
  }

  done () {
    logUpdate.done()
  }
}

module.exports = TTYRenderer
