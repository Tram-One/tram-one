const builtins = require('rollup-plugin-node-builtins')
const commonjs = require('rollup-plugin-commonjs')
const filesize = require('rollup-plugin-filesize')
const globals = require('rollup-plugin-node-globals')
const resolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')
const unassert = require('rollup-plugin-unassert')
// const sizes = require('rollup-plugin-sizes')

const pkg = require('../package.json')

const plugins = [
  resolve({
    main: true,
    preferBuiltins: true,
    browser: true
  }),
  builtins(),
  unassert(),
  commonjs(),
  globals(),
  builtins(),
  uglify(),
  // sizes(), // useful for finding large dependencies
  filesize()
]

export default {
  input: 'tram-one.js',
  external: ['domino'],
  globals: {domino: 'domino'},
  output: {
    file: pkg.umd,
    format: 'umd'
  },
  plugins: plugins,
  name: 'tram-one'
}
