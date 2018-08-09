class Task {
  constructor (task, tasks) {
    this.task = task
    this.title = task.title
    this.exitOnError = task.exitOnError || true
    this.tasks = tasks
    this.subtasks = null
    this.result = null
    this.cache = null

    this.status = null
    this.summary = null
    this.progress = null
    this.errors = []

    this.totalTime = null
    this.isPending = true
    this.isCurrent = false
    this.isFailed = false
    this.isDone = false
    this.isSkipped = false
  }

  run (context) {
    this.tasks.log(true)

    try {
      return this.task.task(context, this)
    } catch (e) {
      this.isDone = true
      this.isFailed = true
      this.tasks.log(true)

      if (this.exitOnError) throw e
      else this.errors.push(e.message)
    }
  }

  async skip (context) {
    return typeof this.task.skip === 'function'
      ? this.task.skip(context)
      : !!this.task.skip
  }

  setProgress (done, total, options = {}) {
    if (!this.tasks.isTTY) return

    const { force, skip } = options

    this.progress = { done, total }
    this.tasks.log(force, skip)
  }

  setStatus (status, options = {}) {
    if (!this.tasks.isTTY) return

    const { force = this.status !== status, skip } = options

    this.status = status
    this.tasks.log(force, skip)
  }

  setSummary (summary, options = {}) {
    const { force = this.summary !== summary, skip } = options

    this.summary = summary
    this.tasks.log(force, skip)
  }

  fail (reason, exit = false) {
    this.isFailed = true
    if (exit) throw new Error(reason)
    else this.errors.push(reason)
  }
}

module.exports = Task
