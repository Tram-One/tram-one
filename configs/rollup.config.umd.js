const builtins = require('rollup-plugin-node-builtins')
const commonjs = require('rollup-plugin-commonjs')
const filesize = require('rollup-plugin-filesize')
const globals = require('rollup-plugin-node-globals')
const resolve = require('rollup-plugin-node-resolve')
const terser = require('rollup-plugin-terser').terser
const unassert = require('rollup-plugin-unassert')
// const sizes = require('rollup-plugin-sizes')

const pkg = require('../package.json')

const plugins = [
  resolve({
    browser: true
  }),
  builtins(),
  unassert(),
  commonjs(),
  globals(),
  builtins(),
  terser(),
  // sizes(), // useful for finding large dependencies
  filesize()
]

export default {
  input: 'src/tram-one/index.js',
  external: ['domino'],
  output: {
    name: 'tram-one',
    file: pkg.umd,
    globals: {domino: 'domino'},
    format: 'umd'
  },
  plugins: plugins
}
