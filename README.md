# @hjvedvik/tasks

> This package shares many similarities with [listr](https://github.com/SamVerschueren/listr), but is more suited for synchronous code.

<pre>
  <p align="center">
    <img width="450" src="https://cdn.rawgit.com/hjvedvik/tasks/8305521/art/terminal.svg">
  </p>
</pre>

## Install

```sh
npm install @hjvedvik/tasks
```

## Usage

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
    skip: () => true, // true, false, string
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

## Roadmap for v1.0

- [x] Render in TTY and non-TTY environments
- [ ] Determine a stable API
- [ ] Create tests
