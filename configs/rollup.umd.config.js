import uglify from 'rollup-plugin-uglify'

const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')

const pkg = require('../package.json')
const external = Object.keys(pkg.dependencies)

const plugins = [
  resolve({ main: true, preferBuiltins: true }),
  commonjs(),
  globals(),
  builtins(),
  babel({
    presets: [
      'es2015-rollup'
    ]
  }),
  uglify()
]

export default {
  entry: 'tram-one.js',
  external: external,
  dest: pkg.main,
  format: 'umd',
  plugins: plugins,
  moduleName: 'tram-one',
  sourceMap: true
}
