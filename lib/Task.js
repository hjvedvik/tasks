class Task {
  constructor (task, tasks) {
    this.task = task
    this.title = task.title
    this.tasks = tasks
    this.subtasks = null
    this.result = null
    this.cache = null

    this.status = null
    this.summary = null
    this.progress = null
    this.errors = []

    this.totalTime = null
    this.isCurrent = false
    this.isDone = false
    this.skipped = false
  }

  run (context) {
    this.tasks.log(true)
    return this.task.task(context, this)
  }

  async skip (context) {
    return typeof this.task.skip === 'function'
      ? this.task.skip(context)
      : !!this.task.skip
  }

  setProgress (done, total, options = {}) {
    const { force = total < 1000, skip = total / 1000 } = options

    this.progress = { done, total }
    this.tasks.log(force, skip)
  }

  setStatus (status, options = {}) {
    const { force = this.status !== status, skip } = options

    this.status = status
    this.tasks.log(force, skip)
  }

  setSummary (summary, options = {}) {
    const { force = this.summary !== summary, skip } = options

    this.summary = summary
    this.tasks.log(force, skip)
  }

  fail (reason) {
    this.errors.push(reason)
  }
}

module.exports = Task
