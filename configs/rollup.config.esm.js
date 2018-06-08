const filesize = require('rollup-plugin-filesize')
const pkg = require('../package.json')

const external = Object.keys(pkg.dependencies)

const plugins = [
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
