#!/usr/bin/env node
const execa = require('execa')

process.env.SVG_PREVIEW = true

execa('svg-term', [
  '--command', 'node example.js',
  '--out', 'art/terminal.svg',
  '--padding-x', '22',
  '--padding-y', '12',
  '--height', '12',
  '--width', '42',
  '--no-cursor',
  '--window'
]).catch(err => {
  console.log(err)
})
