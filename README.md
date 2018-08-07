# @hjvedvik/tasks

> This package shares many similarities with [listr](https://github.com/SamVerschueren/listr), but is more suited for synchronous code.

<img src="https://raw.githubusercontent.com/hjvedvik/tasks/master/art/terminal.gif">

### Install

```sh
npm install @hjvedvik/tasks
```

### Usage

```js
const Tasks = require('@hjvedvik/tasks')

const tasks = new Tasks([
  {
    title: 'Simple task',
    task: (context, task) => {
      // task.setProgress(1, 5)
      // task.setStatus('')
      // task.setSummary('')
      // task.fail('')
    }
  },
  {
    title: 'Sub tasks',
    task: () => new Tasks([
      {
        title: 'Another task',
        task: () => {
          // task.setProgress(1, 10)
        }
      }
    ])
  }
])

tasks.run({
  // context
})
```
