const babel = require('rollup-plugin-babel')
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
  resolve({main: true, preferBuiltins: true}),
  unassert(),
  commonjs(),
  globals(),
  builtins(),
  babel({
    presets: [
      ['env', {
        modules: false,
        plugins: ['external-helpers']
      }]
    ]
  }),
  uglify(),
  // sizes(), // useful for finding large dependencies
  filesize()
]

export default {
  entry: 'tram-one.js',
  dest: pkg.browser,
  format: 'umd',
  plugins: plugins,
  moduleName: 'tram-one'
}
