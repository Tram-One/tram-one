const buble = require('rollup-plugin-buble')
const filesize = require('rollup-plugin-filesize')
const pkg = require('../package.json')

const external = Object.keys(pkg.dependencies)

const plugins = [
  buble({target: {node: 6}}),
  filesize()
]

export default {
  input: 'tram-one.js',
  external: external,
  plugins: plugins,
  output: {
    format: 'es',
    file: pkg.module
  }
}
