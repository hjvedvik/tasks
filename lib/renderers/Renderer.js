class Renderer {
  constructor (tasks, options = {}, level = 0) {
    this.tasks = tasks
    this.options = options
    this.level = level
  }

  render () { return '' }
  done () { return '' }
  log () {}
}

module.exports = Renderer
