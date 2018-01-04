#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const notify = require('../src/utilities/logger').notify
const cwd = process.cwd()

module.exports = () => {

  notify('Adding some sensible defaults…\n')

  const createDir = src =>
    fs.ensureDirSync(
      path.resolve(cwd, src)
    )
  const copySrc = src =>
    fs.copySync(
      path.resolve(cwd, 'node_modules/tapestry-wp/bootstrap/', src),
      path.resolve(cwd, src), { overwrite: false }
    )

  createDir('public')
  copySrc('tapestry.config.js')
  copySrc('components')
  copySrc('styles')

  notify('Sensible defaults ahoy!\n')
}
