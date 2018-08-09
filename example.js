const Tasks = require('.')

const list = new Tasks([
  {
    title: 'Simple task',
    task: () => heavyTask(10)
  },
  {
    title: 'Skip this task',
    skip: () => true,
    task: () => {}
  },
  {
    title: 'Show a progress bar',
    task: (_, task) => {
      task.setProgress(0, 5)
      for (let i = 0; i <= 5; i++) {
        heavyTask(5)
        task.setProgress(i, 5)
      }
    }
  },
  {
    title: 'Show status and summary',
    task: (_, task) => {
      for (let i = 1; i < 5; i++) {
        task.setStatus(`I'm now working with ${i} of 5`)
        heavyTask(4)
      }
      task.setSummary('I finished them all!')
    }
  },
  {
    title: 'Do some more work',
    task: (_, task) => {
      heavyTask(3)
      task.fail('This is the reason for failing')
    }
  },
  {
    title: 'Run sub tasks',
    task: () => new Tasks([
      {
        title: 'Can also show a progress bar',
        task: (_, task) => {
          const length = 10000000
          for (let i = 0; i <= length; i++) {
            task.setProgress(i, length)
          }
        }
      },
      {
        title: 'Another sub task',
        task: () => heavyTask(2)
      }
    ])
  }
])

;(async () => {
  try {
    await list.run()

    if (process.env.SVG_PREVIEW) {
      await heavyTask(20)
    }
  } catch (e) {
    console.log(e)
  }
})()

function heavyTask (l = 1) {
  for (let i = 0; i < l * 100000000; i++) {}
}
