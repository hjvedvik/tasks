const pMap = require('p-map')
const hirestime = require('hirestime')
const { taskConcurrency, logAndSleep } = require('./utils')
const TTYRenderer = require('./renderers/TTYRenderer')
const NonTTYRenderer = require('./renderers/NonTTYRenderer')
const Task = require('./Task')

class Tasks {
  constructor (tasks, options = {}) {
    this.isTTY = process.stdout.isTTY
    this.parent = this

    this.tasks = tasks.map(task => {
      return new Task(task, this)
    })

    this.options = Object.assign({
      concurrent: false,
      showSummary: false,
      showSubtasks: true,
      collapseSubtasks: true,
      renderer: TTYRenderer,
      nonTTYRenderer: NonTTYRenderer,

      // theme options
      dateFormat: 'HH:mm:ss',
      successColor: 'green',
      progressColor: 'green',
      failColor: 'red'
    }, options)
  }

  /**
   * Add a new task.
   *
   * @param {Object} task
   */
  add (task) {
    this.tasks.push(task)
  }

  /**
   * Run tasks.
   *
   * @param  {Object}   context User defined context that will be
   *                            passed down to all tasks.
   * @return {Promise}
   */
  async run (context = {}) {
    const { renderer, nonTTYRenderer, concurrent } = this.options
    const Renderer = this.isTTY ? renderer : nonTTYRenderer
    const concurrency = taskConcurrency(concurrent)

    this.renderer = new Renderer(this.tasks, this.options, this.level)

    const promises = pMap(this.tasks, async task => {
      const time = hirestime()
      const skip = await task.skip(context)

      if (!skip) {
        task.isCurrent = true

        const result = await task.run(context)

        if (result instanceof Tasks) {
          task.subtasks = result
          task.subtasks.parent = this.parent
        } else {
          task.totalTime = time(hirestime.S)
        }

        task.isCurrent = false
      } else {
        task.skipped = true

        // set summary if skip method returned a string
        if (typeof skip === 'string') {
          task.summary = skip
        }
      }

      // re-render and wait some milliseconds if task rendered
      // a progress bar to let user see that the bar reached 100%
      if (task.progress) await logAndSleep(this)

      // the task returned a new set of tasks
      if (task.subtasks) {
        await task.subtasks.run(context)

        // end parent timer after all subtasks
        task.totalTime = time(hirestime.S)

        // also re-render and wait some milliseconds after subtasks
        // to let user see last that the last task succeeds
        await logAndSleep(this)

        // remove all subtasks when collapsing, except tasks with errors
        if (this.options.collapseSubtasks) {
          task.subtasks.tasks = task.subtasks.tasks.filter(task => {
            return !!task.errors.length
          })
        }
      }

      task.cache = null
      task.isDone = true
    }, { concurrency })

    return promises.then(async () => {
      if (this.parent === this) {
        await logAndSleep(this)
        this.renderer.done()
      }

      return context
    })
  }

  /**
   * Render the output for all tasks in this set. Output from inactive
   * tasks will be cached until they are active.
   *
   * @return {String}
   */
  render (level = 0) {
    let output = ''

    for (const task of this.tasks) {
      if (task.isCurrent || !this.isTTY || !task.cache) {
        task.cache = this.renderer.render(task, { level })
        task.isRendered = true
      }

      output += task.cache

      if (task.subtasks && this.options.showSubtasks) {
        output += task.subtasks.render(level + 1)
      }
    }

    return output
  }

  /**
   * Log output.
   *
   * @param  {Boolean} force Force a render.
   * @param  {Number}  skip  Amount of renders to skip before actually
   *                         rendering new output. Useful for tasks
   *                         which will trigger lots of renders which
   *                         again will reduce overall performance.
   */
  log (force = false, skip = 0) {
    const render = parent => {
      parent._skippedRenders = 0
      parent._lastRender = process.hrtime()

      const result = parent.render().trim()

      if (result) {
        this.renderer.log(result)
      }
    }

    const { parent } = this

    // forcing a re-render
    if (force) return render(parent)

    // wants to skip certain re-renders
    if (skip && skip > parent._skippedRenders) {
      return parent._skippedRenders++
    }

    // render maximum 60 frames per second
    const lastRender = process.hrtime(parent._lastRender)
    if ((lastRender[1] / 1000000) > 1000 / 60) {
      return render(parent)
    }
  }
}

module.exports = Tasks
