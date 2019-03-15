const filesize = require('rollup-plugin-filesize')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const pkg = require('../package.json')

const external = Object.keys(pkg.dependencies)

const plugins = [
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  filesize()
]

export default {
  input: 'src/tram-one/index.js',
  external: external,
  plugins: plugins,
  output: {
    file: pkg.module,
    format: 'esm'
  }
}
